import React from "react";
import './certificado.css';
import { IoIosPaper } from "react-icons/io";
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TemplateCertificado ({ certificadoId, evento, professor, data, showDelete=true }) {
    const notierror = (message) => toast.error(message);
    const notisucess = (message) => toast.success(message);
    
    const handleDelete = async () => {
        try {
            await axios.delete(`https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/presence/${certificadoId}`, {
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
            notierror("Erro ao deletar o certificado!");
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/create-certificate/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const url = response.data.certificateUrl;
            window.open(url, '_blank');  // Abre a URL em uma nova guia
        } catch (error) {
            console.error("Erro ao fazer o download do certificado:", error);
            notierror("Erro ao fazer o download!");
        }
    };

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
