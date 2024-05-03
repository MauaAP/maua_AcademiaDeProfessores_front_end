import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/home/navbar";
import Eventos from "../../componentes/corpo_eventos/listaeventos";
import axios from "axios";
import { toast } from "react-toastify";

export default function ListaEventosMod({ itensMenu }) {
  const [listaEventos, setListaEventos] = useState([]);

  const notierror = () => toast.error('Erro ao buscar os eventos!');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://54.232.49.136:3000/api/events/", {
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

  return (
    <body>
      <NavBar itensMenu={itensMenu} cor={"#006400"} />
      <Eventos listaEventos={listaEventos} cadEvento={"/cadastroEventosMod"} />
    </body>
  );
}
