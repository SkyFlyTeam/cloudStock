import axios from "axios";

export const Api = () =>{
    return axios.create({
        baseURL: 'http://localhost:5000'
    })
}

export const hostname = 'http://localhost:5000/'