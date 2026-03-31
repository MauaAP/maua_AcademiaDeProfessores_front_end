import React, { useState } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import InputMask from "react-input-mask";

const competenciasCTr = [
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
];

const competenciasCTe = [
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

const modalidadeDisponiveis = ["Presencial", "Híbrido", "Remoto"];

const periodosDisponiveis = [
    "Início do ano - Semana de Planejamento e Capacitação Docente",
    "Semana de provas - 1° bimestre",
    "Semana de provas - 2° bimestre",
    "Início do 2° semestre",
    "Semana de provas - 3° bimestre",
    "Evento de final de ano",
    "Outro"
];

function SectionHeader({ number, title }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-maua-blue text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {number}
            </div>
            <h3 className="text-base font-semibold text-gray-800 whitespace-nowrap">{title}</h3>
            <div className="flex-1 h-px bg-gray-200" />
        </div>
    );
}

function ResponsibleInput({ formData, handleInputChange }) {
    const [manager, setManager] = useState(formData.manager.join(", "));
    const handleChange = (event) => {
        setManager(event.target.value);
        handleInputChange(event);
    };
    return (
        <input
            type="text"
            name="manager"
            value={manager}
            onChange={handleChange}
            placeholder="Nome do responsável"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
            required
        />
    );
}

function ContentActivitiesInput({ formData, handleInputChange }) {
    const [contentActivities, setContentActivities] = useState(formData.contentActivities.join(", "));
    const handleChange = (event) => {
        setContentActivities(event.target.value);
        handleInputChange(event);
    };
    return (
        <textarea
            name="contentActivities"
            value={contentActivities}
            onChange={handleChange}
            placeholder="Descreva as atividades planejadas para o evento"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none"
            required
        />
    );
}

export default function FormEvCad() {
    const [formData, setFormData] = useState({
        eventName: '',
        date: null,
        host: '',
        manager: [],
        hostEmail: [],
        hostPhone: [],
        local: '',
        modality: '',
        targetAudience: '',
        activityType: '',
        numberMaxParticipants: null,
        goals: '',
        period: '',
        contentActivities: [],
        developedCompetencies: '',
        initTime: null,
        finishTime: null,
        link: '',
        duration: 'não se aplica'
    });

    const [selectedCompetencies, setSelectedCompetencies] = useState([]);
    const [selectedModality, setSelectedModality] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [emailValido, setEmailValido] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [finishDate, setFinishDate] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (["hostEmail", "manager", "hostPhone", "contentActivities"].includes(name)) {
            setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (name === "hostEmail") setEmailValido(isValidEmail(value));
    };

    const handleCompetencyChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCompetencies(prev =>
            checked ? [...prev, value] : prev.filter(c => c !== value)
        );
    };

    const handleModalityChange = (value) => {
        setSelectedModality(value);
        setFormData({ ...formData, modality: value, link: '' });
    };

    const handlePeriodChange = (value) => {
        setSelectedPeriod(value);
        setFormData({ ...formData, period: value });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date ? new Date(date).getTime() : null });
    };

    const handleTimeChange = (time, field) => {
        const { date } = formData;
        if (date) {
            const updatedDateTime = new Date(date);
            updatedDateTime.setHours(time.getHours(), time.getMinutes());
            setFormData({ ...formData, [field]: updatedDateTime.getTime() });
        } else {
            setFormData({ ...formData, [field]: time ? time.getTime() : null });
        }
    };

    const handleFinishDateChange = (date) => {
        const ts = date ? new Date(date).getTime() : null;
        setFinishDate(ts);
        // preserva a hora já escolhida, só troca a data
        if (ts && formData.finishTime) {
            const prev = new Date(formData.finishTime);
            const next = new Date(ts);
            next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
            setFormData({ ...formData, finishTime: next.getTime() });
        } else {
            setFormData({ ...formData, finishTime: ts });
        }
    };

    const handleFinishTimeChange = (time) => {
        const base = finishDate ? new Date(finishDate) : new Date();
        base.setHours(time.getHours(), time.getMinutes(), 0, 0);
        setFormData({ ...formData, finishTime: base.getTime() });
    };

    const handlePhoneChange = (event) => {
        setFormData({ ...formData, hostPhone: [event.target.value] });
    };

    const handleMaxParticipantsChange = (event) => {
        const value = event.target.value;
        setFormData({ ...formData, numberMaxParticipants: value !== "" ? parseInt(value, 10) : null });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            ...formData,
            developedCompetencies: selectedCompetencies.join(', '),
            link: formData.link || 'Não se Aplica',
        };

        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-event",
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            if (response.status === 201) {
                toast.success("Evento cadastrado com sucesso!");
                clearForm();
            }
        } catch (error) {
            console.error("Erro ao cadastrar o evento:", error);
            toast.error("Houve um problema ao cadastrar o evento. Tente novamente!");
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setFormData({
            eventName: '',
            date: null,
            host: '',
            manager: [],
            hostEmail: [],
            hostPhone: [],
            local: '',
            modality: '',
            targetAudience: '',
            activityType: '',
            numberMaxParticipants: null,
            goals: '',
            period: '',
            contentActivities: [],
            developedCompetencies: '',
            initTime: null,
            finishTime: null,
            link: '',
            duration: 'não se aplica'
        });
        setSelectedCompetencies([]);
        setSelectedModality('');
        setSelectedPeriod('');
        setFinishDate(null);
    };

    const showLinkField = selectedModality === 'Remoto' || selectedModality === 'Híbrido';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-maua-blue to-maua-light-blue px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Cadastro de Evento</h2>
                        <p className="text-blue-100 mt-1">Preencha os dados do evento para cadastrá-lo no sistema</p>
                    </div>

                    <form className="p-8 space-y-10" onSubmit={handleSubmit}>

                        {/* ── SEÇÃO 1: Identificação ── */}
                        <section>
                            <SectionHeader number="1" title="Identificação do Evento" />
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Evento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="eventName"
                                        value={formData.eventName}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Semana de Capacitação Docente 2025"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                {/* Data/hora — dois blocos visuais lado a lado */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                                            Início
                                        </p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Data <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    selected={formData.date ? new Date(formData.date) : null}
                                                    onChange={(date) => handleDateChange(date, "date")}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="dd/mm/aaaa"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Hora <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    selected={formData.initTime ? new Date(formData.initTime) : null}
                                                    onChange={(time) => handleTimeChange(time, "initTime")}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Hora"
                                                    dateFormat="HH:mm"
                                                    placeholderText="00:00"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">
                                            Término
                                        </p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Data <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    selected={finishDate ? new Date(finishDate) : null}
                                                    onChange={handleFinishDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="dd/mm/aaaa"
                                                    minDate={formData.date ? new Date(formData.date) : null}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Hora <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    selected={formData.finishTime ? new Date(formData.finishTime) : null}
                                                    onChange={handleFinishTimeChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Hora"
                                                    dateFormat="HH:mm"
                                                    placeholderText="00:00"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-orange-400 mt-2">
                                            Pode ser em outro dia para eventos de múltiplos dias
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Local do Evento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="local"
                                        value={formData.local}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Auditório A, Bloco B, Sala 101"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ── SEÇÃO 2: Modalidade e Período ── */}
                        <section>
                            <SectionHeader number="2" title="Modalidade e Período" />
                            <div className="space-y-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Modalidade <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {modalidadeDisponiveis.map((mod) => (
                                            <button
                                                key={mod}
                                                type="button"
                                                onClick={() => handleModalityChange(mod)}
                                                className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                                                    selectedModality === mod
                                                        ? 'border-maua-blue bg-blue-50 text-maua-blue'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {mod}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {showLinkField && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Link da Reunião <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="https://meet.google.com/..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Período do Evento <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {periodosDisponiveis.map((period) => (
                                            <button
                                                key={period}
                                                type="button"
                                                onClick={() => handlePeriodChange(period)}
                                                className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                                    selectedPeriod === period
                                                        ? 'border-maua-blue bg-blue-50 text-maua-blue font-medium'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── SEÇÃO 3: Responsáveis ── */}
                        <section>
                            <SectionHeader number="3" title="Responsáveis" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Responsável <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-xs text-gray-400 mb-2">Quem coordena e organiza o evento</p>
                                        <ResponsibleInput formData={formData} handleInputChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Aplicador <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-xs text-gray-400 mb-2">Quem conduz e ministra o evento</p>
                                        <input
                                            type="text"
                                            name="host"
                                            value={formData.host}
                                            onChange={handleInputChange}
                                            placeholder="Nome do aplicador"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email do Aplicador <span className="text-red-500">*</span>
                                            {!emailValido && (
                                                <span className="text-red-500 text-xs ml-2">• Email inválido</span>
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            name="hostEmail"
                                            value={formData.hostEmail.join(", ")}
                                            onChange={handleInputChange}
                                            placeholder="email@maua.br"
                                            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                                                !emailValido
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-200 focus:border-maua-blue'
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefone do Aplicador <span className="text-red-500">*</span>
                                        </label>
                                        <InputMask
                                            mask="(99) 99999-9999"
                                            value={formData.hostPhone}
                                            onChange={handlePhoneChange}
                                            placeholder="(00) 00000-0000"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── SEÇÃO 4: Público e Atividade ── */}
                        <section>
                            <SectionHeader number="4" title="Público e Atividade" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Público-Alvo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="targetAudience"
                                            value={formData.targetAudience}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Professores de Engenharia"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Atividade <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="activityType"
                                            value={formData.activityType}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Workshop, Palestra, Treinamento"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nº Máximo de Participantes
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            name="numberMaxParticipants"
                                            value={formData.numberMaxParticipants ?? ''}
                                            onChange={handleMaxParticipantsChange}
                                            placeholder="Ex: 50"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Objetivos <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="goals"
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                        placeholder="Descreva os objetivos do evento"
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Atividades Planejadas <span className="text-red-500">*</span>
                                    </label>
                                    <ContentActivitiesInput formData={formData} handleInputChange={handleInputChange} />
                                </div>
                            </div>
                        </section>

                        {/* ── SEÇÃO 5: Competências ── */}
                        <section>
                            <SectionHeader number="5" title="Competências Desenvolvidas" />

                            {selectedCompetencies.length > 0 && (
                                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-maua-blue text-white text-xs font-bold flex items-center justify-center">
                                        {selectedCompetencies.length}
                                    </span>
                                    <p className="text-sm text-blue-700 font-medium">
                                        {selectedCompetencies.length === 1
                                            ? '1 competência selecionada'
                                            : `${selectedCompetencies.length} competências selecionadas`}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                        Transversais (CTr)
                                    </p>
                                    <div className="space-y-2">
                                        {competenciasCTr.map((competency, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedCompetencies.includes(competency)
                                                        ? 'border-maua-blue bg-blue-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={competency}
                                                    checked={selectedCompetencies.includes(competency)}
                                                    onChange={handleCompetencyChange}
                                                    className="mt-0.5 flex-shrink-0 text-maua-blue focus:ring-maua-blue"
                                                />
                                                <span className="text-sm text-gray-700">{competency}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                        Específicas (CTe)
                                    </p>
                                    <div className="space-y-2">
                                        {competenciasCTe.map((competency, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedCompetencies.includes(competency)
                                                        ? 'border-maua-green bg-green-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={competency}
                                                    checked={selectedCompetencies.includes(competency)}
                                                    onChange={handleCompetencyChange}
                                                    className="mt-0.5 flex-shrink-0 text-maua-blue focus:ring-maua-blue"
                                                />
                                                <span className="text-sm text-gray-700">{competency}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Submit ── */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-400">
                                <span className="text-red-500">*</span> Campos obrigatórios
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-maua-green to-maua-green-hover text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Cadastrar Evento
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
