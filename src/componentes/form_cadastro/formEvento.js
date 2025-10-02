import React, { useState } from "react";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import InputMask from "react-input-mask";

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

const modalidadeDisponiveis = [
    "Presencial",
    "Híbrido",
    "Remoto"
];

const periodosDisponiveis = [
    "Início do ano - Semana de Planejamento e Capacitação Docente",
    "Semana de provas - 1° bimestre",
    "Semana de provas - 2° bimestre",
    "Início do 2° semestre",
    "Semana de provas - 3° bimestre",
    "Evento de final de ano",
    "Outro"
];

function ResponsibleInput({ formData, handleInputChange }) {
    const [manager, setManager] = useState(formData.manager.join(", "));
  
    const handleChange = (event) => {
      const value = event.target.value;
      setManager(value);
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
      const value = event.target.value;
      setContentActivities(value);
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

    const notifySuccess = () => toast.success("Evento Cadastrado com sucesso!");
    const notifyError1 = () => toast.error("Houve um problema ao cadastrar o evento!");
    const notifyError = () => toast.error("Por favor, preencha todos os campos!");

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "hostEmail" || name === "manager" || name === "hostPhone" || name === "contentActivities") {
            setFormData({
                ...formData,
                [name]: value.split(',').map(item => item.trim())
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        if (name === "hostEmail") {
            setEmailValido(isValidEmail(value));
        }
    };

    const handleCompetencyChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCompetencies((prevSelected) => {
            if (checked) {
                return [...prevSelected, value];
            } else {
                return prevSelected.filter((competency) => competency !== value);
            }
        });
    };

    const handleModalityChange = (event) => {
        const { value } = event.target;
        setSelectedModality(value);
        setFormData({
            ...formData,
            modality: value
        });
    };

    const handlePeriodChange = (event) => {
        const { value } = event.target;
        setSelectedPeriod(value);
        setFormData({
            ...formData,
            period: value
        });
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleDateChange = (date, field) => {
        setFormData({
            ...formData,
            [field]: date ? new Date(date).getTime() : null
        });
    };

    const handleTimeChange = (time, field) => {
        const { date } = formData;
        if (date) {
            const updatedDateTime = new Date(date);
            updatedDateTime.setHours(time.getHours(), time.getMinutes());
            setFormData({
                ...formData,
                [field]: updatedDateTime.getTime()
            });
        } else {
            setFormData({
                ...formData,
                [field]: time ? time.getTime() : null
            });
        }
    };

    const handlePhoneChange = (event) => {
        setFormData({
            ...formData,
            hostPhone: [event.target.value]
        });
    };

    const handleMaxParticipantsChange = (event) => {
        const { value } = event.target;
    
        const parsedValue = value !== "" ? parseInt(value, 10) : "";
    
        setFormData({
            ...formData,
            numberMaxParticipants: parsedValue
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        formData.developedCompetencies = selectedCompetencies.join(', ');
        console.log(formData)
        const allFieldsFilled = Object.values(formData).every(value => value !== '' && value !== null && value !== '');
        
        if (formData.link === '') {
            formData.link = 'Não se Aplica';
        } else if (allFieldsFilled) {
            
            try {
                const response = await axios.post("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-event", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.status === 201) {
                    notifySuccess();
                    console.log("Evento Cadastrado com sucesso:", response.data);
                    clearForm();
                }
            } catch (error) {
                console.error("Erro ao cadastrar o evento:", error);
                console.log(formData);
                notifyError1();
            }
        } else {
            console.log(formData);
            notifyError();
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
            link: ''
        });
        setSelectedCompetencies([]);
        setSelectedModality('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-maua-blue to-maua-light-blue px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Cadastro de Evento</h2>
                        <p className="text-blue-100 mt-2">Preencha os dados do evento para cadastrá-lo no sistema</p>
                    </div>
                    
                    <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                        {/* Informações Básicas */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Informações Básicas</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Evento *</label>
                                <input 
                                    type="text" 
                                    name="eventName" 
                                    value={formData.eventName} 
                                    onChange={handleInputChange} 
                                    placeholder="Digite o nome do evento" 
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data do Evento *</label>
                                    <DatePicker
                                        selected={formData.date ? new Date(formData.date) : null}
                                        onChange={(date) => handleDateChange(date, "date")}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecione a data"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Início *</label>
                                    <DatePicker
                                        selected={formData.initTime ? new Date(formData.initTime) : null}
                                        onChange={(time) => handleTimeChange(time, "initTime")}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Hora"
                                        dateFormat="HH:mm"
                                        placeholderText="00:00"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Término *</label>
                                    <DatePicker
                                        selected={formData.finishTime ? new Date(formData.finishTime) : null}
                                        onChange={(time) => handleTimeChange(time, "finishTime")}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Hora"
                                        dateFormat="HH:mm"
                                        placeholderText="00:00"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Período e Organização */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Período e Organização</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Período do Evento *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {periodosDisponiveis.map((period, index) => (
                                        <label key={index} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-maua-blue cursor-pointer transition-colors">
                                            <input 
                                                type="radio" 
                                                name="period"
                                                value={period} 
                                                checked={selectedPeriod === period}
                                                onChange={handlePeriodChange}
                                                className="mr-3 text-maua-blue focus:ring-maua-blue"
                                            />
                                            <span className="text-sm text-gray-700">{period}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Responsável *</label>
                                    <ResponsibleInput formData={formData} handleInputChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Aplicador *</label>
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email do Aplicador *
                                        {!emailValido && <span className="text-red-500 text-xs ml-2">• Email inválido</span>}
                                    </label>
                                    <input 
                                        type="email" 
                                        name="hostEmail" 
                                        value={formData.hostEmail.join(", ")} 
                                        onChange={handleInputChange} 
                                        placeholder="email@exemplo.com" 
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
                                            !emailValido ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-maua-blue'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone do Aplicador *</label>
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
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Local do Evento *</label>
                                <input 
                                    type="text" 
                                    name="local" 
                                    value={formData.local} 
                                    onChange={handleInputChange} 
                                    placeholder="Local onde será realizado o evento" 
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Modalidade e Público-Alvo */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Modalidade e Público-Alvo</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Modalidade *</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {modalidadeDisponiveis.map((modality, index) => (
                                        <label key={index} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-maua-blue cursor-pointer transition-colors">
                                            <input 
                                                type="radio" 
                                                name="modality"
                                                value={modality} 
                                                checked={selectedModality === modality}
                                                onChange={handleModalityChange} 
                                                className="mr-3 text-maua-blue focus:ring-maua-blue"
                                                required
                                            />
                                            <span className="text-sm text-gray-700">{modality}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Público-Alvo *</label>
                            <input 
                                type="text" 
                                name="targetAudience" 
                                value={formData.targetAudience} 
                                onChange={handleInputChange} 
                                placeholder="Ex: Comunidade IMT, Professores de Engenharia"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Atividade *</label>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número Máximo de Participantes *</label>
                            <input 
                                type="number" 
                                min="0" 
                                name="numberMaxParticipants" 
                                value={formData.numberMaxParticipants} 
                                onChange={handleMaxParticipantsChange} 
                                placeholder="Ex: 50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Detalhes do Evento */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Detalhes do Evento</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Atividades Planejadas *</label>
                            <ContentActivitiesInput formData={formData} handleInputChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Competências Desenvolvidas *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 rounded-lg border border-gray-200 bg-gray-50">
                                {competenciasDisponiveis.map((competency, index) => (
                                    <label key={index} className="flex items-center text-sm text-gray-700">
                                        <input 
                                            type="checkbox" 
                                            value={competency} 
                                            checked={selectedCompetencies.includes(competency)}
                                            onChange={handleCompetencyChange} 
                                            className="mr-2 text-maua-blue focus:ring-maua-blue"
                                        />
                                        {competency}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link da Reunião (se for remoto)</label>
                            <input 
                                type="text" 
                                name="link" 
                                value={formData.link} 
                                onChange={handleInputChange} 
                                placeholder="https://meet.google.com/..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                        {/* Botão de Submit */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button 
                                type="submit"
                                className="bg-gradient-to-r from-maua-green to-maua-green-hover text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Cadastrar Evento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
