import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000/api', // old localhost
    baseURL: 'https://haya-art-production.up.railway.app/api', // #NEWCODE
});

export default api;