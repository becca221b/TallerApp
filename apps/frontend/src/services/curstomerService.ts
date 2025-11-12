import axiosClient from "src/api/axiosClient";
import { Customer } from "src/dtos/dto";

//Get customers
const getCustomers = async () =>{
    const response = await axiosClient.get("/customers");
    return response.data;
};

export default{
    getCustomers
}