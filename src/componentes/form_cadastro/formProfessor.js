import React, { useState } from "react";
import './formCadastro.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";
import axios from 'axios';

export default function FormProfCad (){
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

    const notifySuccess = () => toast.success("Dados Cadastrados!");
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const allFieldsFilled = Object.values(formData).every(value => value !== '');
        if (allFieldsFilled) {
            if (formData.senha === formData.confirSenha) {
                try {
                    const response = await axios.post('https://maua-ap-back-end.onrender.com/api/create-user', {
                        "name": formData.nome,
                        "email": formData.email,
                        "password": formData.senha,
                        "role": cargoSelecionado.toUpperCase(),
                        "telefone": formData.phone,
                        "cpf": formData.cpf,
                        "status": "ACTIVE"
                    });

                    notifySuccess();
                    console.log(response.data); 
                } catch (error) {
                    console.error('Erro ao cadastrar usuário:', error);
                    console.log(formData);
                    notifyError("Erro. Por favor, verifique se os campos estão preenchidos corretamente.");
                }
            } else {
                notifyError("As senhas não coincidem!");
            }
        } else {
            notifyError("Por favor, preencha todos os campos!");
        }
    };

    return(
        <body>
            <div className="corpo-cad">
                <form className="corpo-cad" onSubmit={handleSubmit}>
                    <h3>Cadastro...</h3>

                    <div className="info">
                        <label>Nome:</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome"></input>
                        <label>Email: {!emailValido && <span style={{ color: 'red', fontSize: '8'}}>Email inválido</span>}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email"></input>
                        <label>CPF: </label>
                        <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleCpfChange} placeholder="CPF"/>
                        <label>Telefone: </label>
                        <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handlePhoneChange} placeholder="Telefone"/>
                        <h3>Cargo...</h3>
                        <div className="senhas">
                            <div>
                                <div>
                                    <input type="checkbox" checked={cargoSelecionado === 'professor'} onChange={() => handleCargoChange('professor')}></input>
                                    <label>É professor</label>
                                </div>
                                <div>
                                    <input type="checkbox" checked={cargoSelecionado === 'moderator'} onChange={() => handleCargoChange('moderator')}></input>
                                    <label>É moderador</label>
                                </div>
                                <div>
                                    <input type="checkbox" checked={cargoSelecionado === 'secretary'} onChange={() => handleCargoChange('secretary')}></input>
                                    <label>É secretário(a)</label>
                                </div>
                                <div>
                                    <input type="checkbox" checked={cargoSelecionado === 'admin'} onChange={() => handleCargoChange('admin')}></input>
                                    <label>É administrador</label>
                                </div>  
                            </div>
                        </div>
                        
                    </div>

                    <h3>Definir Senha...</h3>

                    <div className="senhas">
                        <div className="info">
                            <label>Senha: </label>
                            <input type="password" name="senha" value={formData.senha} onChange={handleInputChange} placeholder="Digite sua senha"></input>
                        </div>
                        <div className="info">
                            <label>Repita a Senha: </label>
                            <input type="password" name="confirSenha" value={formData.confirSenha} onChange={handleInputChange} placeholder="Repita sua senha"></input>
                        </div>
                    </div>

                    <button className="bnt-cadastrar" type="submit">Cadastrar</button>
                </form>
            </div>
        </body>
        
    )
}
