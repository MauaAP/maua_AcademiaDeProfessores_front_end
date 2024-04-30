import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/home/navbar";
import Professores from "../../componentes/corpo_professores/listaprof";
import axios from 'axios';

export default function ListaProfessores ({itensMenu}) {
    const [listaProfessores, setListaProfessores] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://168.138.135.69:3000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setListaProfessores(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                // Trate o erro conforme necessário
            }
        };

        if (token) {
            fetchUsers();
        }
    }, []); 

    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            <Professores listaprofessores={listaProfessores}/>
        </body>
    )
}
