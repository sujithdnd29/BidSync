import axios from "axios";

const API_URL = "http://localhost:5000/api/auctions";

export const createAuction = async (auctionData) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        auctionData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
  
};
  export const getAllAuctions = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
export const getAuctionById = async (id) => {

    const response = await axios.get(`${API_URL}/${id}`);

    return response.data;

};
export const deleteAuction = async (id) => {

    const token = localStorage.getItem("token");

    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
export const getMyAuctions = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/my-auctions`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
export const getWonAuctions = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/won`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};