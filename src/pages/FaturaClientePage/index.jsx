import React from 'react'
import NavBar from '../../components/Navbar'
import { Card, Button, Row, Col, Modal, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { registrarPagamentoFatura } from '../../service/fatura';
import { useAppContext } from '../../context/AppContext';
import { buscarTodosClientes } from '../../service/cliente';
import './index.css'
import { ToastContainer, toast } from 'react-toastify';

const FaturaCliente = () => {

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const location = useLocation();
    const clienteInicial = location.state?.cliente || {};
    const [cliente, setCliente] = useState(clienteInicial);

    const { setListaClientes } = useAppContext();

    const [filtroFatura, setFiltroFatura] = useState('Todas');

    const pagamentoBemSucedido = () => toast.success("A fatura foi paga com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const handleShowModal = (fatura) => {
        setSelectedInvoice(fatura)
        setModalShow(true)
    };

    const realizarPagamentoFatura = async () => {
        if (!selectedInvoice) return;

        await registrarPagamentoFatura(selectedInvoice.id);

        const clientesAtualizados = await buscarTodosClientes();
        setListaClientes(clientesAtualizados);


        const clienteAtualizado = clientesAtualizados.find(c => c.id === cliente.id);
        if (clienteAtualizado) {
            setCliente(clienteAtualizado);
        }

        pagamentoBemSucedido();
        setModalShow(false);
    };

    const faturasFiltradas = cliente.faturas?.filter(fatura => {
        if (filtroFatura === 'Todas') return true;
        if (filtroFatura === 'Atrasadas') return fatura.statusFatura === 'A';
        if (filtroFatura === 'Aberta') return fatura.statusFatura === 'B';
        return false;
    }) || [];


    return (
        <>
            <NavBar />
            <div className='d-flex flex-column mt-4'>

                {cliente.faturas?.length !== 0 && (
                    <div className='d-flex justify-content-center mt-5'>
                        <h1 className='text-light mt-5 signika-font'>Lista de Faturas - {cliente?.nome}</h1>
                    </div>
                )}
                {cliente.faturas?.length === 0 && (
                    <div className="position-fixed top-50 start-50 translate-middle">
                        <h1 className='text-danger text-center'>
                            O cliente não possui nenhuma fatura
                        </h1>
                    </div>
                )}

                <hr className='text-white' />

                <div className='d-flex flex-column mt-4'>

                    <div className='d-flex justify-content-between align-items-center mx-5 my-3'>
                        <div className='d-flex'>
                            <h4
                                className={`titulo-hover me-4 ${filtroFatura === 'Todas' ? 'ativo' : ''}`}
                                onClick={() => setFiltroFatura('Todas')}
                                style={{ cursor: 'pointer' }}
                            >
                                Todas
                            </h4>
                            <h4
                                className={`titulo-hover ${filtroFatura === 'Atrasadas' ? 'ativo' : ''}`}
                                onClick={() => setFiltroFatura('Atrasadas')}
                                style={{ cursor: 'pointer' }}
                            >
                                Atrasadas
                            </h4>
                            <h4
                                className={`titulo-hover ${filtroFatura === 'Aberta' ? 'ativo' : ''} ms-4`}
                                onClick={() => setFiltroFatura('Aberta')}
                                style={{ cursor: 'pointer' }}
                            >
                                Aberta
                            </h4>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-0">
                            {faturasFiltradas.length === 0 ? (
                                <div className="position-fixed top-50 start-50 translate-middle mt-5">
                                    <h1 className='text-danger text-center mt-5'>
                                        O cliente não possui nenhuma fatura atrasada ou aberta
                                    </h1>
                                </div>
                            ) : (
                                faturasFiltradas.map((fatura, idx) => (
                                    <Col key={idx}>
                                        <Card
                                            className='card-hover'
                                            style={{
                                                maxWidth: '200px',
                                                margin: '0 auto',
                                                marginTop: '30px',
                                                maxHeight: '500px',
                                                backgroundColor: '#6b6b6bff',
                                                color: '#ffffff'
                                            }}
                                            onClick={() => handleShowModal(fatura)}
                                        >
                                            <Card.Img
                                                variant="top"
                                                alt="newspaper do lucide icons"
                                                src={`/src/assets/newspaper.svg`}
                                            />
                                            <Card.Body style={{ maxHeight: '150px', overflow: 'hidden' }}>
                                                <Card.Title>R$ {fatura.valor.toFixed(2)}</Card.Title>
                                                <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Status: <strong>{fatura.statusFatura}</strong>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>
                </div>

                {selectedInvoice && (
                    <Modal show={modalShow} onHide={() => setModalShow(false)} centered size="lg" className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Detalhes da Fatura</Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            style={{ maxHeight: '80vh', overflowY: 'auto' }}
                        >
                            <Container>
                                <Row className="d-flex align-items-center justify-content-center">
                                    <Col md={4} className="text-center mb-3 mb-md-0">
                                        <img
                                            src="/src/assets/newspaper.svg"
                                            alt="newspaper do lucide icons"
                                            className="img-fluid"
                                            style={{ width: '150px', height: '150px' }}
                                        />
                                    </Col>

                                    <Col md={8}>
                                        <h3>{cliente?.nome}</h3>
                                        <p><strong>Valor:</strong> {selectedInvoice.valor} </p>
                                        <p><strong>Data de Vencimento:</strong> {selectedInvoice.dataVencimento} </p>
                                        {(() => {
                                            let badge = null;
                                            switch (selectedInvoice.statusFatura) {
                                                case "P":
                                                    badge = <span className="badge bg-success mb-1">Paga</span>;
                                                    break;
                                                case "A":
                                                    badge = <span className="badge bg-warning text-dark mb-1">Atrasada</span>;
                                                    break;
                                                default:
                                                    badge = <span className="badge bg-danger mb-1">Aberta</span>;
                                                    break;
                                            }
                                            return <p>Status: {badge}</p>;
                                        })()}
                                        <p>
                                            <strong>Data de Pagamento:</strong>{" "}
                                            {selectedInvoice.dataPagamento ? selectedInvoice.dataPagamento : "Não consta"}
                                        </p>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setModalShow(false);
                                    realizarPagamentoFatura();
                                }}
                                disabled={selectedInvoice?.statusFatura?.toUpperCase() === 'P'}
                            >
                                Registrar Pagamento
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

            </div>
            <ToastContainer />
        </>
    )
}

export default FaturaCliente