import axios from "axios"

export const loadApiKey = async () => {

    try {
        return (await axios.get(`http://localhost:4000/api/v1/stripeapikey`, { headers: { "Authorization": localStorage.getItem("token") } }))?.data?.stripeApiKey;
    } catch (error) {
        console.log(error)
    }
}