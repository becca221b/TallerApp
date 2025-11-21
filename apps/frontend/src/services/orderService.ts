import axiosClient from "../api/axiosClient";
import { Order } from '../dtos/dto';

//Get: Obterner todas las órdenes
const getOrders = async () => {
    const response = await axiosClient.get("/orders");
    return response.data;
};

//Get: Obterner todas las órdenes por empleado
const getOrdersByEmployeeId = async (employeeId: string) => {
    const response = await axiosClient.get(`/orders/employee/${employeeId}`);
    return response.data;
};

//Post: Crear una orden
const createOrder = async (order: Order) => {
    const response = await axiosClient.post("/orders", order);
    return response.data;
};

//Post: Asignar una orden a un empleado
const assignOrder = async (orderId: string, employeeId: string, supervisorId:string) => {
    const response = await axiosClient.put("/orders/assign", {orderId, employeeId, assignedBySupervisorId: supervisorId});
    return response.data;
};

//Put: Actualizar el estado de una orden
const updateOrderStatus = async (orderId: string, status: string, employeeId: string) => {
    const response = await axiosClient.put(`/orders/update-status`, { orderId, status, employeeId });
    return response.data;
};

//Exportar las funciones
export default {
    getOrders,
    getOrdersByEmployeeId,
    createOrder,
    assignOrder,
    updateOrderStatus
};
