import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import orderService from "../services/orderService";
import customerService from "../services/customerService";
import employeeService from "../services/employeeService";
import { Order, OrderStatus } from '@/domain/entities/Order';
import { Employee } from '@/domain/entities/Employee';
import { Customer } from '@/domain/entities/Customer';
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
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const [ordersResponse, customersResponse, employeesResponse] = await Promise.all([
                orderService.getOrders(),
                customerService.getCustomers(),
                employeeService.getEmployees(),
            ]);
            setOrders(ordersResponse);
            setCustomers(customersResponse);
            setEmployees(employeesResponse);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            setIsLoading(false);
        }
    };

    const handleCreateOrder = () => {
        setShowCreateForm(true);
    };

    const handleAssignOrder = (orderId: string) => {
        setSelectedOrder(orderId);
        setShowAssignForm(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
        pending: { label: 'Pendiente', variant: 'outline' as const },
        in_process: { label: 'En Proceso', variant: 'warning' as const },
        completed: { label: 'Completado', variant: 'success' as const },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getCustomerName = (customerId: string) => {
        const customer = customers.find((c) => c.id === customerId);
        return customer ? customer.customerName : 'Cliente Desconocido';
    };

    const getEmployeeName = (employeeId: string) => {
        const employee = employees.find((e) => e.id === employeeId);
        return employee ? employee.name : 'Empleado Desconocido';
    };

    const getEmployeeUsername = (employeeId: string) => {
        const employee = employees.find((e) => e.id === employeeId);
        return employee ? employee.username : 'Empleado Desconocido';
    };

    const getEmployeeRole = (employeeId: string) => {
        const employee = employees.find((e) => e.id === employeeId);
        return employee ? employee.employeeType : 'Empleado Desconocido';
    };

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
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status as OrderStatus)}
                      </div>
                      {getCustomerName(order.customerId) && (
                        <p className="text-sm text-muted-foreground">{getCustomerName(order.customerId)}</p>
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
                          setSelectedOrderId(order.id);
                          setShowAssignForm(true);
                        }}
                        size="sm"
                        className="w-full mt-4"
                        variant="secondary"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Asignar Costurero
                      </Button>
                    </CardContent>
                  </Card>
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
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status as OrderStatus)}
                      </div>
                      {getCustomerName(order.customerId) && (
                        <p className="text-sm text-muted-foreground">{getCustomerName(order.customerId)}</p>
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
                  </Card>
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
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                        {getStatusBadge(order.status as OrderStatus)}
                      </div>
                      {getCustomerName(order.customerId) && (
                        <p className="text-sm text-muted-foreground">{getCustomerName(order.customerId)}</p>
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
                  </Card>
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

        
