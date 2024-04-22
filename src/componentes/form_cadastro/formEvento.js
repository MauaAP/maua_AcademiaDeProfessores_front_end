import React, { useState } from "react";
import './formCadastro.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
 
export default function FormEvCad (){
    const [formData, setFormData] = useState({
        nome: '',
        dataUm: null,
        dataDois: null,
        horarioIni: '',
        horarioIni2: null,
        horarioFim: '',
        horarioFim2: null,
        cargaHoraria: '',
        local: '',
        modalidade: '',
        professorResp: '',
        aplicador: '',
        emailAplicador: '',
        publicoAlvo: '',
        tipoAtividade: '',
        numeroMaxParticipantes: '',
        objetivo: '',
        competencias: '',
        repetirEvento: false,
        link: null,
        mesmoProfessor: false,
    });

    const [emailValido, setEmailValido] = useState(true);

    const notifySuccess = () => toast.success("Evento Cadastrados!");
    const notifyError = () => toast.error("Por favor, preencha todos os campos!");

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "emailAplicador") {
            setEmailValido(isValidEmail(value)); 
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handledataUmChange = (date) => {
        setFormData({
            ...formData,
            dataUm: date
        });
    };

    const handledataDoisChange = (date) => {
        setFormData({
            ...formData,
            dataDois: date
        });
    };

    const handlePhoneChange = (event) => {
        setFormData({
            ...formData,
            phone: event.target.value
        });
    };

    const handleIniChange = (event) => {
        setFormData({
            ...formData,
            horarioIni: event.target.value
        });
    };

    const handleIni2Change = (event) => {
        setFormData({
            ...formData,
            horarioIni2: event.target.value
        });
    };

    const handleFimChange = (event) => {
        setFormData({
            ...formData,
            horarioFim: event.target.value
        });
    };

    const handleFim2Change = (event) => {
        setFormData({
            ...formData,
            horarioFim2: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const allFieldsFilled = Object.values(formData).every(value => value !== '');
        if (allFieldsFilled) {
            notifySuccess();
            // enviar pro banco
            console.log(formData);
        } else {
            console.log(formData);
            notifyError();
        }
    };

    return(
        <body>
            <div className="corpo-cad">
                <form className="corpo-cad" onSubmit={handleSubmit}>
                    <h3>Cadastro...</h3>

                    <div className="info">
                        <label>Nome:</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome"></input>
                        <div>
                            <input type="checkbox" checked={formData.repetirEvento} onChange={() => setFormData({...formData, repetirEvento: !formData.repetirEvento})} />
                            <label>O evento se repete?</label>
                        </div>
                        <div className="senhas">
                            <div className="info">
                                <label>Data Um:</label>
                                <DatePicker
                                    className="date-picker"
                                    selected={formData.dataUm}
                                    onChange={handledataUmChange}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Data Inicio"
                                />
                                <label>Horário Início:</label>
                                <InputMask mask="99:99" value={formData.horarioIni} onChange={handleIniChange}/>
                                <label>Horário Fim:</label>
                                <InputMask mask="99:99" value={formData.horarioFim} onChange={handleFimChange}/>
                            </div>
                            {formData.repetirEvento && (
                                <div className="info">
                                    <label>Data Dois:</label>
                                    <DatePicker
                                        className="date-picker"
                                        selected={formData.dataDois}
                                        onChange={handledataDoisChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Data Fim"
                                    />
                                    <label>Horário Início:</label>
                                    <InputMask mask="99:99" value={formData.horarioIni2 || ''} onChange={handleIni2Change}/>
                                    <label>Horário Fim:</label>
                                    <InputMask mask="99:99" value={formData.horarioFim2 || ''} onChange={handleFim2Change}/>
                                </div>
                            )}
                        </div>
                        <label>Carga Horária:</label>
                        <input type="text" name="cargaHoraria" value={formData.cargaHoraria} onChange={handleInputChange} placeholder="Carga Horária"></input>
                        <label>Local:</label>
                        <input type="text" name="local" value={formData.local} onChange={handleInputChange} placeholder="Local"></input>
                        <label>Modalidade:</label>
                        <input type="text" name="modalidade" value={formData.modalidade} onChange={handleInputChange} placeholder="Modalidade (Presencial ou Remoto)"></input>
                        <label>Link da Reunião (se for Remoto):</label>
                        <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="Link para a Reunião"></input>
                        <label>Professor Responsável:</label>
                        <input type="text" name="professorResp" value={formData.professorResp} onChange={handleInputChange} placeholder="Professor Responsável"></input>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={formData.mesmoProfessor} 
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        mesmoProfessor: event.target.checked,
                                        aplicador: event.target.checked ? formData.professorResp : ''
                                    });
                                }} 
                            />
                            O aplicador é o mesmo que o professor responsável?
                        </label>
                        <label>Aplicador:</label>
                        <input type="text" name="aplicador" value={formData.aplicador} onChange={handleInputChange} placeholder="Aplicador" disabled={formData.mesmoProfessor}></input>
                        <label>Email do Responsável: {!emailValido && <span style={{ color: 'red', fontSize: '8'}}>Email inválido</span>}</label>
                        <input type="text" name="emailAplicador" value={formData.emailAplicador} onChange={handleInputChange} placeholder="Email do Aplicador"></input>
                        <label>Telefone do Responsável:</label>
                        <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handlePhoneChange}/>
                        <label>Público Alvo:</label>
                        <input type="text" name="publicoAlvo" value={formData.publicoAlvo} onChange={handleInputChange} placeholder="Público Alvo"></input>
                        <label>Tipo de Atividade:</label>
                        <input type="text" name="tipoAtividade" value={formData.tipoAtividade} onChange={handleInputChange} placeholder="Tipo de Atividade"></input>
                        <label>Número Máximo de Participantes:</label>
                        <input type="number" min='0' name="numeroMaxParticipantes" value={formData.numeroMaxParticipantes} onChange={handleInputChange} placeholder="Número Máximo de Participantes"></input>
                        <label>Objetivo:</label>
                        <input name="objetivo" value={formData.objetivo} onChange={handleInputChange} placeholder="Objetivo"></input>
                        <label>Competências Desenvolvidas:</label>
                        <input name="competencias" value={formData.competencias} onChange={handleInputChange} placeholder="Competências Desenvolvidas"></input>
                    </div>

                    <button className="bnt-cadastrar" type="submit">Cadastrar</button>
                </form>
            </div>
            <ToastContainer/>
        </body>
        
    )
}