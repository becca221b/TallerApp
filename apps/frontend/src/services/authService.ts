import axiosClient from "../api/axiosClient";

const login = async (username: string, password: string) => {
    const response = await axiosClient.post("/auth/login", { username, password });
    return response.data;
};

export default {
    login
};
