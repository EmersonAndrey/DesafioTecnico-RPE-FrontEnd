import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListClient from "./pages/ListaClientesPage";
import FaturaCliente from "./pages/FaturaClientePage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/listaClientes" element={<ListClient />} />
      <Route path="/faturasCliente" element={<FaturaCliente />} />
    </Routes>
  )
}

export default App
