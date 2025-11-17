import axiosClient from "../api/axiosClient";
import { Employee } from "../dtos/dto";

//Get: Obterner todos los empleados
const getEmployees = async () => {
    const response = await axiosClient.get("/employees");
    return response.data;
};

const getEmployeeByUsername = async (username: string) => {
    const response = await axiosClient.get(`/employees/username/${username}`);
    return response.data;
};



//Exportar las funciones
export default {
    getEmployees,
    getEmployeeByUsername
};