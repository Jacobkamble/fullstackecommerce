import { toast } from "react-toastify";


export const showErrorMessage = (error) => {
    if (error && error?.data?.message) {
        toast.error(error.data.message);
    }
    else {
        toast.error("Something went wrong.Please Try again...!!!");
    }

};


