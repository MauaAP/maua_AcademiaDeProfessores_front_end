import React from "react";
import NavBar from "../../componentes/navbar/navbar";
import { CorpoDownloadRelatorio } from "../../componentes/corpo_download_relatorio";

export default function Relatorios ({itensMenu}){
    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            {/* <Relatorio certificadosData={certificadosData} showProfessorSearch={true} /> */}
            <CorpoDownloadRelatorio/>
        </body>
    );
}
