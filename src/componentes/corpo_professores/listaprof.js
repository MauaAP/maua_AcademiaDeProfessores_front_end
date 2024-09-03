import React, { useState } from "react";
import './listaprof.css';
import { FaSpinner, FaListAlt, FaUserPlus } from "react-icons/fa";
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
            <div className="flex m-12 justify-between gap-4 max-md:flex-col">
                <h2 className="text-2xl font-semibold text-[#4F1313] max-lg:text-center">Usuários</h2>
                <input 
                    className="border-2 border-gray-400 p-2 rounded-md shadow-xl w-72 max-md:w-full"
                    type="text"
                    placeholder="Procurar..."
                    value={filtro}
                    onChange={handleFiltroChange}
                />
                <div className="flex items-center gap-4 justify-center">
                    <a href="https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/download-users" className="flex items-center gap-4 p-2 rounded-lg duration-100 text-white bg-[#69A120] hover:bg-[#517e17]">{<FaListAlt />} Baixar Usuários</a>
                    <a className="flex items-center gap-4 p-2 rounded-lg duration-100 text-white bg-[#69A120] hover:bg-[#517e17]" href="/cadastroProfessores">{<FaUserPlus />} Cadastrar</a>
                </div>
            </div>

            <div className="m-12">
                {filteredProfessores.length === 0 ?
                    <p className="flex items-center justify-center text-4xl">
                        <FaSpinner className="animate-spin" />
                    </p>
                : filteredProfessores.map((professor, index) => (
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
