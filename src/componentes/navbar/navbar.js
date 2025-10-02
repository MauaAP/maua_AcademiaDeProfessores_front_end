import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function NavBar({itensMenu, cor }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [cargo, setCargo] = useState('');
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const fecharMenuAoClicarFora = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuAberto(false);
        }
    };

    useEffect(() => {
        if (menuAberto) {
            document.body.style.overflow = "hidden"; 
        } else {
            document.body.style.overflow = "auto"; 
        }

        document.addEventListener("mousedown", fecharMenuAoClicarFora);
        return () => {
            document.removeEventListener("mousedown", fecharMenuAoClicarFora);
        };
    }, [menuAberto]);

    useEffect(() => {
        axios.get('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setNomeUsuario(response.data.name);
            setCargo(response.data.role);
        })
        .catch(error => {
            console.error('Erro ao buscar o nome do usuário:', error);
        });     
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
    };

    const getCargoText = (cargo) => {
        switch (cargo.toUpperCase()) {
            case 'ADMIN':
                return 'Administrador(a)';
            case 'SECRETARY':
                return 'Secretário(a)';
            case 'MODERATOR':
                return 'Moderador(a)';
            case 'PROFESSOR':
                return 'Professor(a)';
            default:
                return cargo;
        }
    };

    return (
        <>
            <nav className="flex justify-between items-center text-white px-6 py-4 shadow-lg backdrop-blur-sm" style={{ backgroundColor: cor }}>
                {/* Logo e Info do Usuário */}
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-2xl" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-semibold">{getCargoText(cargo)}</h1>
                        <p className="text-sm opacity-90">{nomeUsuario}</p>
                    </div>
                </div>

                {/* Menu Button */}
                <button 
                    onClick={toggleMenu}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                >
                    <IoMenu className="text-2xl" />
                </button>
            </nav>

            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    menuAberto ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`} 
                onClick={toggleMenu}
            />

            {/* Sidebar Menu */}
            <div 
                ref={menuRef} 
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    menuAberto ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Menu Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold" style={{ color: cor }}>Menu</h2>
                        <button 
                            onClick={toggleMenu}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-6">
                    <ul className="space-y-2">
                        {itensMenu.map((item, index) => (
                            <li key={index}>
                                {item.nome === "Sair" ? (
                                    <Link 
                                        to={item.rota} 
                                        onClick={() => { toggleMenu(); handleLogout(); }} 
                                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                                    >
                                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {item.nome}
                                    </Link>
                                ) : (
                                    <Link 
                                        to={item.rota} 
                                        onClick={toggleMenu} 
                                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                                    >
                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 group-hover:bg-gray-600 transition-colors" />
                                        {item.nome}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Menu Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Instituto Mauá de Tecnologia</p>
                        <p className="text-xs text-gray-400 mt-1">© 2024</p>
                    </div>
                </div>
            </div>
        </>
    );
}
