import React, { useState, useEffect } from "react";
import NavBar from "../../componentes/navbar/navbar";
import ListaAvaliacoes from "../../componentes/avaliacao/ListaAvaliacoes";
import { LoadingCard } from "../../componentes/Loading/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const API_BASE = "https://6mv3jcpmik.us-east-1.awsapprunner.com";

export default function Avaliacoes({ itensMenu }) {
    const [listaEventos, setListaEventos] = useState([]);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [avaliacoesData, setAvaliacoesData] = useState([]);
    const [loadingEventos, setLoadingEventos] = useState(true);
    const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

    // Busca lista de eventos
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/events/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setListaEventos(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
                toast.error("Erro ao buscar a lista de eventos!");
            } finally {
                setLoadingEventos(false);
            }
        };
        fetchEventos();
    }, []);

    // Busca avaliações quando um evento é selecionado
    const handleSelectEvento = async (option) => {
        setEventoSelecionado(option);
        setAvaliacoesData([]);
        if (!option) return;

        try {
            setLoadingAvaliacoes(true);
            const response = await axios.get(
                `${API_BASE}/api/evaluations/event/${option.value}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setAvaliacoesData(response.data.evaluations || []);
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            const status = error.response?.status;
            if (status === 404) {
                toast.error("Evento não encontrado.");
            } else if (status === 403) {
                toast.error("Sem permissão para visualizar avaliações.");
            } else {
                toast.error("Erro ao buscar avaliações do evento!");
            }
        } finally {
            setLoadingAvaliacoes(false);
        }
    };

    const eventOptions = listaEventos.map((ev) => ({
        value: ev.eventId,
        label: `${ev.eventName} — ${new Date(ev.date).toLocaleDateString("pt-BR")}`,
    }));

    return (
        <div>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"} />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src="/imagens/logo_acad.jpeg"
                                        alt="Logo Academia de Professores"
                                        className="h-12 sm:h-16 w-auto object-contain rounded-lg"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                        Avaliações de Eventos
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Selecione um evento para visualizar as avaliações dos participantes
                                    </p>
                                </div>
                            </div>

                            {/* Select de eventos */}
                            <div className="max-w-xl">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Evento
                                </label>
                                {loadingEventos ? (
                                    <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
                                ) : (
                                    <Select
                                        options={eventOptions}
                                        value={eventoSelecionado}
                                        onChange={handleSelectEvento}
                                        placeholder="Selecione um evento..."
                                        isSearchable
                                        isClearable
                                        noOptionsMessage={() => "Nenhum evento encontrado"}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        {!eventoSelecionado ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Selecione um evento
                                </h3>
                                <p className="text-gray-500">
                                    Escolha um evento acima para ver as avaliações dos participantes.
                                </p>
                            </div>
                        ) : loadingAvaliacoes ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <LoadingCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <ListaAvaliacoes avaliacoesData={avaliacoesData} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
