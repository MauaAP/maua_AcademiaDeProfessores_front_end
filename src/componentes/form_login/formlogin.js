import React, { useState } from "react";
import './formlogin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function FormsLogin() {
  const navegacao = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value.trim() === '' || validateEmail(value)) {
      setEmailError('');
    } else {
      setEmailError('Email inválido');
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim() === '') {
      setSubmitButtonDisabled(true);
    } else {
      setSubmitButtonDisabled(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }
  
    setLoading(true);
    const notifyError = (message) => toast.error(message);
  
    try {
      const response = await axios.post('https://6ymi3mpnkb.us-east-1.awsapprunner.com/api/auth-user', {
        email: email,
        password: password
      });
      const tokenData = jwtDecode(response.data.token);
  
      switch (tokenData.role) {
        case 'ADMIN':
        case 'SECRETARY':
          navegacao('/paginaInicialADM');
          break;
        case 'MODERATOR': 
          navegacao('/paginaInicialMod');
          break;
        default:
          navegacao('/paginaInicial');
      }
  
        localStorage.setItem('token', response.data.token);
      
    } catch (error) {
      notifyError('Erro ao fazer login. Por favor, tente novamente.');
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="absolute top-0 right-0 w-1/2 min-h-screen flex flex-col items-center justify-center bg-white max-md:w-full max-md:bg-transparent">
      <form className="formulario p-8 max-md:shadow-lg max-md:bg-white max-md:rounded-xl" onSubmit={handleSubmit}>
        <h2 className="font-bold text-xl">Portal do Professor</h2>
        <label htmlFor='email'>Email {emailError && <span style={{ color: 'red', fontSize: '8'}}>Email inválido</span>}</label>
        <input 
          type='email' 
          placeholder='Insira seu email' 
          className={`form-control ${emailError && 'error'}`}
          value={email} 
          onChange={handleEmailChange}
        />
        <label htmlFor='password'>Senha</label>
        <input 
          type='password' 
          placeholder='Insira sua senha' 
          className='form-control' 
          value={password} 
          onChange={handlePasswordChange}
        />
        <button type="submit" className={`btn ${loading ? 'loading flex items-center gap-2' : ''}`} disabled={submitButtonDisabled || loading}>
          {loading ? <>Carregando...<FaSpinner className="spin" /></>  : 'Entrar'}
        </button>
        <div className="flex justify-center mt-4">
          <a className="w-32" href="https://maua.br"><img src="./imagens/logo_maua.png" alt="logo maua"/></a>
        </div>
      </form>
    </section>
  );
}
