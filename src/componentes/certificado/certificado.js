import React from "react";
import { IoIosPaper } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TemplateCertificado ({ certificadoId, evento, professor, data, showDelete=true }) {
    const notierror = (message) => toast.error(message);
    const notisucess = (message) => toast.success(message);
    
    const handleDelete = async () => {
        try {
            await axios.delete(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/presence/${certificadoId}`, {
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
            const response = await axios.get(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-certificate/${certificadoId}`, {
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
        <div className="flex items-center gap-8 w-full bg-gray-300 mb-4 p-4 rounded-xl shadow-md max-md:flex-col">
            <div className="bg-gray-400 p-2 rounded-md">
                <IoIosPaper size={32} />
            </div>
            <p className="flex-[3] max-md:text-center">{evento}</p>
            <p className="flex-[3] max-md:text-center">{professor}</p>
            <p className="flex-[2] max-md:text-center">{data}</p>
            <div className="flex flex-col gap-2 max-md:w-full">
                <button className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center" onClick={handleDownload}>Baixar <IoIosDownload size={16} /></button>
                {showDelete &&
                    <button className="flex items-center justify-between gap-2 bg-[#A12020] text-white p-2 rounded-lg duration-100 hover:bg-[#7c1a1a] max-md:justify-center" onClick={handleDelete}>Deletar <IoIosTrash size={16}/></button>
                }
            </div>
        </div>
    );
}
