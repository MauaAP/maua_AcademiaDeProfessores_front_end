import React from "react";
import './certificado.css';
import { IoIosPaper } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';
import {toast} from 'react-toastify';

export default function TemplateCertificado ({ certificadoId, evento, professor, data, showDelete=true}) {
    const notierror = (message) => toast.error(message);
    const notisucess = (message) => toast.warning(message);
    const navegacao = useNavigate();
    
    const handleDelete = async () => {
        try {
            await axios.delete(`http://18.228.10.97:3000/api/presence/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            notisucess("Certificado apagado!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Erro ao deletar certificado:", error);
            notierror("Erro ao detelar o certififcado!");
        }
    };

    const handleDownload = async () => {
        try{
            const data = await axios.get(`http://18.228.10.97:3000/api/create-certificate/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const url = data.data.certificateUrl;
            navegacao(url);
        } catch (error) {
            console.error("Erro ao deletar certificado:", error);
            notierror("Erro ao fazer o download!");
        }
    }

    return (
        <div className="certificado">
            <IoIosPaper size={32} />
            <p>{evento}</p>
            <p>{professor}</p>
            <p>{data}</p>
            <div className="side">
                <button className="baixar" onClick={handleDownload}>Baixar <IoIosDownload size={15} /></button>
                {showDelete &&
                    <button className="deletar" onClick={handleDelete}>Deletar</button>
                }
            </div>
        </div>
    );
}
