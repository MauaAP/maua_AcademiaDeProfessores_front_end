import React from "react";
import NavBar from "../../componentes/navbar/navbar";
import { CorpoDownloadRelatorio } from "../../componentes/corpo_download_relatorio";

export default function RelatoriosProf ({itensMenu}){
    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#14134F"}/>
            <CorpoDownloadRelatorio professor={true}/>
        </body>
    );
} 
