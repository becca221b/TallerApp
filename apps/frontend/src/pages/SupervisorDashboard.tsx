import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import orderService from "../services/orderService";
import customerService from '../services/curstomerService';
import employeeService from "../services/employeeService";
import garmentService from "../services/garmentService";
import { Order, Employee, Garment, Customer } from '../dtos/dto';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/card.js';
import { Button } from "../components/button.js";
import { Badge } from "../components/badge.js";
import { Alert, AlertDescription, AlertTitle } from "../components/alert.js";
import { LogOut, Plus, UserPlus } from "lucide-react";
import { toast } from 'sonner';

const SupervisorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [garments, setGarments] = useState<Garment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const [ordersResponse, customersResponse, employeesResponse, garmentsResponse] = await Promise.all([
                orderService.getOrders(),
                customerService.getCustomers(),
                employeeService.getEmployees(),
                garmentService.getGarments(),
            ]);
            setOrders(ordersResponse.orders);
            setCustomers(customersResponse);
            setEmployees(employeesResponse.employees);
            setGarments(garmentsResponse);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            setIsLoading(false);
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData(e.target as HTMLFormElement);
      const customerId = formData.get('customerId') as string;
      const garmentId = formData.get('garmentId') as string;
      const deliveryDate = formData.get('deliveryDate') as string;
      const quantity = Number(formData.get('quantity'));
      const price = Number(formData.get('price'));
      const sex = formData.get('sex') as string;
      const size = formData.get('size') as string;


      const validatedSex = (sex === 'M' || sex === 'F' || sex === 'U') ? sex : 'U';
      
      const customer = customers.find((c) => c.id === customerId);
      const garment = garments.find((g) => g.id === garmentId);
    

      if(!customer){
        toast.error('Selecciona un cliente');
        return;
      }

      if(!garment){
        toast.error('Selecciona una prenda');
        return;
      }

      try {
           await orderService.createOrder({
            customerId: customer.id,
            deliveryDate: new Date(deliveryDate).toISOString(),
            orderDetails: [{
              id: garmentId,
              name: garment.name,
              quantity: quantity,
              size: size,
              sex: validatedSex,
              price: price,
              
            }],
            status: 'pending',
           });
       
           toast.success('Orden creada exitosamente');
           setShowCreateForm(false);
           (e.target as HTMLFormElement).reset();
           loadData();
      } catch (error) {
           toast.error('Error al crear la orden');
      }
    };

    const handleAssignOrder = async(e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const employeeId = formData.get('employeeId') as string;
      
      const employee = employees.find((emp)=>emp.id === employeeId);
      if(!employee){
        toast.error('Selecciona un empleado');
        return;
      }

      if (!user) {
        toast.error('No hay un usuario autenticado');
        return;
      }

      try {
        await orderService.assignOrder(selectedOrderId, employee.id, user.id);
        toast.success('Orden asignada exitosamente');
        setShowAssignForm(false);
        setSelectedOrderId('');
        (e.target as HTMLFormElement).reset();
        loadData();
      } catch (error) {
        toast.error('Error al asignar la orden');
      }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status: Order['status']) => {
        const statusConfig = {
        'pending': { label: 'Pendiente', variant: 'outline' as const },
        'in process': { label: 'En Proceso', variant: 'warning' as const },
        'completed': { label: 'Completado', variant: 'success' as const },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      );
    }


  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inProcessOrders = orders.filter((o) => o.status === 'in process');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Supervisor</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {user?.username}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nueva Orden</CardTitle>
              <CardDescription>Completa la información para crear una nueva orden</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <select
                    name="customerId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Selecciona un cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.customerName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prenda</label>
                  <select
                    name="garmentId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Selecciona una prenda</option>
                    {garments.map((garment) => (
                      <option key={garment.id} value={garment.id}>
                        {garment.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha de Entrega</label>
                  <input
                    name="deliveryDate"
                    type="date"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cantidad</label>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      defaultValue="1"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio Unitario</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="100"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Talla</label>
                    <select
                      name="size"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecciona una talla</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sexo</label>
                    <select
                      name="sex"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecciona sexo</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="U">Unisex</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Crear Orden</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showAssignForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Asignar Orden a Costurero</CardTitle>
              <CardDescription>Selecciona un costurero para asignar esta orden</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignOrder} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Costurero</label>
                  <select
                    name="employeeId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Selecciona un costurero</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Asignar</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowAssignForm(false);
                    setSelectedOrderId('');
                  }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pendientes</CardTitle>
              <CardDescription>{pendingOrders.length} órdenes</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>En Proceso</CardTitle>
              <CardDescription>{inProcessOrders.length} órdenes</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completadas</CardTitle>
              <CardDescription>{completedOrders.length} órdenes</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Órdenes Pendientes</h2>
            {pendingOrders.length === 0 ? (
              <p className="text-muted-foreground">No hay órdenes pendientes</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingOrders.map((order) => (
                  order.id && (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prendas:</span>
                        <span className="font-medium">{order.orderDetails.length}</span>
                      </div>
                      <Button
                        onClick={() => {
                          if (order.id) {
                            setSelectedOrderId(order.id);
                            setShowAssignForm(true);
                          }
                        }}
                        size="sm"
                        className="w-full mt-4"
                        variant="secondary"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Asignar Costurero
                      </Button>
                    </CardContent>
                  </Card>)
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Órdenes en Proceso</h2>
            {inProcessOrders.length === 0 ? (
              <p className="text-muted-foreground">No hay órdenes en proceso</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inProcessOrders.map((order) => (
                  order.id && (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prendas:</span>
                        <span className="font-medium">{order.orderDetails.length}</span>
                      </div>
                    </CardContent>
                  </Card>)
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Órdenes Completadas</h2>
            {completedOrders.length === 0 ? (
              <p className="text-muted-foreground">No hay órdenes completadas</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedOrders.map((order) => (
                  order.id && (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prendas:</span>
                        <span className="font-medium">{order.orderDetails.length}</span>
                      </div>
                    </CardContent>
                  </Card>)
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;

        
