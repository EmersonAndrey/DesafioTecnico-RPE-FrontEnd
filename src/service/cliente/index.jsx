import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';


export const buscarTodosClientes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/clientes`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao procurar por clientes');
    }
}

export const salvarCliente = async (cliente) => {
    try {
        const response = await axios.post(`${BASE_URL}/clientes`, cliente);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao salvar cliente');
    }
}

export const buscarClientePorID = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/clientes/${id}`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao procurar o cliente');
    }
}

export const atualizarBloquearCliente = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/clientes/${id}`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao atualizar o cliente');
    }
}

export const buscarClientesBloqueados = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/clientes/bloqueados`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao atualizar o cliente');
    }
}