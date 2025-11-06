import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaLock, FaEye, FaEyeSlash, FaSave, FaEdit } from "react-icons/fa";

export default function FormSobre({ nomeP, emailP, cpfP, phone }) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        phone: '',
        senhaAnterior: '',
        novaSenha: ''
    });

    const [emailValido, setEmailValido] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState({ anterior: false, nova: false });
    const [isLoading, setIsLoading] = useState(false);

    const notifySuccess = () => toast.success("Dados atualizados com sucesso!");
    const notifyError = (message) => toast.error(message);
    const notifyInfo = (message) => toast.info(message);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            setEmailValido(isValidEmail(value));
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleCpfChange = (event) => {
        setFormData({
            ...formData,
            cpf: event.target.value
        });
    };

    const handlePhoneChange = (event) => {
        setFormData({
            ...formData,
            phone: event.target.value
        });
    };


    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
        const filledFields = Object.values(formData).some(value => value !== '');
            
            if (!filledFields) {
                notifyError("Por favor, preencha pelo menos um campo!");
                setIsLoading(false);
                return;
            }

            if (formData.email && !emailValido) {
                notifyError("Por favor, insira um email válido!");
                setIsLoading(false);
                return;
            }

            if (formData.senhaAnterior && !formData.novaSenha) {
                notifyError("Para alterar a senha, preencha ambos os campos!");
                setIsLoading(false);
                return;
            }

            if (formData.novaSenha && formData.novaSenha.length < 6) {
                notifyError("A nova senha deve ter pelo menos 6 caracteres!");
                setIsLoading(false);
                return;
            }

            await axios.put('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/update-user', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            notifySuccess();
            setIsEditing(false);
            setFormData({
                nome: '',
                email: '',
                cpf: '',
                phone: '',
                senhaAnterior: '',
                novaSenha: ''
            });
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            notifyError("Erro ao atualizar dados. Tente novamente!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        notifyInfo("Modo de edição ativado. Faça suas alterações e clique em salvar.");
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            nome: '',
            email: '',
            cpf: '',
            phone: '',
            senhaAnterior: '',
            novaSenha: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                                <img 
                                    src="/imagens/logo_acad.jpeg" 
                                    alt="Logo Academia de Professores" 
                                    className="h-12 sm:h-16 w-auto object-contain rounded-lg"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Meu Perfil</h1>
                                <p className="text-sm sm:text-base text-gray-600">Gerencie suas informações pessoais</p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-maua-blue to-maua-light-blue text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                <FaEdit />
                                Editar Perfil
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-maua-green to-maua-green-hover text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaSave />
                                    )}
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                        </div>
                        )}
                        </div>
                    </div>

                {/* Form Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Informações Pessoais */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-maua-blue to-maua-light-blue rounded-lg flex items-center justify-center">
                                <FaUser className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Informações Pessoais</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        placeholder={nomeP || "Digite seu nome completo"}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        }`}
                                    />
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {nomeP && (
                                    <p className="text-sm text-gray-500 mt-1">Atual: {nomeP}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={emailP || "Digite seu email"}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        } ${!emailValido && formData.email ? 'border-red-500' : ''}`}
                                    />
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {emailP && (
                                    <p className="text-sm text-gray-500 mt-1">Atual: {emailP}</p>
                                )}
                                {!emailValido && formData.email && (
                                    <p className="text-sm text-red-500 mt-1">Email inválido</p>
                                )}
                            </div>

                            {/* CPF */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CPF
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="999.999.999-99"
                                        value={formData.cpf}
                                        onChange={handleCpfChange}
                                        placeholder={cpfP || "Digite seu CPF"}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        }`}
                                    />
                                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {cpfP && (
                                    <p className="text-sm text-gray-500 mt-1">Atual: {cpfP}</p>
                                )}
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder={phone || "Digite seu telefone"}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        }`}
                                    />
                                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {phone && (
                                    <p className="text-sm text-gray-500 mt-1">Atual: {phone}</p>
                                )}
                            </div>
                </form>
            </div>

                    {/* Alteração de Senha */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-maua-orange to-maua-orange-hover rounded-lg flex items-center justify-center">
                                <FaLock className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Alterar Senha</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Senha Anterior */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha Atual
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.anterior ? "text" : "password"}
                                        name="senhaAnterior"
                                        value={formData.senhaAnterior}
                                        onChange={handleInputChange}
                                        placeholder="Digite sua senha atual"
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        }`}
                                    />
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('anterior')}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.anterior ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Nova Senha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.nova ? "text" : "password"}
                                        name="novaSenha"
                                        value={formData.novaSenha}
                                        onChange={handleInputChange}
                                        placeholder="Digite sua nova senha"
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 transition-colors ${
                                            isEditing 
                                                ? 'border-gray-200 focus:border-maua-blue focus:outline-none' 
                                                : 'border-gray-100 bg-gray-50'
                                        }`}
                                    />
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('nova')}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.nova ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                            </div>

                            {!isEditing && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Dica:</strong> Para alterar sua senha, clique em "Editar Perfil" e preencha os campos de senha.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
