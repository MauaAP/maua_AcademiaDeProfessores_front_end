import React, { useState } from "react";
import { FaStar, FaRegStar, FaUser, FaEnvelope, FaSearch } from "react-icons/fa";

function StarDisplay({ value }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                star <= value
                    ? <FaStar key={star} className="text-maua-orange text-sm" />
                    : <FaRegStar key={star} className="text-gray-300 text-sm" />
            ))}
            <span className="ml-1 text-xs text-gray-500 self-center">{value}/5</span>
        </div>
    );
}

function CardAvaliacao({ avaliacao }) {
    const nomeExibido = avaliacao.userName || "Participante Externo";
    const emailExibido = avaliacao.userEmail || avaliacao.externalEmail || "—";
    const isExterno = !avaliacao.userName;
    const dataFormatada = new Date(avaliacao.createdAt).toLocaleString("pt-BR");

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden p-5">
            {/* Header do card */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-maua-blue to-maua-light-blue rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{nomeExibido}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <FaEnvelope className="text-gray-400 text-xs" />
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{emailExibido}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {isExterno && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Externo
                        </span>
                    )}
                    <span className="text-xs text-gray-400">{dataFormatada}</span>
                </div>
            </div>

            {/* Respostas */}
            <div className="space-y-3">
                {avaliacao.answers.map((answer, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {answer.questionText}
                        </p>
                        {answer.questionType === "RATING" ? (
                            <StarDisplay value={answer.rating} />
                        ) : (
                            <p className="text-sm text-gray-800 leading-relaxed">
                                {answer.textAnswer || <span className="italic text-gray-400">Sem resposta</span>}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ListaAvaliacoes({ avaliacoesData = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = avaliacoesData.filter((av) => {
        const nome = (av.userName || "").toLowerCase();
        const email = (av.userEmail || av.externalEmail || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return nome.includes(term) || email.includes(term);
    });

    return (
        <div className="min-h-[400px]">
            {/* Busca */}
            <div className="relative mb-6">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou e-mail do avaliador..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                />
            </div>

            {/* Contador */}
            <p className="text-sm text-gray-500 mb-4">
                {filtered.length} avaliação{filtered.length !== 1 ? "ões" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Grid de cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaStar className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? "Nenhuma avaliação encontrada" : "Nenhuma avaliação registrada"}
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm ? "Tente ajustar os filtros de busca." : "Este evento ainda não foi avaliado."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((av) => (
                        <div key={av.id} className="animate-fadeIn">
                            <CardAvaliacao avaliacao={av} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
