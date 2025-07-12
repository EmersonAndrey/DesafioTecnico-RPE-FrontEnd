import React from 'react'
import NavBar from '../../components/Navbar'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { buscarTodosClientes } from '../../service/cliente';

const HomePage = () => {

    const { setListaClientes } = useAppContext();
    const navigate = useNavigate();

    const carregarClientes = async () => {
        const clientes = await buscarTodosClientes(); 
        setListaClientes(clientes);
        navigate('/listaClientes')
    }

    return (
        <>
            <NavBar />
            <div className="text-white vh-100 d-flex align-items-center">
                <div className="container">
                    <div className="text-center">
                        <h1 className="mb-5">Bem-vindo ao Painel de Clientes da RPE!</h1>
                        <Button variant="primary" size="lg" onClick={() => carregarClientes()}>
                            Acessar Lista de Clientes
                        </Button>
                    </div>
                </div>
            </div>


        </>

    )
}

export default HomePage