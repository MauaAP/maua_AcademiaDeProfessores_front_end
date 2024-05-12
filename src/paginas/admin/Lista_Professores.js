import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import Professores from "../../componentes/corpo_professores/listaprof";
import axios from 'axios';
import { toast } from "react-toastify";

export default function ListaProfessores ({itensMenu}) {
    const [listaProfessores, setListaProfessores] = useState([]);

    const notierror = () => toast.error('Erro ao buscar os eventos!');

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://54.232.49.136:3000/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setListaProfessores(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                notierror();
            }
        };

        fetchUsers();
    }, []); 

    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            <Professores listaprofessores={listaProfessores}/>
        </body>
    )
}
