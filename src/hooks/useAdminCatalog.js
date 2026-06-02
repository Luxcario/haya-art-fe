import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useAdminCatalog = () => {
    const [dataAcara, setDataAcara] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/category');
            setDataAcara(response.data);
            return response.data;
        } catch (error) {
            console.error("Gagal ambil data:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createAcara = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image) formData.append('image', data.image);

        await api.post('/category', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        await fetchData();
    };

    const removeAcara = async (id) => {
        await api.delete(`/category/${id}`);
        await fetchData();
    };

    const createTema = async (data) => {
        const formData = new FormData();
        formData.append('themeName', data.themeName);
        formData.append('description', data.description);
        formData.append('categoryId', data.categoryId);
        formData.append('fasilitas', data.fasilitas || '');
        formData.append('opsiMakeup', data.opsiMakeup || '');
        formData.append('opsiHiburan', data.opsiHiburan || '');
        formData.append('variations', data.variations);

        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        await api.post('/catalog', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        await fetchData();
    };

    const updateTema = async (id, data) => {
        const formData = new FormData();
        formData.append('themeName', data.themeName);
        formData.append('description', data.description);
        formData.append('categoryId', data.categoryId);
        formData.append('fasilitas', data.fasilitas || '');
        formData.append('opsiMakeup', data.opsiMakeup || '');
        formData.append('opsiHiburan', data.opsiHiburan || '');

        // 👇 PERBAIKAN: Kirim 'variations' (JSON String), Hapus 'price'
        formData.append('variations', data.variations);

        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        await api.put(`/catalog/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        await fetchData();
    };

    const removeTema = async (id) => {
        await api.delete(`/catalog/${id}`);
        await fetchData();
    };

    return {
        dataAcara, loading, createAcara, removeAcara, createTema, updateTema, removeTema
    };
};
