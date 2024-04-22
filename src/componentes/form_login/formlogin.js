import React, { useState } from "react";
import './formlogin.css';
import { Link } from 'react-router-dom';

export default function FormsLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    if (password.trim() === '') {
      alert('Por favor, insira sua senha.');
      return;
    }

    // requisição http para login
    console.log('Email:', email);
    console.log('Senha:', password);
    
  }

  return (
    <div className="complemento_direita">
        <form className="formulario" onSubmit={handleSubmit}>
            <h2>Portal do Professor</h2>
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
            <Link to='/paginaInicial'><button type="submit" className='btn' disabled={submitButtonDisabled}>Entrar</button></Link>
        </form>
        <a className="logo_maua" href="https://maua.br"><img src="./imagens/logo_maua.png" alt="logo maua"/></a>
    </div>
  );
}
