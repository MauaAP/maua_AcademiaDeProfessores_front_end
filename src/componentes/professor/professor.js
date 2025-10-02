import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        const action = editedData.status === 'ACTIVE' ? 'inativar' : 'ativar';
        const confirmAction = window.confirm(
            `Tem certeza que deseja ${action} o usuário "${professor}"?\n\n${
                action === 'inativar' 
                    ? 'O usuário não conseguirá mais acessar o sistema.' 
                    : 'O usuário voltará a ter acesso ao sistema.'
            }`
        );
        
        if (!confirmAction) {
            return;
        }

        toast.dismiss();
        axios.put('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/update-status', {
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
            case 'PROFESSOR':
                return 'Professor';
            default:
                return role;
        }
    };

    return (
        <div>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col">
                <div className="p-5 flex-1 flex flex-col min-h-0">
                    {/* Header com ícone e status */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-maua-orange to-maua-orange-hover rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <FaUserCircle className="text-white text-xl" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 break-words mb-1">
                                    {professor}
                                </h3>
                                <p className="text-gray-600 text-sm">{getRoleText(role)}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                                editedData.status === 'ACTIVE' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {editedData.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                    </div>

                    {/* Informações de contato */}
                    <div className="mb-6 space-y-3 flex-1">
                        <div className="bg-gray-50 rounded-lg p-3 h-16 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CPF</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{cpf}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 h-16 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telefone</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{phone}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 h-16 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{email}</p>
                        </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="mt-auto">
                        <div className="space-y-3">
                            <button 
                                onClick={newAtt}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Atualizar</span>
                            </button>
                            <button 
                                onClick={() => {
                                    toggleStatus();
                                    notiInativar();
                                }}
                                className="w-full flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                style={{ 
                                    background: `linear-gradient(to right, ${buttonColor}, ${buttonColor}dd)`
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span>{buttonText}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Editar Professor</h3>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    <input 
                                        type="text" 
                                        name="nome" 
                                        placeholder="Nome completo" 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-orange focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                    <InputMask 
                                        mask="999.999.999-99" 
                                        placeholder="000.000.000-00" 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-orange focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <InputMask 
                                        mask="(99) 99999-9999" 
                                        placeholder="(00) 00000-0000" 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-orange focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="email@exemplo.com" 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-orange focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={handleUpdate}
                                    className="flex-1 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                                >
                                    Salvar Alterações
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
