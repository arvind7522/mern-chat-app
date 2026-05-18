import axios from "axios"

const Api=axios.create({
    baseURL:"https://mern-chat-app-ot09.onrender.com/api"
})

export default Api;