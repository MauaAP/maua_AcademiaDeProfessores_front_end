import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Certificados from "../../componentes/corpo_certificados/certificados";
import axios from "axios";  
import { toast } from 'react-toastify';

export default function HomeADM ({itensMenu}){
    const [certificadosData, setCertificadosData] = useState([]);

    const notierror = () => toast.error('Erro ao buscar os certificados!');

    useEffect(() => {
        const fetchCertificados = async () => {
        try {
            const response = await axios.get("https://gmerola.com.br/ap/api/presences");
            
            setCertificadosData(response.data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            notierror();
        }
        };

        fetchCertificados();
    }, []);

    return(
        <div>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            <Certificados certificadosData={certificadosData}/>
        </div>
    );
}