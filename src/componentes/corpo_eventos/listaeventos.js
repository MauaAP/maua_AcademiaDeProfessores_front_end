import React, { useState } from "react";
import './listaeventos.css';
import { FaCalendarPlus } from "react-icons/fa6";
import TemplateEvento from "../evento/evento";

export default function Eventos({ listaEventos, cadEvento = "", mostrarInputTituloEvento = true }) {
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const filteredEventos = listaEventos.filter(evento =>
        evento.eventName.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="evento-container">
            <div className="titulo-evento">
                <h2>Eventos</h2>
                {cadEvento && <a href={cadEvento}><FaCalendarPlus /> Cadastrar</a>}
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
                        eventId={evento.eventId}
                        eventName={evento.eventName}
                        date={new Date(evento.date).toLocaleDateString('pt-BR')}
                        local={evento.local}
                        modality={evento.modality}
                        period={evento.period}
                        manager={evento.manager}
                        host={evento.host}
                        hostEmail={evento.hostEmail}
                        hostPhone={evento.hostPhone}
                        targetAudience={evento.targetAudience}
                        activityType={evento.activityType}
                        goals={evento.goals}
                        contentActivities={evento.contentActivities}
                        developedCompetencies={evento.developedCompetencies}
                        initTime={new Date(evento.initTime).toLocaleString('pt-BR')}
                        finishTime={new Date(evento.finishTime).toLocaleString('pt-BR')}
                        link={evento.link}
                        mostrarOpcoesEsp={mostrarInputTituloEvento}
                    />
                ))}
            </div>
        </div>
    )
}
