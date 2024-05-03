import React, { useState } from "react";
import './listaprof.css';
import { FaUserPlus } from "react-icons/fa";
import TemplateProfessor from "../professor/professor";

export default function Professores({ listaprofessores }) {
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const filteredProfessores = listaprofessores.filter(professor =>
        professor.name.toLowerCase().includes(filtro.toLowerCase())
    );


    return (
        <div className="professores-container">
            <div className="titulo-professores">
                <h2>Usuários</h2>
                <a href="/cadastroProfessores">{<FaUserPlus />} Cadastrar</a>
                <input 
                    type="text"
                    placeholder="Procurar..."
                    value={filtro}
                    onChange={handleFiltroChange}
                />
            </div>

            <div className="professores">
                {filteredProfessores.map((professor, index) => (
                    <TemplateProfessor
                        key={index}
                        id = {professor.id}
                        professor={professor.name}
                        cpf={professor.cpf}
                        phone={professor.telefone}
                        email={professor.email}
                        role={professor.role}
                        status = {professor.status}
                    />
                ))}
            </div>
        </div>
    )
}
