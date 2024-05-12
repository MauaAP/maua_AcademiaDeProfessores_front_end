import React from "react";
import NavBar from "../../componentes/navbar/navbar";
import FormProfCad from "../../componentes/form_cadastro/formProfessor";

export default function CadastroProfs ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar itensMenu={itensMenu} cor={"#4F1313"}/>
            <FormProfCad/>
        </body>
    )
}