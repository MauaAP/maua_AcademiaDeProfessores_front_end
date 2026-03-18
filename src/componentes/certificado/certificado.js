import React from "react";
import { IoIosPaper } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TemplateCertificado ({ certificadoId, eventId, evento, professor, data, showDelete=true }) {
    const notierror = (message) => toast.error(message);
    const notisucess = (message) => toast.success(message);
    
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Tem certeza que deseja deletar o certificado do evento "${evento}"?\n\nEsta ação não pode ser desfeita.`
        );
        
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/presence/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            notisucess("Certificado apagado!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Erro ao deletar certificado:", error);
            notierror("Erro ao deletar o certificado!");
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-certificate/${certificadoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const url = response.data.certificateUrl;
            window.open(url, '_blank');  // Abre a URL em uma nova guia
        } catch (error) {
            console.error("Erro ao fazer o download do certificado:", error);
            notierror("Erro ao fazer o download!");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
                {/* Header com ícone e data */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-maua-blue to-maua-light-blue rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <IoIosPaper className="text-white text-xl" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 break-words mb-1">
                                {evento}
                            </h3>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                            {data}
                        </span>
                    </div>
                </div>

                {/* Informações do professor */}
                <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Professor:</span>
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {professor}
                        </p>
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="mt-auto">
                    <div className="space-y-3">
                        <button 
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-green to-maua-green-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                        >
                            <IoIosDownload size={18} />
                            <span>Baixar Certificado</span>
                        </button>
                        {!showDelete && (
                            <a
                                href={`/avaliacao?eventId=${eventId || certificadoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>Avaliar Evento</span>
                            </a>
                        )}
                        {showDelete && (
                            <button 
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                <IoIosTrash size={18} />
                                <span>Deletar</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
