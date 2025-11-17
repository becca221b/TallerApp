import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import orderService from "../services/orderService";
import { Order } from '../dtos/dto';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card.js';
import { Button } from "../components/button.js";
import { Badge } from "../components/badge.js";
import { Alert, AlertDescription, AlertTitle } from "../components/alert.js";
import { LogOut, CheckCircle } from "lucide-react";
import { toast } from 'sonner';
import employeeService from "../services/employeeService";


const CostureroDashboard = () =>{
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if(!user ){
            navigate('/login');
            return;
        }
        loadOrders();
    },[user, navigate]);

    const loadOrders = async () => {
        if (!user) return;
        try {
            const userLogged = await employeeService.getEmployeeByUsername(user.username);
            const response = await orderService.getOrdersByEmployeeId(userLogged.id);
            setOrders(response.orders);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
            setIsLoading(false);
        }
    };

    const handleCompleteOrder = async(orderId: string) =>{
        try {
            await orderService.updateOrderStatus(orderId, 'Completada');
            toast.success('Orden completada exitosamente');
            loadOrders();
        } catch (error) {
            console.error('Error al completar la orden:', error);
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
        pending: { label: 'Pendiente', variant: 'outline' as const },
        'in process': { label: 'En Proceso', variant: 'warning' as const },
        completed: { label: 'Completado', variant: 'success' as const },
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Costurero</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Mis Órdenes Asignadas</h2>
          <p className="text-muted-foreground">
            Tienes {orders.length} orden(es) asignada(s)
          </p>
        </div>

        {orders.length === 0 ? (
          <Alert>
            <AlertTitle>No hay órdenes asignadas</AlertTitle>
            <AlertDescription>
              Actualmente no tienes órdenes asignadas. El supervisor te asignará nuevas órdenes pronto.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              order.id && (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Orden #{order.id.slice(-6)}</CardTitle>
                    {getStatusBadge(order.status as string)}
                  </div>
                  {order.customerId && (
                    <p className="text-sm text-muted-foreground">{order.customerId}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">${order.totalPrice?.toFixed(2) }</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prendas:</span>
                    <span className="font-medium">{order.orderDetails.length}</span>
                  </div>
                  {order.deliveryDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entrega:</span>
                      <span className="font-medium">
                        {new Date(order.deliveryDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                  {order.status === 'in process' && (
                    <Button
                      onClick={() => order.id && handleCompleteOrder(order.id)}
                      size="sm"
                      className="w-full mt-4"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Completada
                    </Button>
                  )}
                </CardContent>
              </Card>)
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CostureroDashboard;
