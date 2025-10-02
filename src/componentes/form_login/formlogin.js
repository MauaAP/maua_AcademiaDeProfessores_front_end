import React, { useState } from "react";
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
      const response = await axios.post('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/auth-user', {
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
    <section className="w-full flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        <form className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100" onSubmit={handleSubmit}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-maua-blue to-maua-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Portal do Professor</h2>
            <p className="text-gray-600 text-sm">Instituto Mauá de Tecnologia</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-2">
                Email
                {emailError && <span className="text-red-500 text-xs ml-2">• Email inválido</span>}
              </label>
              <input 
                type='email' 
                placeholder='seu.email@maua.br' 
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-maua-light-blue/20 ${
                  emailError 
                    ? 'border-red-300 bg-red-50 focus:border-red-400' 
                    : 'border-gray-200 bg-gray-50 focus:border-maua-light-blue hover:border-gray-300'
                }`}
                value={email} 
                onChange={handleEmailChange}
              />
            </div>

            <div>
              <label htmlFor='password' className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input 
                type='password' 
                placeholder='Digite sua senha' 
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-maua-light-blue/20 focus:border-maua-light-blue hover:border-gray-300' 
                value={password} 
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`w-full mt-8 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
              submitButtonDisabled || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-maua-light-blue to-maua-blue hover:from-maua-blue hover:to-maua-light-blue hover:scale-105 hover:shadow-lg active:scale-95'
            }`} 
            disabled={submitButtonDisabled || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex justify-center mb-4">
              <a className="transition-transform hover:scale-105" href="https://maua.br">
                <img 
                  src="./imagens/logo_maua.png" 
                  alt="Logo Mauá" 
                  className="h-12 w-auto"
                />
              </a>
            </div>
            <p className="text-xs text-gray-500">
              © 2024 Instituto Mauá de Tecnologia
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
