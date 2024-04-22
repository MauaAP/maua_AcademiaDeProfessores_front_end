import React, { useState } from "react";
import './listaeventos.css';
import { FaCalendarPlus } from "react-icons/fa6";
import TemplateEvento from "../evento/evento";

export default function Eventos({ listaEventos, cadEvento}) {
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const filteredEventos = listaEventos.filter(evento =>
        evento.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="evento-container">
            <div className="titulo-evento">
                <h2>Eventos</h2>
                <a href={cadEvento}>{<FaCalendarPlus />} Cadastrar</a>
                <input 
                    type="text"
                    placeholder="Procurar..."
                    value={filtro}
                    onChange={handleFiltroChange}
                />
            </div>

            <div className="eventos">
                {filteredEventos.map((evento, index) => (
                    <TemplateEvento
                        key={index}
                        evento={evento.nome}
                        data={evento.data}
                        local={evento.local}
                        modalidade={evento.modalidade}
                        cargaH ={evento.cargaHoraria}
                        profResp = {evento.professorResp}
                        aplicador = {evento.aplicador}
                        emailApli = {evento.emailAplicador}
                        pbAlvo = {evento.publicoAlvo}
                        tipo = {evento.tipoAtividade}
                        numMax = {evento.numeroMaxParticipantes}
                        objt = {evento.objetivo}
                        competencias = {evento.competencias}
                        link = {evento.link}
                    />
                ))}
            </div>
        </div>
    )
}
