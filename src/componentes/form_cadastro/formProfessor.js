import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";
import axios from 'axios';
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaGraduationCap, FaUserShield, FaUserTie, FaCrown, FaCheck } from "react-icons/fa";

export default function FormProfCad() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        phone: '',
        senha: '',
        confirSenha: ''
    });

    const [cargoSelecionado, setCargoSelecionado] = useState('');
    const [emailValido, setEmailValido] = useState(true);
    const [showPasswords, setShowPasswords] = useState({ senha: false, confirSenha: false });
    const [isLoading, setIsLoading] = useState(false);

    const notifySuccess = () => toast.success("Usuário cadastrado com sucesso!");
    const notifyError = (message) => toast.error(message);

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

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleCargoChange = (cargo) => {
        setCargoSelecionado(cargo);
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
            const allFieldsFilled = Object.values(formData).every(value => value !== '');
            
            if (!allFieldsFilled) {
                notifyError("Por favor, preencha todos os campos!");
                setIsLoading(false);
                return;
            }

            if (!cargoSelecionado) {
                notifyError("Por favor, selecione um cargo!");
                setIsLoading(false);
                return;
            }

            if (!emailValido) {
                notifyError("Por favor, insira um email válido!");
                setIsLoading(false);
                return;
            }

            if (formData.senha !== formData.confirSenha) {
                notifyError("As senhas não coincidem!");
                setIsLoading(false);
                return;
            }

            if (formData.senha.length < 6) {
                notifyError("A senha deve ter pelo menos 6 caracteres!");
                setIsLoading(false);
                return;
            }

            await axios.post('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-user', {
                "name": formData.nome,
                "email": formData.email,
                "password": formData.senha,
                "role": cargoSelecionado.toUpperCase(),
                "telefone": formData.phone,
                "cpf": formData.cpf,
                "status": "ACTIVE"
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            notifySuccess();
            
            // Limpar formulário após sucesso
            setFormData({
                nome: '',
                email: '',
                cpf: '',
                phone: '',
                senha: '',
                confirSenha: ''
            });
            setCargoSelecionado('');

        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            notifyError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const cargos = [
        { id: 'professor', label: 'Professor', icon: FaGraduationCap, color: 'from-blue-500 to-blue-600', description: 'Acesso completo aos eventos e certificados' },
        { id: 'moderator', label: 'Moderador', icon: FaUserShield, color: 'from-green-500 to-green-600', description: 'Gerenciamento de eventos e relatórios' },
        { id: 'secretary', label: 'Secretário(a)', icon: FaUserTie, color: 'from-purple-500 to-purple-600', description: 'Acesso administrativo limitado' },
        { id: 'admin', label: 'Administrador', icon: FaCrown, color: 'from-red-500 to-red-600', description: 'Acesso total ao sistema' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-maua-blue to-maua-light-blue rounded-2xl flex items-center justify-center shadow-lg">
                            <FaUserPlus className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Usuário</h1>
                            <p className="text-gray-600">Preencha os dados para criar uma nova conta no sistema</p>
                        </div>
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
                                    Nome Completo *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        placeholder="Digite o nome completo"
                                        required
                                        className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    />
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Digite o email"
                                        required
                                        className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-colors focus:outline-none ${
                                            formData.email && !emailValido 
                                                ? 'border-red-500 focus:border-red-500' 
                                                : 'border-gray-200 focus:border-maua-blue'
                                        }`}
                                    />
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {formData.email && !emailValido && (
                                    <p className="text-sm text-red-500 mt-1">Email inválido</p>
                                )}
                            </div>

                            {/* CPF */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CPF *
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="999.999.999-99"
                                        value={formData.cpf}
                                        onChange={handleCpfChange}
                                        placeholder="000.000.000-00"
                                        required
                                        className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    />
                                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone *
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="(00) 00000-0000"
                                        required
                                        className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    />
                                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Cargo e Senha */}
                    <div className="space-y-8">
                        {/* Seleção de Cargo */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-maua-orange to-maua-orange-hover rounded-lg flex items-center justify-center">
                                    <FaUserShield className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Cargo *</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {cargos.map((cargo) => {
                                    const IconComponent = cargo.icon;
                                    return (
                                        <div
                                            key={cargo.id}
                                            onClick={() => handleCargoChange(cargo.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                cargoSelecionado === cargo.id
                                                    ? 'border-maua-blue bg-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-10 h-10 bg-gradient-to-r ${cargo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <IconComponent className="text-white text-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm">{cargo.label}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">{cargo.description}</p>
                                                </div>
                                                {cargoSelecionado === cargo.id && (
                                                    <div className="flex-shrink-0">
                                                        <FaCheck className="text-maua-blue text-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Senhas */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-maua-green to-maua-green-hover rounded-lg flex items-center justify-center">
                                    <FaLock className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Definir Senha</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Senha */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Senha *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.senha ? "text" : "password"}
                                            name="senha"
                                            value={formData.senha}
                                            onChange={handleInputChange}
                                            placeholder="Digite a senha"
                                            required
                                            className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        />
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('senha')}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.senha ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                                </div>

                                {/* Confirmar Senha */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Senha *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirSenha ? "text" : "password"}
                                            name="confirSenha"
                                            value={formData.confirSenha}
                                            onChange={handleInputChange}
                                            placeholder="Confirme a senha"
                                            required
                                            className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        />
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirSenha')}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirSenha ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {formData.senha && formData.confirSenha && formData.senha !== formData.confirSenha && (
                                        <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão de Cadastro */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-maua-green to-maua-green-hover text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FaUserPlus />
                        )}
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                    </button>
                </div>
            </div>
        </div>
    );
}