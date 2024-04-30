import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './professor.css';

export default function TemplateProfessor({ professor, cpf, phone, email, role }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData] = useState({ professor, cpf, phone, email });

    const handleUpdate = () => {
        // implementar a requisição http
        console.log("Dados atualizados:", editedData);
        setTimeout(notiatualizar, 10); // Chama a função de notificação após um pequeno atraso
        setIsEditing(false);
    };

    const notiInativar = () => toast.warning("Professor Inativado!");
    const notiatualizar = () => toast.success("Dados Atualizados!");

    const getRoleText = (role) => {
        switch (role.toUpperCase()) {
            case 'ADMIN':
                return 'Administrador';
            case 'SECRETARY':
                return 'Secretário';
            case 'MODERATOR':
                return 'Moderador';
            case 'COMMON':
                return 'Comum';
            default:
                return role;
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="professor">
                <FaUserCircle size={32} />
                <p>{professor}</p>
                <p>Usuário {getRoleText(role)}</p>
                <p>{cpf}</p>
                <p>{phone}</p>
                <div className="professor-dir">
                    <button className="atualizar" onClick={() => setIsEditing(true)}>Atualizar</button>
                    <button className="deletar" onClick={notiInativar}>Inativar</button>
                </div>

                {isEditing && (
                    <div className="popup">
                        <div className="popup-inner-p">
                            <IoCloseCircle className="close-btn-p" onClick={() => setIsEditing(false)}/>
                            <label>{editedData.professor}</label>
                            <input type="text" name="nome" />
                            <label>{editedData.cpf}</label>
                            <input type="text" name="cpf" />
                            <label>{editedData.phone}</label>
                            <input type="text" name="telefone" />
                            <label>{editedData.email}</label>
                            <input type="email" name="email"/>
                            <button className="atualizar" onClick={handleUpdate}>Atualizar</button>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
        
    );
}
