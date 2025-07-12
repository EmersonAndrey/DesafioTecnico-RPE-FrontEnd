import React from 'react'
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './index.css'

const NavBar = () => {

    const navigate = useNavigate()

    return (
        <Navbar expand="lg" variant="dark" bg="dark" className="fixed-top">
            <Container fluid>
                <Navbar.Brand>
                    <h1
                        className="nav-title"
                        onClick={() => navigate('/home')}
                    >
                        Painel de Clientes RPE
                    </h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
            </Container>
        </Navbar>
    )
}

export default NavBar