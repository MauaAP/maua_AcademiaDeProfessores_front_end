import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import FormSobre from "../../componentes/form_sobre/formSobre";
import axios from 'axios';

export default function SobreProf ({itensMenu}){
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios.get('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/user', {
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
    
    return(
        <body className="sobre">  
            <NavBar itensMenu={itensMenu} cor={"#14134F"}/>
            {userData && <FormSobre nomeP={userData.name} emailP={userData.email} cpfP={userData.cpf} phone={userData.telefone}/>}
        </body>
    )
}