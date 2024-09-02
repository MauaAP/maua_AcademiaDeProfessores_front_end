import React, { useState } from "react";
import './listaeventos.css';
import { FaCalendarPlus } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import TemplateEvento from "../evento/evento";

export default function Eventos({ listaEventos, cadEvento = "", mostrarInputTituloEvento = true }) {
    const [filtro, setFiltro] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de eventos por página

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
        setCurrentPage(1); // Reseta para a primeira página quando o filtro muda
    };

    const filteredEventos = listaEventos.filter(evento =>
        evento.eventName.toLowerCase().includes(filtro.toLowerCase())
    );

    // Cálculos de paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEventos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPaginationButtons = () => {
        const pageButtons = [];
        const maxVisiblePages = 3;

        if (currentPage > 1) {
            pageButtons.push(
                <button
                    key={1}
                    onClick={() => paginate(1)}
                    className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                >
                    1
                </button>
            );
        }

        if (currentPage > maxVisiblePages + 1) {
            pageButtons.push(<span key="before-dots">...</span>);
        }

        const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 2);
        const endPage = Math.min(currentPage + Math.floor(maxVisiblePages / 2), totalPages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - maxVisiblePages) {
            pageButtons.push(<span key="after-dots">...</span>);
        }

        if (currentPage < totalPages) {
            pageButtons.push(
                <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <div className="evento-container">
            <div className="flex m-12 justify-between gap-4 max-md:flex-col">
                <h2 className="text-2xl font-semibold text-[#4F1313] max-lg:text-center">Eventos</h2>
                <input 
                    className="border-2 border-gray-400 p-2 rounded-md shadow-xl w-72 max-md:w-full"
                    type="text"
                    placeholder="Procurar..."
                    value={filtro}
                    onChange={handleFiltroChange}
                />
                {cadEvento && <a className="flex items-center gap-4 p-2 rounded-lg duration-100 text-white bg-[#69A120] hover:bg-[#517e17]" href={cadEvento}><FaCalendarPlus /> Cadastrar</a>}
            </div>

            <div className="m-12">
                {currentItems.length === 0 ? (
                    <p className="flex items-center justify-center text-4xl">
                        <FaSpinner className="animate-spin" />
                    </p>
                ) : (
                    currentItems.map((evento, index) => (
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
                    ))
                )}
                <div className="flex justify-center">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
}
