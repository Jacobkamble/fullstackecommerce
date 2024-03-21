import axios from "axios"

export const loadApiKey = async () => {

    return (await axios.get(`http://localhost:4000/api/v1/stripeapikey`, { headers: { "Authorization": localStorage.getItem("token") } }))?.data?.stripeApiKey;
}