import React, { useState } from "react";
import { MdOutlineEvent } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import InputMask from "react-input-mask";
import QRCode from 'qrcode.react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function TemplateEvento({ eventId, eventName, date, host, manager, period, hostEmail, hostPhone, local, modality, targetAudience, activityType, goals, contentActivities, developedCompetencies, initTime, finishTime, mostrarOpcoesEsp = true }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isQrCode, setQtCode] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('');
    const competenciasDisponiveis = [
        "CTr 1 - Senso Crítico (Seja Crítico)",
        "CTr 2 - Seleção de Informações (Seja Seletivo)",
        "CTr 3 - Saber enfrentar desafios",
        "CTr 4 - Proatividade (Iniciativa)",
        "CTr 5 - Criar/Inovar",
        "CTr 6 - Organização/Planejamento",
        "CTr 7 - Relacionamento Interpessoal",
        "CTr 8 - Habilidade de lidar com o imprevisto/Trabalhar em ambientes incertos",
        "CTr 9 - Habilidade de resolver problemas",
        "CTr 10 - Tomar decisões",
        "CTe 1 - Formular e conceber soluções desejáveis e inovadoras na sua área",
        "CTe 2 - Analisar e compreender os fenômenos, eventos e modelos de sua área com base nas ciências que a fundamentam",
        "CTe 3 - Conceber criativamente, projetar e analisar sistemas, produtos (bens e serviços) componentes ou processos, viáveis técnica e economicamente",
        "CTe 4 - Implantar, supervisionar e controlar as soluções de sua área",
        "CTe 5 - Comunicar-se eficazmente nas formas escrita, oral e gráfica",
        "CTe 6 - Trabalhar e liderar equipes multidisciplinares",
        "CTe 7 - Conhecer e aplicar com ética a legislação e os atos normativos no âmbito do exercício da profissão",
        "CTe 8 - Aprender de forma autônoma e lidar com situações e contextos novos e/ou complexos",
        "CTe 9 - Compreender o potencial das tecnologias e aplicá-las na resolução de problemas e aproveitamento de oportunidades",
        "CTe 10 - Conhecer o setor produtivo de sua especialização, revelando sólida visão setorial, relacionado ao mercado, materiais, processos produtivos e tecnologias"
    ];
    const [editForm, setEditForm] = useState({
        eventName: '',
        date: '',
        local: '',
        modality: '',
        host: '',
        hostEmail: '',
        hostPhone: '',
        manager: '',
        period: '',
        targetAudience: '',
        activityType: '',
        goals: '',
        contentActivities: '',
        developedCompetencies: '',
        initTime: '',
        finishTime: '',
        link: ''
    });
    const [selectedCompetencies, setSelectedCompetencies] = useState([]);

    const handleUpdate = async () => {
        try {
            const toArray = (val) =>
                val.split(',').map(s => s.trim()).filter(Boolean);

            await axios.put(
                `https://6mv3jcpmik.us-east-1.awsapprunner.com/api/update-event/${eventId}`,
                {
                    ...editForm,
                    manager: toArray(editForm.manager),
                    hostEmail: toArray(editForm.hostEmail),
                    hostPhone: toArray(editForm.hostPhone),
                    contentActivities: toArray(editForm.contentActivities),
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            notiatualizar();
            setIsEditing(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            const status = error.response?.status;
            if (status === 403) {
                toast.error('Sem permissão para atualizar este evento.');
            } else if (status === 404) {
                toast.error('Evento não encontrado.');
            } else {
                toast.error('Erro ao atualizar evento. Tente novamente!');
            }
        }
    };

    const notideletar = () => toast.warning("Evento apagado!");
    const notierror = () => toast.error("Erro ao apagar evento. Tente novamente!");
    const notiatualizar = () => toast.success("Dados Atualizados!");

    const extractHHMM = (timeStr) => {
        if (!timeStr) return '';
        // "DD/MM/YYYY, HH:MM:SS" → "HH:MM"
        if (timeStr.includes(', ')) return timeStr.split(', ')[1].slice(0, 5);
        // ISO "2025-10-29T10:00:00.000Z" → "HH:MM"
        if (timeStr.includes('T')) return timeStr.split('T')[1].slice(0, 5);
        // já "HH:MM" ou "HH:MM:SS"
        return timeStr.slice(0, 5);
    };

    // Parseia "DD/MM/YYYY" → timestamp meia-noite local
    const parseBRDate = (str) => {
        if (!str) return null;
        const datePart = str.includes(', ') ? str.split(', ')[0] : str;
        const [day, month, year] = datePart.split('/').map(Number);
        if (!day || !month || !year) return null;
        return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
    };

    // Parseia "DD/MM/YYYY, HH:MM:SS" → timestamp com hora local
    const parseBRDateTime = (str) => {
        if (!str) return null;
        if (str.includes(', ')) {
            const [datePart, timePart] = str.split(', ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
            if (!day || !month || !year) return null;
            return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
        }
        // fallback: ISO string ou timestamp numérico
        const ts = typeof str === 'number' ? str : Date.parse(str);
        return isNaN(ts) ? null : ts;
    };

    const newAtt = () => {
        setEditForm({
            eventName: eventName || '',
            date: parseBRDate(date),
            local: local || '',
            modality: modality || '',
            host: host || '',
            hostEmail: Array.isArray(hostEmail) ? hostEmail.join(", ") : (hostEmail || ''),
            hostPhone: Array.isArray(hostPhone) ? hostPhone.join(", ") : (hostPhone || ''),
            manager: Array.isArray(manager) ? manager.join(", ") : (manager || ''),
            period: period || '',
            targetAudience: targetAudience || '',
            activityType: activityType || '',
            goals: goals || '',
            contentActivities: Array.isArray(contentActivities) ? contentActivities.join(", ") : (contentActivities || ''),
            developedCompetencies: developedCompetencies || '',
            initTime: parseBRDateTime(initTime),
            finishTime: parseBRDateTime(finishTime),
            link: ''
        });
        const initialComp = (developedCompetencies || '').split(',').map(c => c.trim()).filter(Boolean);
        setSelectedCompetencies(initialComp);
        setIsEditing(true);
        toast.dismiss();
    }

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    }

    const handleEditDateChange = (d) => {
        setEditForm(prev => ({ ...prev, date: d ? new Date(d).getTime() : null }));
    };

    const handleEditInitTimeChange = (time) => {
        const base = editForm.date ? new Date(editForm.date) : new Date();
        base.setHours(time.getHours(), time.getMinutes(), 0, 0);
        setEditForm(prev => ({ ...prev, initTime: base.getTime() }));
    };

    const handleEditFinishDateChange = (d) => {
        if (!d) { setEditForm(prev => ({ ...prev, finishTime: null })); return; }
        const next = new Date(d);
        if (editForm.finishTime) {
            const prev = new Date(editForm.finishTime);
            next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
        } else {
            next.setHours(0, 0, 0, 0);
        }
        setEditForm(prev => ({ ...prev, finishTime: next.getTime() }));
    };

    const handleEditFinishTimeChange = (time) => {
        const base = editForm.finishTime
            ? new Date(editForm.finishTime)
            : editForm.date ? new Date(editForm.date) : new Date();
        base.setHours(time.getHours(), time.getMinutes(), 0, 0);
        setEditForm(prev => ({ ...prev, finishTime: base.getTime() }));
    };

    const handleCompetencyChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCompetencies(prev => {
            const updated = checked ? [...prev, value] : prev.filter(c => c !== value);
            setEditForm(f => ({ ...f, developedCompetencies: updated.join(', ') }));
            return updated;
        });
    };

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

    const handleGerarQRCodeAvaliacao = () => {
        const url = `https://main.d3ox2o8vvrjgn9.amplifyapp.com/avaliacao?eventId=${eventId}`;
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
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={handleGerarQRCode}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-light-blue to-maua-blue text-white px-2 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 text-xs sm:text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <span className="hidden sm:inline">QR Code Presença</span>
                                        <span className="sm:hidden">Presença</span>
                                    </button>
                                    <button 
                                        onClick={handleGerarQRCodeAvaliacao}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-green to-maua-green-hover text-white px-2 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 text-xs sm:text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span className="hidden sm:inline">QR Code Avaliação</span>
                                        <span className="sm:hidden">Avaliação</span>
                                    </button>
                                </div>
                                <a
                                    href={`/avaliacoes?eventId=${eventId}`}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span>Ver Avaliações</span>
                                </a>
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
                        <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto relative z-40">

                            {/* Header */}
                            <div className="bg-gradient-to-r from-maua-blue to-maua-light-blue px-8 py-5 rounded-t-2xl">
                                <h2 className="text-2xl font-bold text-white">Editar Evento</h2>
                                <p className="text-blue-100 mt-1 text-sm">Ajuste as informações do evento</p>
                            </div>

                            <div className="p-8 space-y-6">

                                {/* Nome do evento — largura total */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Evento</label>
                                    <input type="text" name="eventName" value={editForm.eventName} onChange={handleFieldChange} placeholder="Nome do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                </div>

                                {/* Datas e horários — 4 colunas */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                        <span className="flex-1 h-px bg-gray-200" />
                                        Datas e Horários
                                        <span className="flex-1 h-px bg-gray-200" />
                                    </p>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                                            <DatePicker
                                                selected={editForm.date ? new Date(editForm.date) : null}
                                                onChange={handleEditDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/aaaa"
                                                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Início</label>
                                            <DatePicker
                                                selected={editForm.initTime ? new Date(editForm.initTime) : null}
                                                onChange={handleEditInitTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Hora"
                                                dateFormat="HH:mm"
                                                placeholderText="00:00"
                                                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Término</label>
                                            <DatePicker
                                                selected={editForm.finishTime ? new Date(new Date(editForm.finishTime).setHours(0,0,0,0)) : null}
                                                onChange={handleEditFinishDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/aaaa"
                                                minDate={editForm.date ? new Date(editForm.date) : null}
                                                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Término</label>
                                            <DatePicker
                                                selected={editForm.finishTime ? new Date(editForm.finishTime) : null}
                                                onChange={handleEditFinishTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Hora"
                                                dateFormat="HH:mm"
                                                placeholderText="00:00"
                                                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Campos principais — 3 colunas */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                    {/* Col 1 — Identificação */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                                            <input type="text" name="local" value={editForm.local} onChange={handleFieldChange} placeholder="Local do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label>
                                            <input type="text" name="modality" value={editForm.modality} onChange={handleFieldChange} placeholder="Modalidade" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                                            <input type="text" name="period" value={editForm.period} onChange={handleFieldChange} placeholder="Período" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Público Alvo</label>
                                            <textarea name="targetAudience" value={editForm.targetAudience} onChange={handleFieldChange} placeholder="Público Alvo" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Atividade</label>
                                            <input type="text" name="activityType" value={editForm.activityType} onChange={handleFieldChange} placeholder="Tipo de Atividade" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                    </div>

                                    {/* Col 2 — Responsáveis */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                            <input type="text" name="manager" value={editForm.manager} onChange={handleFieldChange} placeholder="Responsável" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Aplicador</label>
                                            <input type="text" name="host" value={editForm.host} onChange={handleFieldChange} placeholder="Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email do Aplicador</label>
                                            <input type="text" name="hostEmail" value={editForm.hostEmail} onChange={handleFieldChange} placeholder="Email do Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone do Aplicador</label>
                                            <InputMask mask="(99) 99999-9999" name="hostPhone" value={editForm.hostPhone} onChange={handleFieldChange} placeholder="Telefone do Aplicador" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Link do Evento</label>
                                            <input type="text" name="link" value={editForm.link} onChange={handleFieldChange} placeholder="Link do Evento" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors" />
                                        </div>
                                    </div>

                                    {/* Col 3 — Conteúdo */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
                                            <textarea name="goals" value={editForm.goals} onChange={handleFieldChange} placeholder="Objetivos" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Atividades Planejadas</label>
                                            <textarea name="contentActivities" value={editForm.contentActivities} onChange={handleFieldChange} placeholder="Atividades Planejadas" rows="3" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Competências — largura total */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Competências Desenvolvidas</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 rounded-xl border-2 border-gray-200 bg-gray-50">
                                        {competenciasDisponiveis.map((competency, index) => (
                                            <label key={index} className="flex items-center gap-2 text-sm text-gray-700 p-1 rounded hover:bg-white cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={competency}
                                                    checked={selectedCompetencies.includes(competency)}
                                                    onChange={handleCompetencyChange}
                                                    className="text-maua-blue focus:ring-maua-blue flex-shrink-0"
                                                />
                                                {competency}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Botões — rodapé */}
                                <div className="flex gap-3 pt-2 border-t border-gray-100">
                                    <button
                                        className="flex-1 px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
                                        onClick={handleUpdate}
                                    >
                                        Salvar Alterações
                                    </button>
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
