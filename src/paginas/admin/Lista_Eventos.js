import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Eventos from "../../componentes/corpo_eventos/listaeventos";
import axios from "axios";
import { toast } from "react-toastify";

export default function ListaEventos({ itensMenu }) {
  const [listaEventos, setListaEventos] = useState([]);
  const [listaProfessores, setListaProfessores] = useState([]);

  const notierror = () => toast.error('Erro ao buscar os eventos!');
  const notierrorUsers = () => toast.error('Erro ao buscar os professores!');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setListaEventos(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        notierror();
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setListaProfessores(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        notierrorUsers();
      }
    };

    fetchUsers();
  }, []);

  return (
    <body>
      <NavBar itensMenu={itensMenu} cor={"#4F1313"} />
      <Eventos listaEventos={listaEventos} listaProfessores={listaProfessores} cadEvento={"/cadastroEventos"} />
    </body>
  );
}
