import React from "react";
import './certificado.css';
import { IoIosPaper } from "react-icons/io";
import { IoIosDownload } from "react-icons/io";

export default function TemplateCertificado ({ curso, professor, data}) {
    return(
        <div className="certificado">
            <IoIosPaper size={32}/>
            <p>{curso}</p>
            <p>Prof. {professor}</p>
            <p>{data.toLocaleDateString()}</p>
            <a href="#">Baixar <IoIosDownload size={15}/></a>
        </div>
    );
}
