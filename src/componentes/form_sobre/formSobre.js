import React, { useState } from "react";
import './formSobre.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";
import axios from "axios";

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

    const notifySuccess = () => toast.success("Dados Atualizados!");
    const notifyError = () => toast.error("Por favor, preencha pelo menos um campo!");

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const filledFields = Object.values(formData).some(value => value !== '');
        if (filledFields) {
            notifySuccess();
            // manda pro banco
            await axios.put('https://maua-ap-back-end.onrender.com/api/update-user', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // console.log(formData);
        } else {
            notifyError();
        }
    };

    return (
        <body>
            <div className="corpo-sob">
                <form className="corpo-sobre" onSubmit={handleSubmit}>
                    <h3>Sobre mim...</h3>

                    <div className="info">
                        <label>Nome: {nomeP}</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome" />
                        <label>Email: {emailP} {!emailValido && <span style={{ color: 'red', fontSize: '8' }}>Email inválido</span>}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
                        <label>CPF: {cpfP} </label>
                        <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleCpfChange} />
                        <label>Telefone: {phone}</label>
                        <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handlePhoneChange}/>
                    </div>

                    <h3>Redefinir Senha...</h3>

                    <div className="senhas">
                        <div className="info">
                            <label>Senha Anteiror: </label>
                            <input type="password" name="senhaAnterior" value={formData.senhaAnterior} onChange={handleInputChange} placeholder="Digite sua senha anterior" />
                        </div>
                        <div className="info">
                            <label>Nova Senha: </label>
                            <input type="password" name="novaSenha" value={formData.novaSenha} onChange={handleInputChange} placeholder="Digite sua nova senha" />
                        </div>
                    </div>

                    <button className="bnt-atualizar" type="submit">Atualizar</button>
                </form>
            </div>
        </body>
    )
}
