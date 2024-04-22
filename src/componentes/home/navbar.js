import React, { useState, useRef, useEffect } from "react";
import './navbar.css';
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link } from 'react-router-dom';

export default function NavBar({ cargo, nome, itensMenu, cor }) {
    const [menuAberto, setMenuAberto] = useState(false);
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

    return (
        <nav className="navbar" style={{ backgroundColor: cor }}>
            <div className="navbar-left">
                <div className="usuario">
                    <FaUserCircle />
                    <h1>{cargo} - {nome}</h1>
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
                            <Link to={item.rota} onClick={toggleMenu}>
                                {item.nome}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="barrinha" style={{ backgroundColor: cor }}></div>
            </div>
        </nav>
    );
}
