import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';


export const buscarFaturasDeUmCliente = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/faturas/${id}`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao procurar por faturas');
    }
}

export const registrarPagamentoFatura = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/faturas/${id}/pagamento`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao realizar o pagamento da fatura');
    }
}

export const buscarFaturasAtrasadas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/faturas/atrasadas`);
        return response.data;

    } catch (err) {
         throw new Error(err.response?.data?.message || 'Erro ao buscar por faturas');
    }
}