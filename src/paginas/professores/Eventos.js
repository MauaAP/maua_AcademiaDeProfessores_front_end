import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Eventos from "../../componentes/corpo_eventos/listaeventos";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventoProf({ itensMenu }) {
  const [listaEventos, setListaEventos] = useState([]);
  
  const notierror = () => toast.error("Erro ao buscar os eventos!");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://18.228.10.97:3000/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const eventosFiltrados = response.data.filter((evento) => {
          const dataEvento = new Date(evento.date);
          const dataAtual = new Date();
          return dataEvento.getTime() > dataAtual.getTime();
        });

        setListaEventos(eventosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        notierror();
      }
    };

    fetchEventos();
  }, []);

  return (
    <div>
      <NavBar itensMenu={itensMenu} cor={"#14134F"} />
      <Eventos listaEventos={listaEventos} mostrarInputTituloEvento={false} />
    </div>
  );
}
