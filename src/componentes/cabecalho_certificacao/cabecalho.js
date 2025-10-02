import React from "react";
import { PiCertificateFill } from "react-icons/pi";
import { FaCalendarDay } from "react-icons/fa6";

export default function Cabecalho ({nome, data, horario, descEv}){
    return(
        <div className="bg-maua-blue shadow-md flex flex-col text-center rounded-b-2xl p-2.5 text-white">
            <div className="flex justify-center items-center p-0.5">
                <PiCertificateFill size={30}/>
                <h1 className="text-lg m-2.5">Confirme sua presença aqui!</h1>
                <img className="w-8 h-auto" src="./imagens/logo_maua_peq.png" alt="logo maua"/>
            </div>
            <h3 className="text-2xl">{nome}</h3>
            <div className="flex justify-center items-center m-1.5">
                <FaCalendarDay className="icone" size={15}/>
                <h3 className="text-base ml-2 font-semibold">{data}</h3>
                <h3 className="text-base ml-2 font-semibold">{horario}</h3>
            </div>
            <p className="text-base">{descEv}</p>
        </div>
    )
}