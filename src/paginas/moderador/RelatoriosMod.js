import React from "react";
import NavBar from "../../componentes/navbar/navbar";
import { CorpoDownloadRelatorio } from "../../componentes/corpo_download_relatorio";

export default function RelatoriosMod ({itensMenu}){
    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            <CorpoDownloadRelatorio/>
        </body>
    );
} 
