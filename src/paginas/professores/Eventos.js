import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/home/navbar";
import Eventos from "../../componentes/corpo_eventos/listaeventos";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventoProf({ itensMenu }) {
  const [listaEventos, setListaEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const notierror = () => toast.error("Erro ao buscar os eventos!");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://54.232.49.136:3000/api/events/", {
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
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        notierror();
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  return (
    <div>
      <NavBar itensMenu={itensMenu} cor={"#14134F"} />
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <Eventos listaEventos={listaEventos} mostrarInputTituloEvento={false} />
      )}
    </div>
  );
}
