import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import EventoProf from "./paginas/professores/Eventos";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PrivateRoutesAD from "./utils/PrivateRoutesADMIN";
import PrivateRoutesCO from "./utils/PrivateRoutesCOM";
import PrivateRoutesMOD from "./utils/PrivateRoutesMOD";
import ErrorPage from "./paginas/certificacoes/error";
import Certificacao from "./paginas/certificacoes/certificados";
import EndPage from "./paginas/certificacoes/finalizacao";

const itensMenu = [
  { nome: "Meu Perfil", rota: "/perfil" },
  { nome: "Certificados", rota: "/paginaInicial" },
  { nome: "Relatório", rota: "/relatoriosProf" },
  { nome: "Lista de Eventos", rota: "/eventos"},
  { nome: "Sair", rota: "/" }
];

const itensMenuAdm = [
  { nome: "Meu Perfil", rota: "/perfilADM" },
  { nome: "Certificados", rota: "/paginaInicialADM" },
  { nome: "Relatórios", rota: "/relatorios" },
  { nome: "Lista de Usuários", rota: "/listaProfessores" },
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

export default function App() {
  return (
    <div>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/error' element={<ErrorPage/>}/>
            <Route path="/certificacao" element={<Certificacao/>}/>
            <Route path="/end" element={<EndPage/>}/>

            <Route element={<PrivateRoutesAD/>}>
              <Route path='/perfilADM' element={<SobreADM itensMenu={itensMenuAdm}/>}/>
              <Route path='/paginaInicialADM' element={<HomeADM itensMenu={itensMenuAdm}/>}/>
              <Route path="/listaProfessores" element={<ListaProfessores itensMenu={itensMenuAdm}/>}/>
              <Route path="/listaEventos" element={<ListaEventos itensMenu={itensMenuAdm}/>}/>
              <Route path="/cadastroProfessores" element={<CadastroProfs itensMenu={itensMenuAdm}/>}/>
              <Route path="/cadastroEventos" element={<CadastroEv itensMenu={itensMenuAdm}/>}/>
              <Route path='/relatorios' element={<Relatorios itensMenu={itensMenuAdm}/>}/>
            </Route>

            <Route element={<PrivateRoutesCO/>}>
              <Route path='/paginaInicial' element={<HomeProfessor itensMenu={itensMenu}/>}/>
              <Route path='/perfil' element={<SobreProf itensMenu={itensMenu}/>}/>
              <Route path='/eventos' element={<EventoProf itensMenu={itensMenu}/>}/>
              <Route path='/relatoriosProf' element={<RelatoriosProf itensMenu={itensMenu}/>}/>
            </Route>

            <Route element={<PrivateRoutesMOD/>}>
              <Route path='/perfilMod' element={<SobreMod itensMenu={itensMenuMod}/>}/>
              <Route path='/paginaInicialMod' element={<HomeMod itensMenu={itensMenuMod}/>}/>
              <Route path='/relatoriosMod' element={<RelatoriosMod itensMenu={itensMenuMod}/>}/>
              <Route path='/listaEventosMod' element={<ListaEventosMod itensMenu={itensMenuMod}/>}/>
              <Route path='/cadastroEventosMod' element={<CadastroEvMod itensMenu={itensMenuMod}/>}/>
            </Route>
       
        </Routes>
      </BrowserRouter>
    </div>
  );
}

