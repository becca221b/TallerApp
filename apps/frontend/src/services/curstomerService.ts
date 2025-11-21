import axiosClient from "../api/axiosClient";
import { Customer } from "../dtos/dto";

//Get customers
const getCustomers = async () =>{
    const response = await axiosClient.get("/customers");
    return response.data;
};

export default{
    getCustomers
}