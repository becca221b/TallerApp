import axiosClient from "../api/axiosClient";

const getGarments = async () => {
    const response = await axiosClient.get("/garments");
    return response.data;
};

export default {
    getGarments
};
