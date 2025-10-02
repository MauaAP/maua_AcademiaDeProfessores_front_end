import React, { useState } from "react";
import { MdOutlineEvent } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import InputMask from "react-input-mask";
import QRCode from 'qrcode.react';


export default function TemplateEvento({ eventId, eventName, date, host, manager, period, hostEmail, hostPhone, local, modality, targetAudience, activityType, goals, contentActivities, developedCompetencies, initTime, finishTime, mostrarOpcoesEsp = true }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isQrCode, setQtCode] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('');

    const editedData = {
        eventId,
        eventName,
        date,
        host,
        manager,
        period,
        hostEmail,
        hostPhone,
        local,
        modality,
        targetAudience,
        activityType,
        goals,
        contentActivities,
        developedCompetencies,
        initTime,
        finishTime
    };

    const handleUpdate = () => {
        // implementar a requisição http
        console.log("Dados atualizados:", editedData);
        setTimeout(notiatualizar, 10); // Chama a função de notificação após um pequeno atraso
        setIsEditing(false);
    };

    const notideletar = () => toast.warning("Evento apagado!");
    const notierror = () => toast.error("Erro ao apagar evento. Tente novamente!");
    const notiatualizar = () => toast.success("Dados Atualizados!");

    const newAtt = () => {
        setIsEditing(true);
        toast.dismiss();
    }

    const linkValue = editedData.link ? editedData.link : "Não se aplica";

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Tem certeza que deseja deletar o evento "${eventName}"?\n\nEsta ação não pode ser desfeita e todos os dados relacionados ao evento serão perdidos.`
        );
        
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/delete-event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                console.log('Evento Apagado!', response.data);
                notideletar();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('Erro ao deletar evento:', error.message);
            notierror();
        }
    };

    const handleGerarQRCode = () => {
        const url = `https://main.d3ox2o8vvrjgn9.amplifyapp.com/certificacao?eventId=${eventId}`;
        setQrCodeValue(url);
        setQtCode(true)
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col">
                <div className="p-5 flex-1 flex flex-col">
                    {/* Header com ícone e modalidade */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-maua-blue to-maua-light-blue rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <MdOutlineEvent className="text-white text-xl" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 break-words mb-1">
                                    {eventName}
                                </h3>
                                <p className="text-gray-600 text-sm truncate">{local}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                {modality}
                            </span>
                        </div>
                    </div>

                    {/* Informações do evento */}
                    <div className="mb-6 space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data</p>
                            <p className="text-sm font-medium text-gray-900">{date}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Local</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{local}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Período</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{period}</p>
                        </div>
                    </div>

                    {/* Botões de ação */}
                    {mostrarOpcoesEsp && (
                        <div className="mt-auto">
                            <div className="space-y-3">
                                <button 
                                    onClick={handleGerarQRCode}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-light-blue to-maua-blue text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    <span>Gerar QR Code</span>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={newAtt}
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Detalhes</span>
                                        <span className="sm:hidden">Ver</span>
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="hidden sm:inline">Deletar</span>
                                        <span className="sm:hidden">Del</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

                {isEditing && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto relative z-40">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Evento</h2>
                                <p className="text-gray-600">Modifique as informações do evento conforme necessário</p>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{eventName}</label>
                                        <input type="text" name="eventName" placeholder="Nome do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{date}</label>
                                        <InputMask mask='99/99/9999' placeholder="Data do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{local}</label>
                                        <input type="text" name="local" placeholder="Local do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{modality}</label>
                                        <input type="text" name="modality" placeholder="Modalidade" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{hostPhone}</label>
                                        <InputMask mask="(99) 99999-9999" placeholder="Telefone do Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{manager.join(", ")}</label>
                                        <input type="text" name="manager" placeholder="Responsável" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{period}</label>
                                        <input type="text" name="period" placeholder="Período" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{host}</label>
                                        <input type="text" name="host" placeholder="Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{hostEmail.join(", ")}</label>
                                        <input type="text" name="hostEmail" placeholder="Email do Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{targetAudience}</label>
                                        <textarea name="targetAudience" placeholder="Público Alvo" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{activityType}</label>
                                        <input type="text" name="activityType" placeholder="Tipo de Atividade" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{contentActivities.join(", ")}</label>
                                        <input type="text" name="contentAtt" placeholder="Atividades Planejadas" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{goals}</label>
                                        <textarea name="goals" placeholder="Objetivos" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{developedCompetencies}</label>
                                        <textarea name="developedCompetencies" placeholder="Competências Desenvolvidas" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{initTime}</label>
                                        <InputMask mask='99:99' placeholder="Horário de Início" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{finishTime}</label>
                                        <InputMask mask='99:99' placeholder="Horário de Término" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{linkValue}</label>
                                        <input type="text" name="link" placeholder="Link do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                    </div>
                                    
                                    <div className="pt-4 space-y-3">
                                        <button className="w-full px-6 py-3 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95" onClick={handleUpdate}>
                                            Atualizar
                                        </button>
                                        <button className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg" onClick={() => setIsEditing(false)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isQrCode && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4/5 max-h-4/5 flex flex-col justify-center items-center relative z-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{eventName}</h2>
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <QRCode size={400} value={qrCodeValue} />
                            </div>
                            <button 
                                className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg" 
                                onClick={() => setQtCode(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
        </>
    );
}
