import React from "react";
import FormSobre from "../../componentes/form_sobre/formSobre";
import NavBar from "../../componentes/home/navbar";

export default function SobreMod ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar cargo={"Moderador"} nome={"Nome User"} itensMenu={itensMenu} cor={"#006400"}/>
            <FormSobre nomeP='Moderador' emailP='adm@gmail.br' cpfP='111.222.333.44' phone='(11) 98765-1234'/>
        </body>
    )
}