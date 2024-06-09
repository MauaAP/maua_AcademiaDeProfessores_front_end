import React, { useState, useRef, useEffect } from "react";
import './navbar.css';
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
        axios.get('https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/user', {
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
            case 'COMMON':
                return 'Comum';
            default:
                return cargo;
        }
    };

    return (
        <nav className="navbar" style={{ backgroundColor: cor }}>
            <div className="navbar-left">
                <div className="usuario">
                    <FaUserCircle />
                    <h1>{getCargoText(cargo)} - {nomeUsuario}</h1>
                </div>
            </div>
            <div className="navbar-right">
                <div className="menu-hamburguer" onClick={toggleMenu}>
                    <IoMenu />
                </div>
            </div>
            <div className={`overlay ${menuAberto ? 'ativo' : ''}`} onClick={toggleMenu}></div>
            <div ref={menuRef} className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
                <h2 style={{ color: cor }}>Menu</h2>
                <ul>
                    {itensMenu.map((item, index) => (
                        <li key={index}>
                            {item.nome === "Sair" ? (
                                <Link to={item.rota} onClick={() => { toggleMenu(); handleLogout(); }}>
                                    {item.nome}
                                </Link>
                            ) : (
                                <Link to={item.rota} onClick={toggleMenu}>
                                    {item.nome}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="barrinha" style={{ backgroundColor: cor }}></div>
            </div>
        </nav>
    );
}
