import React, { useState } from "react";
import { FaCalendarPlus, FaSearch, FaFilter, FaTh, FaList } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import TemplateEvento from "../evento/evento";
import Select from "react-select";
import axios from "axios";
import { toast } from 'react-toastify';

export default function Eventos({ listaEventos, cadEvento = "", mostrarInputTituloEvento = true, listaProfessores = [] }) {
    const [filtro, setFiltro] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('grid');
    const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
    const [presenceEventId, setPresenceEventId] = useState('');
    const [presenceProfessorId, setPresenceProfessorId] = useState('');
    const itemsPerPage = 9;

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
        setCurrentPage(1); // Reseta para a primeira página quando o filtro muda
    };

    const filteredEventos = listaEventos
        .filter(evento =>
            evento.eventName.toLowerCase().includes(filtro.toLowerCase()) ||
            evento.local.toLowerCase().includes(filtro.toLowerCase()) ||
            evento.modality.toLowerCase().includes(filtro.toLowerCase())
        )
        .sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.eventName.toLowerCase();
                    bValue = b.eventName.toLowerCase();
                    break;
                case 'local':
                    aValue = a.local.toLowerCase();
                    bValue = b.local.toLowerCase();
                    break;
                case 'modality':
                    aValue = a.modality.toLowerCase();
                    bValue = b.modality.toLowerCase();
                    break;
                case 'date':
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Cálculos de paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEventos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPaginationButtons = () => {
        const pageButtons = [];
        const maxVisiblePages = 5;

        // Botão anterior
        pageButtons.push(
            <button
                key="prev"
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
            </button>
        );

        // Páginas
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`px-3 py-2 text-sm font-medium border-t border-b ${
                        currentPage === i
                            ? 'text-maua-blue bg-blue-50 border-maua-blue'
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Botão próximo
        pageButtons.push(
            <button
                key="next"
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Próximo
            </button>
        );

        return pageButtons;
    };

    const openPresenceModal = () => {
        setPresenceEventId('');
        setPresenceProfessorId('');
        setIsPresenceModalOpen(true);
    };

    const closePresenceModal = () => {
        setIsPresenceModalOpen(false);
    };

    const handleConfirmPresence = async (e) => {
        e.preventDefault();
        // Integração com API pode ser adicionada aqui
        try {
            const response = await axios.post("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-presence", {
                userid: presenceProfessorId,
                eventid: presenceEventId
            });

            console.log("Presença criada com sucesso:", response.data);
            setIsPresenceModalOpen(false);
            toast.success('Presença criada com sucesso!');
        } catch (error) {
            console.error("Erro ao adicionar presença:", error);
        }
        setIsPresenceModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
                            <p className="text-gray-600">
                                {filteredEventos.length} evento{filteredEventos.length !== 1 ? 's' : ''} encontrado{filteredEventos.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        
                        {/* Search and Controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    type="text"
                                    placeholder="Buscar por evento, local ou modalidade..."
                                    value={filtro}
                                    onChange={handleFiltroChange}
                                />
                            </div>
                            
                            {/* Sort Controls */}
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                >
                                    <option value="date">Data</option>
                                    <option value="name">Nome</option>
                                    <option value="local">Local</option>
                                    <option value="modality">Modalidade</option>
                                </select>
                                
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-maua-blue focus:outline-none transition-colors flex items-center gap-2"
                                >
                                    <FaFilter />
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                            
                            {/* View Mode Toggle */}
                            <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-3 transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-maua-blue text-white' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <FaTh />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-3 transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-maua-blue text-white' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <FaList />
                                </button>
                            </div>
                            
                            {/* Add Event Button */}
                            {cadEvento && (
                                <a 
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95" 
                                    href={cadEvento}
                                >
                                    <FaCalendarPlus />
                                    Cadastrar Evento
                                </a>
                            )}

                            {/* Add Presence Button */}
                            <button
                                type="button"
                                onClick={openPresenceModal}
                                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                Adicionar Presença
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaSpinner className="animate-spin text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
                            <p className="text-gray-500">Não há eventos cadastrados no momento.</p>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 sm:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch' : 'space-y-4'}`}>
                                {currentItems.map((evento, index) => (
                                    <div key={index} className="animate-fadeIn h-full">
                                        <TemplateEvento
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
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredEventos.length)} de {filteredEventos.length} resultados
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="flex items-center space-x-1">
                                                {renderPaginationButtons()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {isPresenceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Adicionar Presença</h2>
                        <p className="text-gray-600 mb-6">Selecione o evento e o professor</p>
                        <form onSubmit={handleConfirmPresence} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
                                {(() => {
                                    const eventOptions = listaEventos.map((ev) => ({
                                        value: ev.eventId,
                                        label: `${ev.eventName} — ${new Date(ev.date).toLocaleDateString('pt-BR')}`
                                    }));
                                    const selected = eventOptions.find(o => o.value === presenceEventId) || null;
                                    return (
                                        <Select
                                            options={eventOptions}
                                            value={selected}
                                            onChange={(opt) => setPresenceEventId(opt ? opt.value : '')}
                                            placeholder="Selecione um evento..."
                                            isSearchable
                                            noOptionsMessage={() => "Nenhuma opção"}
                                        />
                                    );
                                })()}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Professor</label>
                                {(() => {
                                    const profOptions = listaProfessores.map((prof) => {
                                        const value = prof.id ?? prof.userId ?? prof.professorId ?? '';
                                        const label = prof.name ?? prof.fullName ?? prof.email ?? String(value);
                                        return { value: String(value), label };
                                    });
                                    const selected = profOptions.find(o => o.value === String(presenceProfessorId)) || null;
                                    return (
                                        <Select
                                            options={profOptions}
                                            value={selected}
                                            onChange={(opt) => setPresenceProfessorId(opt ? opt.value : '')}
                                            placeholder="Selecione um professor..."
                                            isSearchable
                                            noOptionsMessage={() => "Nenhuma opção"}
                                        />
                                    );
                                })()}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closePresenceModal} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-maua-blue to-maua-light-blue text-white font-semibold hover:shadow-lg">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
