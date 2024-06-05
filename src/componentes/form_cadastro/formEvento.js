import React, { useState } from "react";
import './formCadastro.css';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import InputMask from "react-input-mask";

const competenciasDisponiveis = [
    "Comunicação",
    "Trabalho em Equipe",
    "Liderança",
    "Resolução de Problemas",
    "Pensamento Crítico",
    "Gestão do Tempo",
    "Adaptabilidade"
];

export default function FormEvCad() {
    const [formData, setFormData] = useState({
        eventName: '',
        date: null,
        host: '',
        manager: [],
        duration: '',
        hostEmail: [],
        hostPhone: [],
        local: '',
        modality: '',
        targetAudience: '',
        activityType: '',
        numberMaxParticipants: null,
        goals: '',
        contentActivities: [],
        developedCompetencies: '',
        initTime: null,
        finishTime: null,
        link: ''
    });

    const [selectedCompetencies, setSelectedCompetencies] = useState([]);
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

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleDateChange = (date, field) => {
        setFormData({
            ...formData,
            [field]: new Date(date).getTime()
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

        const allFieldsFilled = Object.values(formData).every(value => value !== '' && value !== null && value !== '');
        if (allFieldsFilled) {
            try {
                const response = await axios.post("http://18.228.10.97:3000/api/create-event", {
                    ...formData,
                    developedCompetencies: selectedCompetencies.join(', ')
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (response.status === 201) {
                    notifySuccess();
                    console.log("Evento Cadastrado com sucesso:", response.data);
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

                    <label>Duração:</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Duração" />

                    <label>Responsável:</label>
                    <input type="text" name="manager" value={formData.manager.join(", ")} onChange={handleInputChange} placeholder="Responsável" />

                    <label>Aplicador:</label>
                    <input type="text" name="host" value={formData.host} onChange={handleInputChange} placeholder="Aplicador" />     

                    <label>Email do Aplicador: {!emailValido && <span style={{ color: 'red', fontSize: '8'}}>Email inválido</span>}</label>
                    <input type="text" name="hostEmail" value={formData.hostEmail.join(", ")} onChange={handleInputChange} placeholder="Email do Aplicador" />

                    <label>Telefone do Aplicador: </label>
                    <InputMask mask="(99) 99999-9999" value={formData.hostPhone} onChange={handlePhoneChange} placeholder="Telefone do Aplicador"/>

                    <label>Local do Evento:</label>
                    <input type="text" name="local" value={formData.local} onChange={handleInputChange} placeholder="Local do Evento" />

                    <label>Modalidade:</label>
                    <input type="text" name="modality" value={formData.modality} onChange={handleInputChange} placeholder="Modalidade" />

                    <label>Público-Alvo:</label>
                    <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Público-Alvo" />

                    <label>Tipo de Atividade:</label>
                    <input type="text" name="activityType" value={formData.activityType} onChange={handleInputChange} placeholder="Tipo de Atividade" />

                    <label>Número Máximo de Participantes:</label>
                    <input type="number" min="0" name="numberMaxParticipants" value={formData.numberMaxParticipants} onChange={handleMaxParticipantsChange} placeholder="Número Máximo de Participantes" />

                    <label>Objetivos:</label>
                    <input type="text" name="goals" value={formData.goals} onChange={handleInputChange} placeholder="Objetivos" />

                    <label>Atividades Planejadas:</label>
                    <input type="text" name="contentActivities" value={formData.contentActivities.join(", ")} onChange={handleInputChange} placeholder="Atividades Planejadas" />

                    <label>Competências Desenvolvidas:</label>
                    <div>
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
    )
}
