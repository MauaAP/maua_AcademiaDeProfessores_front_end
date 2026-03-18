import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaStar, FaAlignLeft, FaTrash } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

const API_BASE = "https://6mv3jcpmik.us-east-1.awsapprunner.com";

export default function GerenciarPerguntas() {
    const [perguntas, setPerguntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [novaPergunta, setNovaPergunta] = useState({ text: "", type: "RATING" });
    const [saving, setSaving] = useState(false);

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

    const handleOpenModal = () => {
        setNovaPergunta({ text: "", type: "RATING" });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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

    return (
        <section className="p-6 sm:p-10 max-w-4xl mx-auto">
            {/* Header */}
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

            {/* Lista de perguntas */}
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
                                {/* Índice */}
                                <span className="w-8 h-8 rounded-full bg-maua-blue text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                                    {index + 1}
                                </span>
                                {/* Texto */}
                                <div className="min-w-0">
                                    <p className="text-gray-900 font-medium truncate">{p.text}</p>
                                </div>
                            </div>
                            {/* Badge tipo */}
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
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                            {/* Texto */}
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

                            {/* Tipo */}
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

                            {/* Botões */}
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
