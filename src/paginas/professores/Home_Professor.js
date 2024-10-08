import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Certificados from "../../componentes/corpo_certificados/certificados";
import axios from "axios";
import { toast } from 'react-toastify';

export default function HomeProfessor({ itensMenu }) {
    const [certificadosData, setCertificadosData] = useState([]);

    const notierror = () => toast.error('Erro ao buscar os eventos!');

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                const response = await axios.get("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/presences", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setCertificadosData(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
                notierror();
            }
        };

        fetchCertificados();
    }, []);

    return (
        <div>
            <NavBar itensMenu={itensMenu} cor={"#14134F"} />
            <Certificados certificadosData={certificadosData} mostrarBusca={false} />
        </div>
    );
}
