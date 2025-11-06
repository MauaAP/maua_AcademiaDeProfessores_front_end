import React, { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isPast, isFuture, isToday, startOfMonth, endOfMonth, addMonths, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaPlus, FaFilter, FaCalendarAlt, FaList, FaTh, FaSearch, FaTimes, FaMapMarkerAlt, FaUser, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// Configurar localização para português
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

// Função para obter cor baseada na modalidade
const getEventColor = (modality) => {
  switch (modality?.toLowerCase()) {
    case "presencial":
      return "#014587"; // maua-blue
    case "híbrido":
    case "hibrido":
      return "#69A120"; // maua-green
    case "remoto":
      return "#DC9D3E"; // maua-orange
    default:
      return "#60ADF4"; // maua-light-blue
  }
};

// Componente de evento customizado
const EventComponent = ({ event }) => {
  return (
    <div
      className="h-full w-full p-1 rounded text-white text-xs font-medium overflow-hidden"
      style={{
        backgroundColor: event.color,
        borderLeft: `4px solid ${event.color}`,
      }}
    >
      <div className="font-semibold truncate">{event.title}</div>
      <div className="text-xs opacity-90 truncate">{event.local}</div>
    </div>
  );
};

export default function CalendarioEventos({ listaEventos, onCreateEvent }) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filterModality, setFilterModality] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all"); // all, past, future, today, thisMonth, nextMonth
  const [filterLocal, setFilterLocal] = useState("all");
  const [filterHost, setFilterHost] = useState("all");
  const [filterManager, setFilterManager] = useState("all");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(600);
  const navigate = useNavigate();

  // Ajustar altura do calendário baseado na view e tamanho da tela
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (view === "month") {
        setCalendarHeight(width < 640 ? 500 : width < 1024 ? 550 : 600);
      } else if (view === "week") {
        setCalendarHeight(width < 640 ? 400 : width < 1024 ? 500 : 600);
      } else {
        setCalendarHeight(width < 640 ? 400 : width < 1024 ? 500 : 600);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [view]);

  // Obter role do usuário
  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.role;
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
    return null;
  };

  const userRole = getUserRole();

  // Mapear eventos para o formato do react-big-calendar
  const events = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return listaEventos
      .filter((evento) => {
        // Filtro por modalidade
        if (filterModality !== "all" && evento.modality?.toLowerCase() !== filterModality.toLowerCase()) {
          return false;
        }

        // Filtro por período
        const eventDate = new Date(evento.date);
        eventDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filterPeriod === "past" && !isPast(eventDate) && !isToday(eventDate)) {
          return false;
        }
        if (filterPeriod === "future" && !isFuture(eventDate) && !isToday(eventDate)) {
          return false;
        }
        if (filterPeriod === "today" && !isToday(eventDate)) {
          return false;
        }
        if (filterPeriod === "thisMonth") {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          if (!isWithinInterval(eventDate, { start: monthStart, end: monthEnd })) {
            return false;
          }
        }
        if (filterPeriod === "nextMonth") {
          const nextMonthStart = startOfMonth(addMonths(today, 1));
          const nextMonthEnd = endOfMonth(addMonths(today, 1));
          if (!isWithinInterval(eventDate, { start: nextMonthStart, end: nextMonthEnd })) {
            return false;
          }
        }

        // Filtro por local
        if (filterLocal !== "all" && evento.local !== filterLocal) {
          return false;
        }

        // Filtro por aplicador
        if (filterHost !== "all" && evento.host !== filterHost) {
          return false;
        }

        // Filtro por responsável
        if (filterManager !== "all") {
          const managers = Array.isArray(evento.manager) ? evento.manager : [evento.manager];
          if (!managers.some(m => m === filterManager)) {
            return false;
          }
        }

        // Filtro por intervalo de datas
        if (filterDateStart || filterDateEnd) {
          const eventDate = new Date(evento.date);
          eventDate.setHours(0, 0, 0, 0);
          
          if (filterDateStart) {
            const startDate = new Date(filterDateStart);
            startDate.setHours(0, 0, 0, 0);
            if (eventDate < startDate) {
              return false;
            }
          }
          
          if (filterDateEnd) {
            const endDate = new Date(filterDateEnd);
            endDate.setHours(23, 59, 59, 999);
            if (eventDate > endDate) {
              return false;
            }
          }
        }

        // Filtro por busca (nome do evento, local, aplicador)
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesName = evento.eventName?.toLowerCase().includes(searchLower);
          const matchesLocal = evento.local?.toLowerCase().includes(searchLower);
          const matchesHost = evento.host?.toLowerCase().includes(searchLower);
          const matchesManager = Array.isArray(evento.manager) 
            ? evento.manager.some(m => m?.toLowerCase().includes(searchLower))
            : evento.manager?.toLowerCase().includes(searchLower);
          
          if (!matchesName && !matchesLocal && !matchesHost && !matchesManager) {
            return false;
          }
        }

        return true;
      })
      .map((evento) => {
        const eventDate = new Date(evento.date);
        const startTime = evento.initTime ? new Date(evento.initTime) : eventDate;
        const endTime = evento.finishTime ? new Date(evento.finishTime) : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // +2 horas padrão

        return {
          id: evento.eventId,
          title: evento.eventName,
          start: startTime,
          end: endTime,
          resource: evento,
          color: getEventColor(evento.modality),
          local: evento.local,
          modality: evento.modality,
          host: evento.host,
          manager: evento.manager,
        };
      });
  }, [listaEventos, filterModality, filterPeriod, filterLocal, filterHost, filterManager, filterDateStart, filterDateEnd, searchTerm]);

  // Obter valores únicos para filtros
  const modalidades = useMemo(() => {
    const unique = [...new Set(listaEventos.map((e) => e.modality).filter(Boolean))];
    return unique;
  }, [listaEventos]);

  const locais = useMemo(() => {
    const unique = [...new Set(listaEventos.map((e) => e.local).filter(Boolean))];
    return unique.sort();
  }, [listaEventos]);

  const hosts = useMemo(() => {
    const unique = [...new Set(listaEventos.map((e) => e.host).filter(Boolean))];
    return unique.sort();
  }, [listaEventos]);

  const managers = useMemo(() => {
    const allManagers = listaEventos
      .flatMap((e) => {
        if (Array.isArray(e.manager)) {
          return e.manager.filter(Boolean);
        }
        return e.manager ? [e.manager] : [];
      })
      .filter(Boolean);
    const unique = [...new Set(allManagers)];
    return unique.sort();
  }, [listaEventos]);

  // Handlers
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowEventModal(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    // Redirecionar para criação de evento com data pré-preenchida
    if (onCreateEvent) {
      const startDate = format(start, "yyyy-MM-dd");
      const startTime = format(start, "HH:mm");
      const endTime = format(end, "HH:mm");
      
      if (userRole === "ADMIN" || userRole === "SECRETARY") {
        navigate(`/cadastroEventos?date=${startDate}&startTime=${startTime}&endTime=${endTime}`);
      } else if (userRole === "MODERATOR") {
        navigate(`/cadastroEventosMod?date=${startDate}&startTime=${startTime}&endTime=${endTime}`);
      } else {
        toast.info("Apenas administradores e moderadores podem criar eventos");
      }
    }
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Estilos customizados para o calendário
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderLeft: `4px solid ${event.color}`,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "none",
        padding: "2px 4px",
      },
    };
  };

  const clearFilters = () => {
    setFilterModality("all");
    setFilterPeriod("all");
    setFilterLocal("all");
    setFilterHost("all");
    setFilterManager("all");
    setFilterDateStart("");
    setFilterDateEnd("");
    setSearchTerm("");
  };

  const hasActiveFilters = filterModality !== "all" || filterPeriod !== "all" || filterLocal !== "all" || filterHost !== "all" || filterManager !== "all" || filterDateStart !== "" || filterDateEnd !== "" || searchTerm !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src="/imagens/logo_acad.jpeg" 
                    alt="Logo Academia de Professores" 
                    className="h-10 sm:h-14 w-auto object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Calendário de Eventos</h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {events.length} evento{events.length !== 1 ? "s" : ""} encontrado{events.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Botão Criar Evento */}
              {(userRole === "ADMIN" || userRole === "SECRETARY" || userRole === "MODERATOR") && (
                <button
                  onClick={() => {
                    if (userRole === "ADMIN" || userRole === "SECRETARY") {
                      navigate("/cadastroEventos");
                    } else if (userRole === "MODERATOR") {
                      navigate("/cadastroEventosMod");
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white text-sm sm:text-base font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  <FaPlus />
                  <span className="hidden sm:inline">Criar Evento</span>
                  <span className="sm:hidden">Criar</span>
                </button>
              )}
            </div>

            {/* Barra de Busca */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por evento, local ou aplicador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filtros e Controles */}
            <div className="flex flex-col gap-3">
              {/* Botão para mostrar/ocultar filtros */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-maua-blue text-gray-700 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                  <FaFilter />
                  <span>{showFilters ? "Ocultar" : "Mostrar"} Filtros</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-colors text-sm sm:text-base"
                  >
                    <FaTimes />
                    <span className="hidden sm:inline">Limpar Filtros</span>
                    <span className="sm:hidden">Limpar</span>
                  </button>
                )}
              </div>

              {/* Painel de Filtros */}
              {showFilters && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {/* Filtro por Modalidade */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                        <FaFilter className="text-maua-blue" />
                        Modalidade
                      </label>
                      <select
                        value={filterModality}
                        onChange={(e) => setFilterModality(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                      >
                        <option value="all">Todas</option>
                        {modalidades.map((mod) => (
                          <option key={mod} value={mod}>
                            {mod}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Período */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                        <FaCalendarAlt className="text-maua-blue" />
                        Período
                      </label>
                      <select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                      >
                        <option value="all">Todos</option>
                        <option value="past">Passados</option>
                        <option value="today">Hoje</option>
                        <option value="future">Futuros</option>
                        <option value="thisMonth">Este Mês</option>
                        <option value="nextMonth">Próximo Mês</option>
                      </select>
                    </div>

                    {/* Filtro por Local */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                        <FaMapMarkerAlt className="text-maua-blue" />
                        Local
                      </label>
                      <select
                        value={filterLocal}
                        onChange={(e) => setFilterLocal(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                      >
                        <option value="all">Todos</option>
                        {locais.map((local) => (
                          <option key={local} value={local}>
                            {local}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Aplicador */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                        <FaUser className="text-maua-blue" />
                        Aplicador
                      </label>
                      <select
                        value={filterHost}
                        onChange={(e) => setFilterHost(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                      >
                        <option value="all">Todos</option>
                        {hosts.map((host) => (
                          <option key={host} value={host}>
                            {host}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Responsável */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5">
                        <FaUsers className="text-maua-blue" />
                        Responsável
                      </label>
                      <select
                        value={filterManager}
                        onChange={(e) => setFilterManager(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                      >
                        <option value="all">Todos</option>
                        {managers.map((manager) => (
                          <option key={manager} value={manager}>
                            {manager}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Filtro por Intervalo de Datas */}
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-3">
                      <FaCalendarAlt className="text-maua-blue" />
                      Intervalo de Datas
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Data Inicial</label>
                        <input
                          type="date"
                          value={filterDateStart}
                          onChange={(e) => setFilterDateStart(e.target.value)}
                          max={filterDateEnd || undefined}
                          className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Data Final</label>
                        <input
                          type="date"
                          value={filterDateEnd}
                          onChange={(e) => setFilterDateEnd(e.target.value)}
                          min={filterDateStart || undefined}
                          className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                        />
                      </div>
                    </div>
                    {(filterDateStart || filterDateEnd) && (
                      <button
                        onClick={() => {
                          setFilterDateStart("");
                          setFilterDateEnd("");
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <FaTimes />
                        Limpar datas
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Botões de Visualização */}
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
                  <button
                    onClick={() => handleViewChange("day")}
                    className={`px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base ${
                      view === "day" ? "bg-maua-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Visualização diária"
                  >
                    <FaCalendarAlt />
                  </button>
                  <button
                    onClick={() => handleViewChange("week")}
                    className={`px-3 sm:px-4 py-2 transition-colors border-l border-r border-gray-200 text-sm sm:text-base ${
                      view === "week" ? "bg-maua-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Visualização semanal"
                  >
                    <FaList />
                  </button>
                  <button
                    onClick={() => handleViewChange("month")}
                    className={`px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base ${
                      view === "month" ? "bg-maua-blue text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Visualização mensal"
                  >
                    <FaTh />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda - Acima do calendário */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Legenda de Cores</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded flex-shrink-0 shadow-sm" style={{ backgroundColor: "#014587" }}></div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Presencial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded flex-shrink-0 shadow-sm" style={{ backgroundColor: "#69A120" }}></div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Híbrido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded flex-shrink-0 shadow-sm" style={{ backgroundColor: "#DC9D3E" }}></div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Remoto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded flex-shrink-0 shadow-sm" style={{ backgroundColor: "#60ADF4" }}></div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Outros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-2 sm:p-3 md:p-4 lg:p-6 overflow-x-auto">
          <div className="min-w-[280px] sm:min-w-[500px] md:min-w-0">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: calendarHeight, minHeight: 400 }}
              view={view}
              date={date}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há eventos neste período.",
              }}
              culture="pt-BR"
            />
          </div>
        </div>

        {/* Modal de Detalhes do Evento */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.eventName}</h2>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Data</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {selectedEvent.initTime && (
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Horário</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(selectedEvent.initTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {selectedEvent.finishTime
                          ? new Date(selectedEvent.finishTime).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Não definido"}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Local</p>
                    <p className="text-base font-medium text-gray-900">{selectedEvent.local || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Modalidade</p>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getEventColor(selectedEvent.modality) }}
                    >
                      {selectedEvent.modality || "Não informado"}
                    </span>
                  </div>

                  {selectedEvent.host && (
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Aplicador</p>
                      <p className="text-base font-medium text-gray-900">{selectedEvent.host}</p>
                    </div>
                  )}

                  {selectedEvent.manager && (
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Responsável</p>
                      <p className="text-base font-medium text-gray-900">
                        {Array.isArray(selectedEvent.manager) ? selectedEvent.manager.join(", ") : selectedEvent.manager}
                      </p>
                    </div>
                  )}

                  {selectedEvent.goals && (
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Objetivos</p>
                      <p className="text-base text-gray-900">{selectedEvent.goals}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

