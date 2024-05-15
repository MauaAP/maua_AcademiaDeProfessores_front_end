import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Certificados from "../../componentes/corpo_certificados/certificados";
import axios from "axios";  
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';

export default function HomeMod({itensMenu}) {
    const [certificadosData, setCertificadosData] = useState([]);
    const [userId, setUserId] = useState(null);

    const notierror = () => toast.error('Erro ao buscar os eventos!');

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                const decodedToken = jwt_decode(localStorage.getItem("token"));
                setUserId(decodedToken.id);

                const response = await axios.get("http://18.228.10.97:3000/api/presences", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setCertificadosData(response.data.certificados);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
                notierror();
            }
        };

        fetchCertificados();
    }, []);

    const filteredCertificados = certificadosData.filter(certificado => certificado.userId === userId);

    return(
        <div>
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            <Certificados certificadosData={filteredCertificados} mostrarBusca={false}/>
        </div>
    )
}

  