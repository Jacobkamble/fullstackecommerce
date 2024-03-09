import { toast } from "react-toastify";


export const getErrorMessage = (error) => {
    if (error && error?.data?.message) {
        toast.error(error.data.message);
    }
    toast.error("An error occurred while fetching data");
};