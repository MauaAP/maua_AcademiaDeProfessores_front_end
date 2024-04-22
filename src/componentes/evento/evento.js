import React, { useState } from "react";
import { MdOutlineEvent } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './evento.css';

export default function TemplateEvento({ evento, data, local, modalidade, cargaH, profResp, aplicador, emailApli, pbAlvo, tipo, numMax, objt, competencias, link}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData] = useState({ evento, data, local, modalidade, cargaH, profResp, aplicador, emailApli, pbAlvo, tipo, numMax, objt, competencias, link });

    const handleUpdate = () => {
        // implementar a requisição http
        console.log("Dados atualizados:", editedData);
        setTimeout(notiatualizar, 10); // Chama a função de notificação após um pequeno atraso
        setIsEditing(false);
    };

    const notideletar = () => toast.warning("Evento apagado!");
    const notiatualizar = () => toast.success("Dados Atualizados!");

    return (
        <div>
            <ToastContainer />
            <div className="evento">
                <MdOutlineEvent size={32} />
                <p>{evento}</p>
                <p>{data}</p>
                <p>{local}</p>
                <p>{modalidade}</p>
                <div className="evento-dir">
                    <button className="atualizar" onClick={() => setIsEditing(true)}>Atualizar</button>
                    <button className="deletar" onClick={notideletar}>Deletar</button>
                </div>

                {isEditing && (
                    <div className="popup">
                        <div className="popup-inner">
                            
                            <div className="popup-in">
                                <div className="popup-side">
                                    <IoCloseCircle className="close-btn" onClick={() => setIsEditing(false)}/>
                                    <label>{editedData.evento}</label>
                                    <input type="text" name="nome" />
                                    <label>{editedData.data}</label>
                                    <input type="text" name="data" />
                                    <label>{editedData.local}</label>
                                    <input type="text" name="local" />
                                    <label>{editedData.modalidade}</label>
                                    <input type="text" name="modalidade" />
                                    <label>{editedData.cargaH}</label>
                                    <input type="text" name="cargaH" />
                                    <label>{editedData.profResp}</label>
                                    <input type="text" name="profResponsavel" />
                                    <label>{editedData.aplicador}</label>
                                    <input type="text" name="Aplicador" />
                                </div>
                                <div className="popup-side">
                                    
                                    <label>{editedData.emailApli}</label>
                                    <input type="text" name="emailAplicador" />
                                    <label>{editedData.pbAlvo}</label>
                                    <input type="text" name="publicoAlvo" />
                                    <label>{editedData.tipo}</label>
                                    <input type="text" name="tipo" />
                                    <label>{editedData.numMax}</label>
                                    <input type="text" name="maximoParticipantes" />
                                    <label>{editedData.objt}</label>
                                    <input type="text" name="objetivo" />
                                    <label>{editedData.competencias}</label>
                                    <input type="text" name="competencias" />
                                    <label>{editedData.link}</label>
                                    <input type="text" name="link" />
                                    <button className="atualizar" onClick={handleUpdate}>Atualizar</button>
                                </div>
                            </div>   
                        </div>
                    </div>
                )}
                
            </div>
        </div>
        
    );
}
