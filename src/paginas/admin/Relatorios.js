import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Relatorio from "../../componentes/corpo_relatorio/relatorio";
import axios from "axios";  
import { toast } from 'react-toastify';
  
export default function Relatorios ({itensMenu}){
    const [certificadosData, setCertificadosData] = useState([]);

    const notierror = () => toast.error('Erro ao buscar os eventos!');

    useEffect(() => {
        const fetchCertificados = async () => {
        try {
            const response = await axios.get("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/presences");
            
            setCertificadosData(response.data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            notierror();
        }
        };

        fetchCertificados();
    }, []);

    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            <Relatorio certificadosData={certificadosData} showProfessorSearch={true} />
        </body>
    );
}