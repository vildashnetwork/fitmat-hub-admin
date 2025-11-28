// src/utils/api.ts
import axios from "axios";

export const BASE_URL = "https://faap.onrender.com/events";

export async function fetchEvents() {
    const res = await axios.get(BASE_URL);
    return res.data;
}

export async function fetchEventById(id: string) {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
}

export async function createEvent(payload: any) {
    const res = await axios.post(BASE_URL, payload);
    return res.data;
}

export async function updateEvent(id: string, payload: any) {
    const res = await axios.put(`${BASE_URL}/${id}`, payload);
    return res.data;
}

export async function deleteEvent(id: string) {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
}
