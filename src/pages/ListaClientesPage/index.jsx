import React from 'react'
import NavBar from '../../components/Navbar'
import { Card, Button, Row, Col, Modal, Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { buscarTodosClientes, salvarCliente } from '../../service/cliente';
import { IMaskInput } from 'react-imask';
import './index.css'

const ListClient = () => {

    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [cadastroCliente, setCadastroCliente] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const [nome, setNome] = useState();
    const [cpf, setCpf] = useState();
    const [dataNascimento, setDataNascimento] = useState();
    const [statusBloqueio, setStatusBloqueio] = useState();
    const [limiteCredito, setLimiteCredito] = useState();

    const [filtro, setFiltro] = useState("todos");


    const { listaClientes, setListaClientes } = useAppContext();
    const navigate = useNavigate();


    const cadastrarCliente = async () => {
        if (nome && cpf && dataNascimento && statusBloqueio && limiteCredito) {
            const cliente = {
                nome,
                cpf,
                dataNascimento: formatarDataParaSalvar(dataNascimento),
                statusBloqueio,
                limiteCredito
            }

            await salvarCliente(cliente);
            const clientes = await buscarTodosClientes();
            setListaClientes(clientes);
            setModalShow(false);
            setCadastroCliente(null);
        }
    }

    function formatarDataParaSalvar(data) {
        if (!data || data.length !== 10) {
            throw new Error('Data no formato inválido. Esperado formato dd/mm/yyyy');
        }

        const [dia, mes, ano] = data.split('/');
        return `${dia.padStart(2, '0')}-${mes.padStart(2, '0')}-${ano}`;
    }

    const handleShowModalCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setModalShow(true);
    };

    const handleShowModalCadastrarCliente = () => {
        setCadastroCliente(true);
        setModalShow(true);
    };

    function calcularIdade(dataNascimento) {
        const [dia, mes, ano] = dataNascimento.split("-").map(Number);

        const nascimento = new Date(ano, mes - 1, dia);
        const hoje = new Date();

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const diferencaMes = hoje.getMonth() - nascimento.getMonth();

        if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    }

    function zerarDadosInput() {
        setModalShow(false);
        setClienteSelecionado(null);
    }

    const clientesFiltrados = listaClientes.filter(cliente => {
        if (filtro === "bloqueados") return cliente.statusBloqueio === "B";
        return true;
    });

    return (
        <>
            <NavBar />
            <div className='d-flex flex-column mt-4'>

                {listaClientes?.length !== 0 && (
                    <div className='d-flex justify-content-center mt-5'>
                        <h1 className='text-light mt-5 signika-font'>Lista de Clientes</h1>
                    </div>
                )}
                {listaClientes?.length === 0 && (
                    <div className="position-fixed top-50 start-50 translate-middle">
                        <h1 className='text-danger text-center'>
                            Não foi encontrado nenhum cliente
                        </h1>
                    </div>
                )}
                <hr className='text-white' />

                <div className='d-flex flex-column mt-4'>

                    <div className='mt-4'>
                        <div className='d-flex justify-content-between me-5'>
                            <div className='d-flex'>
                                <h4
                                    className={`titulo-filtro ms-5 ${filtro === "todos" ? "ativo" : ""}`}
                                    onClick={() => setFiltro("todos")}
                                >
                                    Todos
                                </h4>
                                <h4
                                    className={`titulo-filtro ms-5 ${filtro === "bloqueados" ? "ativo" : ""}`}
                                    onClick={() => setFiltro("bloqueados")}
                                >
                                    Bloqueados
                                </h4>
                            </div>

                            <Button onClick={() => handleShowModalCadastrarCliente()}>Adicionar Cliente</Button>
                        </div>


                        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-0">
                            {clientesFiltrados.map((cliente, idx) => (
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
                                        onClick={() => handleShowModalCliente(cliente)}
                                    >

                                        <Card.Img
                                            variant="top"
                                            alt="circle-user-round do lucide icons"
                                            src={`/src/assets/circle-user-round.svg`}
                                        />
                                        <Card.Body style={{ maxHeight: '150px', overflow: 'hidden' }}>
                                            <Card.Title>{cliente.nome}</Card.Title>
                                            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                Status de Bloqueio: <strong>{cliente.statusBloqueio}</strong>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {clienteSelecionado && (
                    <Modal show={modalShow} onHide={() => zerarDadosInput()} centered size="lg" className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Detalhes do Cliente</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <Container>
                                <Row className="d-flex align-items-center justify-content-center">
                                    <Col md={4} className="text-center mb-3 mb-md-0">
                                        <img
                                            src="/src/assets/circle-user-round.svg"
                                            alt="Usuário"
                                            className="img-fluid"
                                            style={{ width: '150px', height: '150px' }}
                                        />
                                    </Col>

                                    {/* Coluna dos dados */}
                                    <Col md={8} className="text-md-start text-center">
                                        <h3>{clienteSelecionado.nome}</h3>
                                        <p><strong>CPF:</strong> {clienteSelecionado.cpf}</p>
                                        <p><strong>Idade:</strong> {calcularIdade(clienteSelecionado.dataNascimento)} anos</p>
                                        <p><strong>Status:</strong> {clienteSelecionado.statusBloqueio === 'B' ? 'Bloqueado' : 'Ativo'}</p>
                                        <p><strong>Limite de Crédito:</strong> R$ {clienteSelecionado.limiteCredito.toFixed(2)}</p>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => setModalShow(false)}>
                                Fechar
                            </Button>
                            <Button variant="primary"
                                onClick={() => navigate('/faturasCliente', { state: { cliente: clienteSelecionado } })}
                            >
                                Acessar Faturas
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {cadastroCliente && (
                    <Modal show={modalShow} onHide={() => { setModalShow(false); setClienteSelecionado(null) }} centered size="md" className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Detalhes do Cliente</Modal.Title>
                        </Modal.Header>
                        <Form>
                            <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>

                                <Form.Group className="mb-3" controlId="nome">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome do cliente"
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="cpf">
                                    <Form.Label>CPF</Form.Label>
                                    <IMaskInput
                                        mask="000.000.000-00"
                                        onAccept={(value) => setCpf(value)}
                                        className="form-control"
                                        placeholder="Digite o CPF do cliente"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="dataNascimento">
                                    <Form.Label>Data de Nascimento</Form.Label>
                                    <IMaskInput
                                        mask="00/00/0000"
                                        onAccept={(value) => setDataNascimento(value)}
                                        className="form-control"
                                        placeholder="Digite a data de nascimento do cliente"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="status">
                                    <Form.Label>Status de Bloqueio</Form.Label>
                                    <Form.Select
                                        onChange={(e) => setStatusBloqueio(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecione o status</option>
                                        <option value="A">Ativo</option>
                                        <option value="B">Bloqueado</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="credito">
                                    <Form.Label>Limite de Crédito</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o limite de crédito do cliente"
                                        onChange={(e) => setLimiteCredito(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                            </Modal.Body>
                            <Modal.Footer>
                                <Row className="w-100 justify-content-between">
                                    <Col xs={6} className="text-start">
                                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                                            Voltar
                                        </Button>
                                    </Col>
                                    <Col xs={6} className="text-end">
                                        <Button variant="primary" id="cadastrar" onClick={() => cadastrarCliente()}>
                                            Cadastrar
                                        </Button>
                                    </Col>
                                </Row>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}

            </div>
        </>
    )
}

export default ListClient