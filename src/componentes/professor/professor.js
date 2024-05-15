import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './professor.css';
import InputMask from "react-input-mask";
import axios from "axios";

export default function TemplateProfessor({ professor, cpf, phone, email, role, status, id }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ professor, cpf, phone, email, status, id });
    const [buttonText, setButtonText] = useState('');
    const [buttonColor, setButtonColor] = useState('');

    useEffect(() => {
        setEditedData({ professor, cpf, phone, email, status, id });
    }, [professor, cpf, phone, email, status, id]);

    useEffect(() => {
        setButtonText(editedData.status === 'ACTIVE' ? 'Inativar' : 'Ativar');
        setButtonColor(editedData.status === 'ACTIVE' ? '#A12020' : '#4e8bc5');
    }, [editedData.status]);

    const handleUpdate = () => {
        // Implementar a requisição HTTP
        console.log("Dados atualizados:", editedData);
        notiatualizar();
        setIsEditing(false);
    };

    const toggleStatus = () => {
        const newStatus = editedData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        setEditedData({ ...editedData, status: newStatus });
        setButtonText(newStatus === 'ACTIVE' ? 'Inativar' : 'Ativar');
        setButtonColor(newStatus === 'ACTIVE' ? '#c72d2d' : '#0366d6');
    };

    const notiInativar = () => {
        toast.dismiss();
        axios.put('http://18.228.10.97:3000/api/update-status', {
            id: editedData.id,
            status: editedData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response.data);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            toast.warning("Status alterado com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao alterar o status:', error);
            toast.error("Erro ao alterar o status!");
        });
    };

    const notiatualizar = () => toast.success("Dados Atualizados!");

    const newAtt = () => {
        setIsEditing(true);
        toast.dismiss();
    };

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
            <div className="professor">
                <FaUserCircle size={32} />
                <p>{professor}</p>
                <p>Usuário {getRoleText(role)}</p>
                <p>{cpf}</p>
                <p>{phone}</p>
                <div className="professor-dir">
                    <button className="atualizar" onClick={newAtt}>Atualizar</button>
                    <button className="deletar" style={{ backgroundColor: buttonColor }} onClick={() => {
                        toggleStatus();
                        notiInativar();
                    }}>{buttonText}</button>
                </div>

                {isEditing && (
                    <div className="popup">
                        <div className="popup-inner-p">
                            <label>{editedData.professor}</label>
                            <input type="text" name="nome" placeholder="Nome"/>
                            <label>{editedData.cpf}</label>
                            <InputMask mask="999.999.999-99" placeholder="CPF"/>
                            <label>{editedData.phone}</label>
                            <InputMask mask="(99) 99999-9999" placeholder="Telefone"/>
                            <label>{editedData.email}</label>
                            <input type="email" name="email" placeholder="Email"/>
                            <button className="atualizar" onClick={handleUpdate}>Atualizar</button>
                            <button className="deletar" onClick={() => setIsEditing(false)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
