import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
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

const itensMenu = [
  { nome: "Meu Perfil", rota: "/perfil" },
  { nome: "Certificados", rota: "/paginaInicial" },
  { nome: "Relatório", rota:"/relatoriosProf"},
  { nome: "Sair", rota: "/" }
];

const itensMenuAdm = [
  { nome: "Meu Perfil", rota: "/perfilADM" },
  { nome: "Certificados", rota: "/paginaInicialADM" },
  { nome: "Relatórios", rota: "/relatorios"},
  { nome: "Lista de Professores", rota: "/listaProfessores" },
  { nome: "Lista de Eventos", rota: "/listaEventos" },
  { nome: "Sair", rota: "/" }
];

const itensMenuMod = [
  { nome: "Meu Perfil", rota: "/perfilMod" },
  { nome: "Certificados", rota: "/paginaInicialMod" },
  { nome: "Relatório", rota:"/relatoriosMod"},
  { nome: "Lista de Eventos", rota:"/listaEventosMod"},
  { nome: "Sair", rota: "/" }
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/paginaInicial' element={<HomeProfessor itensMenu={itensMenu}/>}></Route>
          <Route path='/perfil' element={<SobreProf itensMenu={itensMenu}/>}></Route>
          <Route path='/perfilADM' element={<SobreADM itensMenu={itensMenuAdm}/>}></Route>
          <Route path='/paginaInicialADM' element={<HomeADM itensMenu={itensMenuAdm}/>}></Route>
          <Route path="/listaProfessores" element={<ListaProfessores itensMenu={itensMenuAdm}/>}></Route>
          <Route path="/listaEventos" element={<ListaEventos itensMenu={itensMenuAdm}/>}></Route>
          <Route path="/cadastroProfessores" element={<CadastroProfs itensMenu={itensMenuAdm}/>}></Route>
          <Route path="/cadastroEventos" element={<CadastroEv itensMenu={itensMenuAdm}/>}></Route>
          <Route path='/relatorios' element={<Relatorios itensMenu={itensMenuAdm}/>}></Route>
          <Route path='/relatoriosProf' element={<RelatoriosProf itensMenu={itensMenu}/>}></Route>
          <Route path='/perfilMod' element={<SobreMod itensMenu={itensMenuMod}/>}></Route>
          <Route path='/paginaInicialMod' element={<HomeMod itensMenu={itensMenuMod}/>}></Route>
          <Route path='/relatoriosMod' element={<RelatoriosMod itensMenu={itensMenuMod}/>}></Route>
          <Route path='/listaEventosMod' element={<ListaEventosMod itensMenu={itensMenuMod}/>}></Route>
          <Route path='/cadastroEventosMod' element={<CadastroEvMod itensMenu={itensMenuMod}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

