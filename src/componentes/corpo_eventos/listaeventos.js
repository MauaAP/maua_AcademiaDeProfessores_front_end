import React, { useState } from "react";
import { FaCalendarPlus, FaSearch, FaTh, FaList, FaCalendarAlt, FaSort, FaSortUp, FaSortDown, FaUserPlus } from "react-icons/fa";
import TemplateEvento from "../evento/evento";
import Select from "react-select";
import axios from "axios";
import { toast } from 'react-toastify';
import { isPast, isFuture, isToday, startOfMonth, endOfMonth, addMonths, isWithinInterval } from "date-fns";

export default function Eventos({ listaEventos, cadEvento = "", mostrarInputTituloEvento = true, listaProfessores = [] }) {
    const [filtro, setFiltro] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('all'); // all, past, future, today, thisMonth, nextMonth
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

    const handlePeriodChange = (event) => {
        setFilterPeriod(event.target.value);
        setCurrentPage(1); // Reseta para a primeira página quando o filtro muda
    };

    const filteredEventos = listaEventos
        .filter(evento => {
            // Filtro de busca por texto
            const matchesSearch = evento.eventName.toLowerCase().includes(filtro.toLowerCase()) ||
                evento.local.toLowerCase().includes(filtro.toLowerCase()) ||
                evento.modality.toLowerCase().includes(filtro.toLowerCase());

            if (!matchesSearch) return false;

            // Filtro por período
            if (filterPeriod !== 'all') {
                const eventDate = new Date(evento.date);
                eventDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                switch (filterPeriod) {
                    case 'past':
                        if (!isPast(eventDate) && !isToday(eventDate)) return false;
                        break;
                    case 'future':
                        if (!isFuture(eventDate) && !isToday(eventDate)) return false;
                        break;
                    case 'today':
                        if (!isToday(eventDate)) return false;
                        break;
                    case 'thisMonth':
                        const monthStart = startOfMonth(today);
                        const monthEnd = endOfMonth(today);
                        if (!isWithinInterval(eventDate, { start: monthStart, end: monthEnd })) return false;
                        break;
                    case 'nextMonth':
                        const nextMonthStart = startOfMonth(addMonths(today, 1));
                        const nextMonthEnd = endOfMonth(addMonths(today, 1));
                        if (!isWithinInterval(eventDate, { start: nextMonthStart, end: nextMonthEnd })) return false;
                        break;
                    default:
                        break;
                }
            }

            return true;
        })
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
    const parseEventTimestamp = (value) => {
        if (value == null) return NaN;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const asNumber = Number(value);
            if (!Number.isNaN(asNumber) && isFinite(asNumber)) return asNumber;
            const parsed = Date.parse(value);
            return Number.isNaN(parsed) ? NaN : parsed;
        }
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? NaN : parsed;
    };

    const startOfToday = (() => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); })();

    const upcomingEvents = [...listaEventos]
        .map(ev => ({ ev, ts: parseEventTimestamp(ev.date) }))
        .filter(x => !Number.isNaN(x.ts) && x.ts >= startOfToday)
        .sort((a, b) => a.ts - b.ts)
        .map(x => x.ev);

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
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">‹</span>
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
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-t border-b transition-colors ${
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
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">›</span>
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col gap-6">
                        {/* Title Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-shrink-0">
                                    <img 
                                        src="/imagens/logo_acad.jpeg" 
                                        alt="Logo Academia de Professores" 
                                        className="h-12 sm:h-16 w-auto object-contain rounded-lg"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Eventos</h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {filteredEventos.length} evento{filteredEventos.length !== 1 ? 's' : ''} encontrado{filteredEventos.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {cadEvento && (
                                    <a 
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white text-sm sm:text-base font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 whitespace-nowrap" 
                                        href={cadEvento}
                                    >
                                        <FaCalendarPlus />
                                        <span className="hidden sm:inline">Cadastrar Evento</span>
                                        <span className="sm:hidden">Cadastrar</span>
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={openPresenceModal}
                                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white text-sm sm:text-base font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 whitespace-nowrap"
                                >
                                    <FaUserPlus />
                                    <span className="hidden sm:inline">Adicionar Presença</span>
                                    <span className="sm:hidden">Presença</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Search and Filters Section */}
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                                <input 
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base"
                                    type="text"
                                    placeholder="Buscar por evento, local ou modalidade..."
                                    value={filtro}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Filtro por Período */}
                                <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm sm:text-base" />
                                    <select
                                        value={filterPeriod}
                                        onChange={handlePeriodChange}
                                        className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm sm:text-base"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '12px'
                                        }}
                                    >
                                        <option value="all">Todos os Períodos</option>
                                        <option value="past">Passados</option>
                                        <option value="today">Hoje</option>
                                        <option value="future">Futuros</option>
                                        <option value="thisMonth">Este Mês</option>
                                        <option value="nextMonth">Próximo Mês</option>
                                    </select>
                                </div>
                                
                                {/* Sort Controls */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm sm:text-base" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full sm:w-auto pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm sm:text-base"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 0.75rem center',
                                                backgroundSize: '12px'
                                            }}
                                        >
                                            <option value="date">Data</option>
                                            <option value="name">Nome</option>
                                            <option value="local">Local</option>
                                            <option value="modality">Modalidade</option>
                                        </select>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            setCurrentPage(1);
                                        }}
                                        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 hover:border-maua-blue focus:outline-none transition-colors flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                                        title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
                                    >
                                        {sortOrder === 'asc' ? (
                                            <FaSortUp className="text-gray-600 text-base sm:text-lg" />
                                        ) : (
                                            <FaSortDown className="text-gray-600 text-base sm:text-lg" />
                                        )}
                                    </button>
                                </div>
                                
                                {/* View Mode Toggle */}
                                <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors flex items-center justify-center ${
                                            viewMode === 'grid' 
                                                ? 'bg-maua-blue text-white' 
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                        title="Visualização em grade"
                                    >
                                        <FaTh className="text-sm sm:text-base" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors flex items-center justify-center border-l border-gray-200 ${
                                            viewMode === 'list' 
                                                ? 'bg-maua-blue text-white' 
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                        title="Visualização em lista"
                                    >
                                        <FaList className="text-sm sm:text-base" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Carousel */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 sm:mb-8">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Próximos eventos</h2>
                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">{upcomingEvents.length}</span>
                    </div>
                    <div className="p-3 sm:p-4">
                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-6 sm:py-8 text-gray-500">
                                <FaCalendarAlt className="mx-auto text-3xl sm:text-4xl text-gray-300 mb-2" />
                                <p className="text-sm sm:text-base">Nenhum evento futuro encontrado.</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                                {upcomingEvents.map((ev, idx) => (
                                    <div key={idx} className="min-w-[240px] sm:min-w-[260px] max-w-[240px] sm:max-w-[260px] snap-start bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 flex-shrink-0 hover:border-maua-blue hover:shadow-md transition-all duration-200">
                                        <div className="mb-2">
                                            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">{new Date(ev.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                                            <div className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">{ev.eventName}</div>
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 truncate mb-2">{ev.local}</div>
                                        <div className="mt-2 sm:mt-3">
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{ev.modality}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaSearch className="animate-pulse text-xl sm:text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                {filtro || filterPeriod !== 'all' 
                                    ? 'Tente ajustar os filtros de busca.' 
                                    : 'Não há eventos cadastrados no momento.'}
                            </p>
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
                                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                        <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                                            Mostrando <span className="font-semibold">{indexOfFirstItem + 1}</span> a <span className="font-semibold">{Math.min(indexOfLastItem, filteredEventos.length)}</span> de <span className="font-semibold">{filteredEventos.length}</span> resultados
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="flex items-center space-x-0.5 sm:space-x-1">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Adicionar Presença</h2>
                            <button
                                type="button"
                                onClick={closePresenceModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Selecione o evento e o professor</p>
                        <form onSubmit={handleConfirmPresence} className="space-y-4 sm:space-y-5">
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
                                            className="text-sm"
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
                                            className="text-sm"
                                        />
                                    );
                                })()}
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={closePresenceModal} 
                                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-maua-blue to-maua-light-blue text-white font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
