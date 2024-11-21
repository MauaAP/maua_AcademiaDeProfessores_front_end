import React, { useState } from "react";
import { MdOutlineEvent } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './evento.css';
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
        try {
            const response = await axios.delete(`https://pdghaebgjd.us-east-1.awsapprunner.com/api/delete-event/${eventId}`, {
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
        <div>
            <div className="flex items-center gap-8 w-full bg-gray-300 mb-4 p-4 rounded-xl shadow-md max-md:flex-col">
                <div className="bg-gray-400 p-2 rounded-md">
                    <MdOutlineEvent size={32} />
                </div>
                <p className="flex-[3] max-md:text-center">{eventName}</p>
                <p className="flex-[3] max-md:text-center">{date}</p>
                <p className="flex-[3] max-md:text-center">{local}</p>
                <p className="flex-[3] max-md:text-center">{modality}</p>
                {mostrarOpcoesEsp && (
                    <div className="flex flex-col max-md:w-full">
                        <button className="gerador" onClick={handleGerarQRCode}>Gerar QR Code</button>
                        <button className="atualizar" onClick={newAtt}>Sobre</button>
                        <button className="deletar" onClick={handleDelete}>Deletar</button>
                    </div>
                )}

                {isEditing && (
                    <div className="popup">
                        <div className="popup-inner">
                            <div className="popup-in">
                                <div className="popup-side">
                                    <label>{eventName}</label>
                                    <input type="text" name="eventName" placeholder="Nome do Evento" />
                                    <label>{date}</label>
                                    <InputMask mask='99/99/9999' placeholder="Data do Evento" />
                                    <label>{local}</label>
                                    <input type="text" name="local" placeholder="Local do Evento" />
                                    <label>{modality}</label>
                                    <input type="text" name="modality" placeholder="Modalidade" />
                                    <label>{hostPhone}</label>
                                    <InputMask mask="(99) 99999-9999" placeholder="Telefone do Aplicador" />
                                    <label>{manager.join(", ")}</label>
                                    <input type="text" name="manager" placeholder="Responsável" />
                                    <label>{period}</label>
                                    <input type="text" name="period" placeholder="Período" />
                                </div>
                                <div className="popup-side">
                                    <label>{host}</label>
                                    <input type="text" name="host" placeholder="Aplicador" />
                                    <label>{hostEmail.join(", ")}</label>
                                    <input type="text" name="hostEmail" placeholder="Email do Aplicador" />
                                    <label>{targetAudience}</label>
                                    <input type="text" name="targetAudience" placeholder="Público Alvo" />
                                    <label>{activityType}</label>
                                    <input type="text" name="activityType" placeholder="Tipo de Atividade" />
                                    <label>{contentActivities.join(", ")}</label>
                                    <input type="text" name="contentAtt" placeholder="Atividades Planejadas" />
                                    <label>{goals}</label>
                                    <input type="text" name="goals" placeholder="Objetivos" />  
                                </div>
                                <div className="popup-side">
                                    <label>{developedCompetencies}</label>
                                    <input type="text" name="developedCompetencies" placeholder="Competências Desenvolvidas" />
                                    <label>{initTime}</label>
                                    <InputMask mask='99:99' placeholder="Horário de Início" />
                                    <label>{finishTime}</label>
                                    <InputMask mask='99:99' placeholder="Horário de Término" />
                                    <label>{linkValue}</label>
                                    <input type="text" name="link" placeholder="Link do Evento" />
                                    <button className="atualizar-popup" onClick={handleUpdate}>Atualizar</button>
                                    <button className="close-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isQrCode && (
                    <div className="popup-qr">
                        <div className="popup-inner-qr">
                            <p><strong>{eventName}</strong></p>
                            <QRCode size={500} value={qrCodeValue} />
                            <button className="close-btn" onClick={() => setQtCode(false)}>Fechar</button>
                        </div>
                    </div>
                )}

            </div>
        </div>

    );
}
