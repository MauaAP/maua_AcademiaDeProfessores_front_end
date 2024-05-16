import React from "react";
import './cabecalho.css';
import { PiCertificateFill } from "react-icons/pi";
import { FaCalendarDay } from "react-icons/fa6";

export default function Cabecalho ({nome, data, horario, descEv}){
    return(
        <div className="cabecalho">
            <div className="cabecalho-top">
                <PiCertificateFill size={30}/>
                <h1>Confirme sua presença aqui!</h1>
                <img className="imagem-maua" src="./imagens/logo_maua_peq.png" alt="logo maua"/>
            </div>
            <h3>{nome}</h3>
            <div className="cabecalho-btt">
                <FaCalendarDay className="icone" size={15}/>
                <h3>{data}</h3>
                <h3>{horario}</h3>
            </div>
            <p>{descEv}</p>
        </div>
    )
}