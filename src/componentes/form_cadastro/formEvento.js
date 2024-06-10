import React, { useState } from "react";
import './formCadastro.css';
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
      <>
        <input
          type="text"
          name="manager"
          value={manager}
          onChange={handleChange}
          placeholder="Responsável"
        />
      </>
    );
  }

// Adicionar essa função posteriormente para permitir multiplos emails, mas é necessário retirar a verificação de email para funcionar corretamente :D
//   function HostEmailInput({ formData, handleInputChange, emailValido }) {
//     const [hostEmail, setHostEmail] = useState(formData.hostEmail.join(", "));
  
//     const handleChange = (event) => {
//       const value = event.target.value;
//       setHostEmail(value);
//       handleInputChange(event);
//     };
  
//     return (
//       <>
//         <input
//           type="text"
//           name="hostEmail"
//           value={hostEmail}
//           onChange={handleChange}
//           placeholder="Email do Aplicador"
//         />
//       </>
//     );
//   }
  
  function ContentActivitiesInput({ formData, handleInputChange }) {
    const [contentActivities, setContentActivities] = useState(formData.contentActivities.join(", "));
  
    const handleChange = (event) => {
      const value = event.target.value;
      setContentActivities(value);
      handleInputChange(event);
    };
  
    return (
      <>
        <input
          type="text"
          name="contentActivities"
          value={contentActivities}
          onChange={handleChange}
          placeholder="Atividades Planejadas"
        />
      </>
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
            [field]: date
        });
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
                const response = await axios.post("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/create-event", formData, {
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
        <body>
            <div className="corpo-cad">
                <form className="corpo-cad" onSubmit={handleSubmit}>
                    <h3>Cadastro de Evento</h3>
                    
                    <div className="info">
                        <label>Nome do Evento:</label>
                        <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} placeholder="Nome do Evento" />
                        
                        <div className="senhas">
                            <div className="info">
                                <label>Data do Evento:</label>
                                <DatePicker
                                    selected={formData.date}
                                    onChange={(date) => handleDateChange(date, "date")}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Data do Evento"
                                />
                            </div>
                            <div className="info">
                                <label>Horário de Início:</label>
                                <DatePicker
                                    selected={formData.initTime}
                                    onChange={(date) => handleDateChange(date, "initTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Hora"
                                    dateFormat="HH:mm"
                                    placeholderText="Horário de Início"
                                />
                            </div>
                            <div className="info">
                                <label>Horário de Término:</label>
                                <DatePicker
                                    selected={formData.finishTime}
                                    onChange={(date) => handleDateChange(date, "finishTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Hora"
                                    dateFormat="HH:mm"
                                    placeholderText="Horário de Término"
                                />
                            </div>
                        </div>

                        <label>Período:</label>
                        <div className="escolhas">
                            {periodosDisponiveis.map((period, index) => (
                                <div key={index}>
                                    <input 
                                        type="checkbox" 
                                        name="modality"
                                        value={period} 
                                        checked={selectedPeriod === period}
                                        onChange={handlePeriodChange} 
                                    />
                                    {period}
                                </div>
                            ))}
                        </div>
                    
                        <label>Responsável:</label>
                        <ResponsibleInput formData={formData} handleInputChange={handleInputChange} />

                        <label>Aplicador:</label>
                        <input type="text" name="host" value={formData.host} onChange={handleInputChange} placeholder="Aplicador" />     

                        <label>Email do Aplicador: {!emailValido && <span style={{ color: 'red', fontSize: '8'}}>Email inválido</span>}</label>
                        <input type="text" name="hostEmail" value={formData.hostEmail.join(", ")} onChange={handleInputChange} placeholder="Email do Aplicador" />

                        <label>Telefone do Aplicador: </label>
                        <InputMask mask="(99) 99999-9999" value={formData.hostPhone} onChange={handlePhoneChange} placeholder="Telefone do Aplicador"/>

                        <label>Local do Evento:</label>
                        <input type="text" name="local" value={formData.local} onChange={handleInputChange} placeholder="Local do Evento" />

                        <label>Modalidade:</label>
                        <div className="escolhas">
                            {modalidadeDisponiveis.map((modality, index) => (
                                <div key={index}>
                                    <input 
                                        type="checkbox" 
                                        name="modality"
                                        value={modality} 
                                        checked={selectedModality === modality}
                                        onChange={handleModalityChange} 
                                    />
                                    {modality}
                                </div>
                            ))}
                        </div>

                        <label>Público-Alvo:</label>
                        <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Público-Alvo, exemplo: 'Comunidade IMT'" />

                        <label>Tipo de Atividade:</label>
                        <input type="text" name="activityType" value={formData.activityType} onChange={handleInputChange} placeholder="Tipo de Atividade" />

                        <label>Número Máximo de Participantes:</label>
                        <input type="number" min="0" name="numberMaxParticipants" value={formData.numberMaxParticipants} onChange={handleMaxParticipantsChange} placeholder="Número Máximo de Participantes" />

                        <label>Objetivos:</label>
                        <input type="text" name="goals" value={formData.goals} onChange={handleInputChange} placeholder="Objetivos" />

                        <label>Atividades Planejadas:</label>
                        <ContentActivitiesInput formData={formData} handleInputChange={handleInputChange} />

                        <label>Competências Desenvolvidas:</label>
                        <div className="escolhas">
                            {competenciasDisponiveis.map((competency, index) => (
                                <div key={index}>
                                    <input 
                                        type="checkbox" 
                                        value={competency} 
                                        checked={selectedCompetencies.includes(competency)}
                                        onChange={handleCompetencyChange} 
                                    />
                                    {competency}
                                </div>
                            ))}
                        </div>

                        <label>Link da Reunião (se for remoto):</label>
                        <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="Link da Reunião (se for remoto)" />
                    </div>
                    <button className="bnt-cadastrar" type="submit">Cadastrar</button>
                </form>

            </div>
        </body>
    );
}
