import React from "react";
import FormSobre from "../../componentes/form_sobre/formSobre";
import NavBar from "../../componentes/home/navbar";

export default function SobreADM ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar cargo={"Admin"} nome={"Nome User"} itensMenu={itensMenu} cor={"#4F1313"}/>
            <FormSobre nomeP='Adm' emailP='adm@gmail.br' cpfP='111.222.333.44' phone='(11) 98765-1234'/>
        </body>
    )
}