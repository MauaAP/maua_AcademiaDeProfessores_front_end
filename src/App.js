import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login";
import HomeProfessor from "./paginas/professores/Home_Professor";
import HomeADM from "./paginas/admin/Home_ADM";
import SobreProf from "./paginas/professores/Sobre";
import SobreADM from "./paginas/admin/SobreADM";
import ListaProfessores from "./paginas/admin/Lista_Professores";
import ListaEventos from "./paginas/admin/Lista_Eventos";
import CadastroProfs from "./paginas/admin/CadastroProfs";
import CadastroEv from "./paginas/admin/CadastroEventos";
import Relatorios from "./paginas/admin/Relatorios";
import RelatoriosProf from "./paginas/professores/RelatoriosProf";
import SobreMod from "./paginas/moderador/SobreMod";
import RelatoriosMod from "./paginas/moderador/RelatoriosMod";
import HomeMod from "./paginas/moderador/Home_Mod";
import ListaEventosMod from "./paginas/moderador/EventosMod";
import CadastroEvMod from "./paginas/moderador/CadastroEventoMod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const itensMenu = [
  { nome: "Meu Perfil", rota: "/perfil" },
  { nome: "Certificados", rota: "/paginaInicial" },
  { nome: "Relatório", rota: "/relatoriosProf" },
  { nome: "Sair", rota: "/" }
];

const itensMenuAdm = [
  { nome: "Meu Perfil", rota: "/perfilADM" },
  { nome: "Certificados", rota: "/paginaInicialADM" },
  { nome: "Relatórios", rota: "/relatorios" },
  { nome: "Lista de Professores", rota: "/listaProfessores" },
  { nome: "Lista de Eventos", rota: "/listaEventos" },
  { nome: "Sair", rota: "/" }
];

const itensMenuMod = [
  { nome: "Meu Perfil", rota: "/perfilMod" },
  { nome: "Certificados", rota: "/paginaInicialMod" },
  { nome: "Relatório", rota: "/relatoriosMod" },
  { nome: "Lista de Eventos", rota: "/listaEventosMod" },
  { nome: "Sair", rota: "/" }
];

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Por favor, faça login para acessar esta página.");
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default function App() {
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://168.138.135.69:3000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRole(response.data.role);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    };

    if (token) {
      fetchUserRole();
    }
  }, [token]);

  if (status === "INACTIVE") {
    return (
      <div>
        <h1>Hm...Parece que você está Inativo!</h1>
        <h2>Por favor entre em contato com o IMT caso deseja acessar o portal.</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {(role === "SECRETARY" || role === "ADMIN") && (
          <>
            <Route path="/paginaInicialADM" element={<ProtectedRoute element={<HomeADM itensMenu={itensMenuAdm} />} />} />
            <Route path="/perfilADM" element={<ProtectedRoute element={<SobreADM itensMenu={itensMenuAdm} />} />} />
            <Route path="/listaProfessores" element={<ProtectedRoute element={<ListaProfessores itensMenu={itensMenuAdm} />} />} />
            <Route path="/cadastroProfessores" element={<ProtectedRoute element={<CadastroProfs itensMenu={itensMenuAdm} />} />} />
            <Route path="/listaEventos" element={<ProtectedRoute element={<ListaEventos itensMenu={itensMenuAdm} />} />} />
            <Route path="/cadastroEventos" element={<ProtectedRoute element={<CadastroEv itensMenu={itensMenuAdm} />} />} />
            <Route path="/relatorios" element={<ProtectedRoute element={<Relatorios itensMenu={itensMenuAdm} />} />} />
          </>
        )}
        {role === "COMMON" && (
          <>
            <Route path="/paginaInicial" element={<ProtectedRoute element={<HomeProfessor itensMenu={itensMenu} />} />} />
            <Route path="/perfil" element={<ProtectedRoute element={<SobreProf itensMenu={itensMenu} />} />} />
            <Route path="/relatoriosProf" element={<ProtectedRoute element={<RelatoriosProf itensMenu={itensMenu} />} />} />
          </>
        )}
        {role === "MODERATOR" && (
          <>
            <Route path="/paginaInicialMod" element={<ProtectedRoute element={<HomeMod itensMenu={itensMenuMod} />} />} />
            <Route path="/perfilMod" element={<ProtectedRoute element={<SobreMod itensMenu={itensMenuMod} />} />} />
            <Route path="/listaEventosMod" element={<ProtectedRoute element={<ListaEventosMod itensMenu={itensMenuMod} />} />} />
            <Route path="/cadastroEventosMod" element={<ProtectedRoute element={<CadastroEvMod itensMenu={itensMenuMod} />} />} />
            <Route path="/relatoriosMod" element={<ProtectedRoute element={<RelatoriosMod itensMenu={itensMenuMod} />} />} />
          </>
        )}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};
