import { useEffect, useState } from "react";
import { useAuth } from "/useAuth";
import { useNavigate } from 'react-router-dom';
import { ordersApi, Order } from  "@/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from '../components/card';
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import { LogOut, CheckCircle } from "lucide-react";
//import { toast } from 'sonner';

const CostureroDashboard = () =>{
    const { user, LogOut } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if(!user || user.role !== 'Costurero'){
            navigate('/login');
            return;
        }
        loadOrders();
    },[user, navigate]);

    const loadOrders = async () => {
        if (!user) return;
        try {
            const response = await ordersApi.getOrdersByEmployeeId(user.id);
            setOrders(response.data);
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
            setIsLoading(false);
        }
    };

    const handleCompleteOrder = async(orderId: string) =>{
        try {
            await ordersApi.updateOrderStatus(orderId, 'Completada');
            toast.success();
            loadOrders();
        } catch (error) {
            console.error('Error al completar la orden:', error);
        }
    }

    
}