import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaStar, FaAlignLeft, FaArrowUp, FaArrowDown, FaCheck, FaTrash } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import Select from "react-select";

const API_BASE = "https://6mv3jcpmik.us-east-1.awsapprunner.com";

export default function GerenciarPerguntas() {
    // --- Catálogo global ---
    const [perguntas, setPerguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [novaPergunta, setNovaPergunta] = useState({ text: "", type: "RATING" });
    const [saving, setSaving] = useState(false);

    // --- Questionário por evento ---
    const [eventos, setEventos] = useState([]);
    const [loadingEventos, setLoadingEventos] = useState(true);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [perguntasSelecionadas, setPerguntasSelecionadas] = useState([]); // [{id, text, type}] em ordem
    const [savingQuestionario, setSavingQuestionario] = useState(false);

    const fetchPerguntas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/evaluations/questions`);
            setPerguntas(response.data.questions || []);
        } catch (error) {
            console.error("Erro ao buscar perguntas:", error);
            toast.error("Erro ao carregar as perguntas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerguntas();
    }, []);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/events/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setEventos(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
            } finally {
                setLoadingEventos(false);
            }
        };
        fetchEventos();
    }, []);

    // Quando seleciona evento, carrega as perguntas já configuradas para ele
    const handleSelectEvento = async (option) => {
        setEventoSelecionado(option);
        setPerguntasSelecionadas([]);
        if (!option) return;
        try {
            const response = await axios.get(
                `${API_BASE}/api/evaluations/event/${option.value}/questions`
            );
            const qs = response.data.questions || [];
            // Mapeia para os objetos completos do catálogo para manter consistência
            setPerguntasSelecionadas(qs);
        } catch (error) {
            console.error("Erro ao buscar questionário do evento:", error);
            toast.error("Erro ao carregar o questionário atual do evento.");
        }
    };

    const isSelected = (id) => perguntasSelecionadas.some((p) => p.id === id);

    const togglePergunta = (pergunta) => {
        if (isSelected(pergunta.id)) {
            setPerguntasSelecionadas((prev) => prev.filter((p) => p.id !== pergunta.id));
        } else {
            setPerguntasSelecionadas((prev) => [...prev, pergunta]);
        }
    };

    const moverParaCima = (index) => {
        if (index === 0) return;
        setPerguntasSelecionadas((prev) => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
    };

    const moverParaBaixo = (index) => {
        setPerguntasSelecionadas((prev) => {
            if (index === prev.length - 1) return prev;
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    };

    const handleSalvarQuestionario = async () => {
        if (!eventoSelecionado) return;
        try {
            setSavingQuestionario(true);
            await axios.put(
                `${API_BASE}/api/evaluations/event/${eventoSelecionado.value}/questionnaire`,
                { questionIds: perguntasSelecionadas.map((p) => p.id) },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            toast.success("Questionário do evento atualizado!");
        } catch (error) {
            console.error("Erro ao salvar questionário:", error);
            const status = error.response?.status;
            if (status === 403) {
                toast.error("Apenas administradores podem configurar o questionário.");
            } else {
                toast.error("Erro ao salvar questionário. Tente novamente.");
            }
        } finally {
            setSavingQuestionario(false);
        }
    };

    // --- Deletar pergunta ---
    const handleDeletarPergunta = async (id) => {
        if (!window.confirm("Tem certeza que deseja deletar esta pergunta?")) return;
        try {
            await axios.delete(`${API_BASE}/api/evaluations/questions/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            toast.success("Pergunta deletada com sucesso!");
            fetchPerguntas();
        } catch (error) {
            console.error("Erro ao deletar pergunta:", error);
            const status = error.response?.status;
            if (status === 403) {
                toast.error("Apenas administradores podem deletar perguntas.");
            } else if (status === 404) {
                toast.error("Pergunta não encontrada.");
            } else {
                toast.error("Erro ao deletar pergunta. Tente novamente.");
            }
        }
    };

    // --- Criação de nova pergunta ---
    const handleOpenModal = () => {
        setNovaPergunta({ text: "", type: "RATING" });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSalvar = async (e) => {
        e.preventDefault();
        if (!novaPergunta.text.trim()) {
            toast.error("O texto da pergunta não pode estar vazio.");
            return;
        }
        try {
            setSaving(true);
            await axios.post(
                `${API_BASE}/api/evaluations/questions`,
                { text: novaPergunta.text.trim(), type: novaPergunta.type },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            toast.success("Pergunta criada com sucesso!");
            setIsModalOpen(false);
            fetchPerguntas();
        } catch (error) {
            console.error("Erro ao criar pergunta:", error);
            const status = error.response?.status;
            if (status === 400) {
                toast.error(error.response?.data?.message || "Dados inválidos. Verifique os campos.");
            } else if (status === 403) {
                toast.error("Apenas administradores podem criar perguntas.");
            } else {
                toast.error("Erro ao criar pergunta. Tente novamente.");
            }
        } finally {
            setSaving(false);
        }
    };

    const eventOptions = eventos.map((ev) => ({
        value: ev.eventId,
        label: `${ev.eventName} — ${new Date(ev.date).toLocaleDateString("pt-BR")}`,
    }));

    return (
        <section className="p-6 sm:p-10 max-w-4xl mx-auto space-y-12">

            {/* ── Seção 1: Catálogo global de perguntas ── */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <img
                            src="/imagens/logo_acad.jpeg"
                            alt="Logo Academia de Professores"
                            className="h-12 w-auto object-contain rounded-lg"
                        />
                        <h2 className="text-2xl font-semibold text-[#4F1313]">Perguntas de Avaliação</h2>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                    >
                        <FaPlus />
                        Nova Pergunta
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-10 h-10 border-4 border-maua-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : perguntas.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow border border-gray-100">
                        <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma pergunta cadastrada</h3>
                        <p className="text-gray-500">Clique em "Nova Pergunta" para adicionar a primeira.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {perguntas.map((p, index) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex items-center justify-between gap-4 animate-fadeIn"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <span className="w-8 h-8 rounded-full bg-maua-blue text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-gray-900 font-medium truncate">{p.text}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                        p.type === "RATING"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}>
                                        {p.type === "RATING"
                                            ? <><FaStar className="text-xs" /> Nota (1-5)</>
                                            : <><FaAlignLeft className="text-xs" /> Texto</>
                                        }
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeletarPergunta(p.id)}
                                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Deletar pergunta"
                                    >
                                        <FaTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Seção 2: Questionário por evento ── */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-semibold text-[#4F1313]">Questionário por Evento</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Selecione um evento e escolha quais perguntas aparecem na avaliação dele, definindo também a ordem de exibição.
                    Se nenhuma pergunta for selecionada, todas as perguntas ativas serão exibidas.
                </p>

                {/* Seletor de evento */}
                <div className="mb-6 max-w-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
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

                {eventoSelecionado && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Coluna esquerda: catálogo com checkboxes */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                                Perguntas disponíveis
                            </h3>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-maua-blue border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                    {perguntas.map((p) => (
                                        <label
                                            key={p.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all duration-150 ${
                                                isSelected(p.id)
                                                    ? "border-maua-blue bg-blue-50"
                                                    : "border-gray-100 hover:border-gray-200 bg-gray-50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected(p.id)}
                                                onChange={() => togglePergunta(p)}
                                                className="w-4 h-4 accent-maua-blue flex-shrink-0"
                                            />
                                            <span className="text-sm text-gray-800 leading-snug">{p.text}</span>
                                            <span className={`ml-auto flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                p.type === "RATING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {p.type === "RATING" ? "Nota" : "Texto"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Coluna direita: ordem das selecionadas */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                                Ordem de exibição
                            </h3>

                            {perguntasSelecionadas.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-center py-8">
                                    <p className="text-sm text-gray-400">
                                        Selecione perguntas ao lado para definir a ordem.
                                        <br />
                                        <span className="text-xs">Sem seleção, todas as ativas serão exibidas.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 flex-1 max-h-96 overflow-y-auto pr-1">
                                    {perguntasSelecionadas.map((p, index) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-maua-blue rounded-xl"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-maua-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-gray-800 flex-1 leading-snug truncate">
                                                {p.text}
                                            </span>
                                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => moverParaCima(index)}
                                                    disabled={index === 0}
                                                    className="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FaArrowUp className="text-maua-blue text-xs" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moverParaBaixo(index)}
                                                    disabled={index === perguntasSelecionadas.length - 1}
                                                    className="p-1 rounded hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FaArrowDown className="text-maua-blue text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSalvarQuestionario}
                                disabled={savingQuestionario}
                                className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-maua-blue to-maua-light-blue text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {savingQuestionario
                                    ? <><AiOutlineLoading className="animate-spin" size={16} /> Salvando...</>
                                    : <><FaCheck size={14} /> Salvar Questionário</>
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Nova Pergunta */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Nova Pergunta</h2>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSalvar} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto da Pergunta *
                                </label>
                                <input
                                    type="text"
                                    value={novaPergunta.text}
                                    onChange={(e) => setNovaPergunta((prev) => ({ ...prev, text: e.target.value }))}
                                    placeholder="Ex: O evento trouxe novos conhecimentos?"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Tipo de Resposta *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "RATING", label: "Nota (1-5)", icon: <FaStar />, color: "yellow" },
                                        { value: "TEXT", label: "Texto Livre", icon: <FaAlignLeft />, color: "blue" }
                                    ].map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                novaPergunta.type === opt.value
                                                    ? "border-maua-blue bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={opt.value}
                                                checked={novaPergunta.type === opt.value}
                                                onChange={() => setNovaPergunta((prev) => ({ ...prev, type: opt.value }))}
                                                className="sr-only"
                                            />
                                            <span className={`text-lg ${opt.color === "yellow" ? "text-yellow-500" : "text-blue-500"}`}>
                                                {opt.icon}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                >
                                    {saving
                                        ? <><AiOutlineLoading className="animate-spin" size={16} /> Salvando...</>
                                        : "Salvar"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
