import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Certificados from "../../componentes/corpo_certificados/certificados";
import axios from "axios";  
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

export default function HomeMod({ itensMenu }) {
    const [certificadosData, setCertificadosData] = useState([]);

    const notierror = () => toast.error('Erro ao buscar os eventos!');

    const decodedToken = jwtDecode(localStorage.getItem("token"));

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                const response = await axios.get("https://pdghaebgjd.us-east-1.awsapprunner.com/api/presences", {
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

    const filteredCertificados = certificadosData ? certificadosData.filter(certificado => certificado.userId === decodedToken.id) : [];

    return (
        <div>
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            <Certificados certificadosData={filteredCertificados} mostrarBusca={false}/>
        </div>
    )
}
