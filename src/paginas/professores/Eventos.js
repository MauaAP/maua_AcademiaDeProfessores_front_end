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
        const response = await axios.get("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
    <div>
      <NavBar itensMenu={itensMenu} cor={"#14134F"} />
      <Eventos listaEventos={listaEventos} mostrarInputTituloEvento={false} />
    </div>
  );
}
