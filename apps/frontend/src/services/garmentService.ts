import axiosClient from "../api/axiosClient";

const getGarments = async () => {
    const response = await axiosClient.get("/garments");
    console.log(response.data);
    return response.data;
};

export default {
    getGarments
};
