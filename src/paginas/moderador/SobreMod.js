import React, { useState, useEffect } from "react";
import FormSobre from "../../componentes/form_sobre/formSobre";
import NavBar from "../../componentes/home/navbar";
import axios from 'axios';

export default function SobreMod({ itensMenu }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://168.138.135.69:3000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar os dados do usuário:', error);
            });
        }
    }, []);

    return (
        <body className="sobre">  
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            {userData && <FormSobre nomeP={userData.name} emailP={userData.email} cpfP={userData.cpf} phone={userData.telefone}/>}
        </body>
    );
}
