// src/api.js
import axios from "axios";

const API_BASE = "https://faap.onrender.com"; // your server base

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    // you can enable credentials if your server uses cookies:
    // withCredentials: true
});

export default api;
