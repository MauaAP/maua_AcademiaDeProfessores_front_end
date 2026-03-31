import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

const API_BASE = "https://6mv3jcpmik.us-east-1.awsapprunner.com";

function RatingInput({ pergunta, value, onChange }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{pergunta.text}</p>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(pergunta.id, star)}
                        className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                        {star <= (value || 0)
                            ? <FaStar className="text-maua-orange" />
                            : <FaRegStar className="text-gray-300" />
                        }
                    </button>
                ))}
                {value > 0 && (
                    <span className="ml-2 text-sm text-gray-500 self-center">{value}/5</span>
                )}
            </div>
        </div>
    );
}

function TextInput({ pergunta, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {pergunta.text}
            </label>
            <textarea
                rows={3}
                value={value || ""}
                onChange={(e) => onChange(pergunta.id, e.target.value)}
                placeholder="Digite sua resposta..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none"
            />
        </div>
    );
}

export default function FormAvaliacao({ eventId }) {
    const navegacao = useNavigate();
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [externalEmail, setExternalEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");
    const isInterno = !!token;

    useEffect(() => {
        const fetchPerguntas = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/evaluations/event/${eventId}/questions`);
                setPerguntas(response.data.questions || []);
            } catch (error) {
                console.error("Erro ao buscar perguntas:", error);
                toast.error("Erro ao carregar as perguntas de avaliação.");
            } finally {
                setLoading(false);
            }
        };

        fetchPerguntas();
    }, [eventId]);

    const handleResposta = (questionId, value) => {
        setRespostas((prev) => ({ ...prev, [questionId]: value }));
    };

    const buildAnswers = () => {
        return perguntas.map((p) => {
            if (p.type === "RATING") {
                return { questionId: p.id, rating: respostas[p.id] || 0 };
            } else {
                return { questionId: p.id, textAnswer: respostas[p.id] || "" };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação de respostas obrigatórias
        for (const p of perguntas) {
            if (p.type === "RATING" && (!respostas[p.id] || respostas[p.id] === 0)) {
                toast.error(`Por favor, dê uma nota para: "${p.text}"`);
                return;
            }
            if (p.type === "TEXT" && (!respostas[p.id] || respostas[p.id].trim() === "")) {
                toast.error(`Por favor, responda: "${p.text}"`);
                return;
            }
        }

        if (!isInterno && !externalEmail.trim()) {
            toast.error("Por favor, informe seu e-mail para continuar.");
            return;
        }

        const body = { answers: buildAnswers() };
        if (!isInterno) body.externalEmail = externalEmail.trim();

        const headers = isInterno
            ? { Authorization: `Bearer ${token}` }
            : {};

        try {
            setSubmitting(true);
            await axios.post(`${API_BASE}/api/evaluations/event/${eventId}`, body, { headers });
            toast.success("Avaliação enviada com sucesso!");
            setTimeout(() => navegacao("/end"), 1000);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            const status = error.response?.status;
            if (status === 409) {
                toast.error("Você já avaliou este evento.");
            } else if (status === 403) {
                toast.error(error.response?.data?.message || "Acesso negado: verifique se o evento já foi finalizado e se você tem presença confirmada.");
            } else {
                toast.error("Erro ao enviar avaliação. Tente novamente.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-maua-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perguntas...</p>
                </div>
            </div>
        );
    }

    if (perguntas.length === 0) {
        return (
            <div className="text-center p-12">
                <p className="text-gray-500">Nenhuma pergunta de avaliação disponível no momento.</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                {/* Identificação de usuário externo */}
                {!isInterno && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-blue-800 mb-3">
                            Informe seu e-mail para identificação:
                        </p>
                        <input
                            type="email"
                            value={externalEmail}
                            onChange={(e) => setExternalEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-maua-blue focus:outline-none transition-colors"
                        />
                    </div>
                )}

                {/* Perguntas */}
                <div className="space-y-6">
                    {perguntas.map((pergunta, index) => (
                        <div
                            key={pergunta.id}
                            className="bg-white rounded-xl border-2 border-gray-100 p-4 shadow-sm"
                        >
                            <span className="text-xs font-semibold text-maua-blue uppercase tracking-wide mb-2 block">
                                Pergunta {index + 1}
                            </span>
                            {pergunta.type === "RATING" ? (
                                <RatingInput
                                    pergunta={pergunta}
                                    value={respostas[pergunta.id]}
                                    onChange={handleResposta}
                                />
                            ) : (
                                <TextInput
                                    pergunta={pergunta}
                                    value={respostas[pergunta.id]}
                                    onChange={handleResposta}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Botão de envio */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-green to-maua-green-hover text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {submitting
                        ? <><AiOutlineLoading className="animate-spin" size={20} /><span>Enviando...</span></>
                        : "Enviar Avaliação"
                    }
                </button>
            </form>
        </div>
    );
}
