import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import CalendarioEventos from "../../componentes/calendario_eventos/CalendarioEventos";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Calendario({ itensMenu }) {
  const [listaEventos, setListaEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const notierror = () => toast.error("Erro ao buscar os eventos!");

  // Obter cor da NavBar baseado no role
  const getNavBarColor = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        
        switch (role) {
          case "ADMIN":
          case "SECRETARY":
            return "#4F1313"; // maua-dark-red
          case "MODERATOR":
            return "#006400"; // verde escuro
          case "PROFESSOR":
            return "#14134F"; // maua-dark-blue
          default:
            return "#014587"; // maua-blue
        }
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
    return "#014587"; // cor padrão
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setListaEventos(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        notierror();
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return (
      <div>
        <NavBar itensMenu={itensMenu} cor={getNavBarColor()} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-maua-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar itensMenu={itensMenu} cor={getNavBarColor()} />
      <CalendarioEventos listaEventos={listaEventos} />
    </div>
  );
}

