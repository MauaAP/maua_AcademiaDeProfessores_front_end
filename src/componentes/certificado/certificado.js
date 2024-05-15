import React from "react";
import './certificado.css';
import { IoIosPaper } from "react-icons/io";
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';

export default function TemplateCertificado ({ certificadoId, cursoId, professorId, data, showDelete=true, onDelete }) {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://18.228.10.97:3000/api/presence/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            onDelete(certificadoId);
        } catch (error) {
            console.error("Erro ao deletar certificado:", error);
            alert("Houve um erro ao deletar o certificado. Tente novamente.");
        }
    };

    return (
        <div className="certificado">
            <IoIosPaper size={32} />
            <p>Nome</p>
            <p>nome</p>
            <p>{new Date(data).toLocaleDateString()}</p>
            <div>
                <button className="baixar">Baixar <IoIosDownload size={15} /></button>
                {showDelete &&
                    <button className="deletar" onClick={handleDelete}>Deletar</button>
                }
            </div>
        </div>
    );
}
