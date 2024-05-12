import React, { useState, useEffect } from "react";
import FormSobre from "../../componentes/form_sobre/formSobre";
import NavBar from "../../componentes/navbar/navbar";
import axios from 'axios';

export default function SobreMod({ itensMenu }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios.get('http://54.232.49.136:3000/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setUserData(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do usuário:', error);
        });
    
}, []);

    return (
        <body className="sobre">  
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            {userData && <FormSobre nomeP={userData.name} emailP={userData.email} cpfP={userData.cpf} phone={userData.telefone}/>}
        </body>
    );
}
