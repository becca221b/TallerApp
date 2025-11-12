import axiosClient from "src/api/axiosClient";
import { Employee } from "src/dtos/dto";

//Get: Obterner todos los empleados
const getEmployees = async () => {
    const response = await axiosClient.get("/employees");
    return response.data;
};



//Exportar las funciones
export default {
    getEmployees,
    
};