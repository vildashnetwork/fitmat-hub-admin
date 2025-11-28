// src/utils/api.ts
import axios from "axios";

export const BASE_URL = "https://faap.onrender.com/events";

// Cloudinary unsigned config
const CLOUD_NAME = "dbq5gkepx";
const UPLOAD_PRESET = "images-zozac";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

/**
 * Upload a single File (image) to Cloudinary unsigned.
 * Returns secure_url string.
 */export async function uploadImageToCloudinary(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    try {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", UPLOAD_PRESET);

        const res = await axios.post(CLOUDINARY_UPLOAD_URL, form, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (onProgress) onProgress(percent);
            },
        });

        return res.data.secure_url as string;
    } catch (err: any) {
        console.error("Cloudinary upload failed", err.response?.data || err.message);
        throw new Error("Failed to upload image to Cloudinary");
    }
}

/* ---------- Backend CRUD ---------- */

export async function fetchEvents() {
    const res = await axios.get(`${BASE_URL}/`);
    return res.data;
}

export async function fetchEventById(id: string) {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
}

export async function createEvent(payload: any) {
    const res = await axios.post(`${BASE_URL}/`, payload);
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

export async function setEventTimes(id: string, times: { startingTime?: string; endTime?: string; duration?: number }) {
    const res = await axios.patch(`${BASE_URL}/set-times/${id}`, times);
    return res.data;
}
