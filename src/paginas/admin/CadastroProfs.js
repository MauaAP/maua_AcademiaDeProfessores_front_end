import React from "react";
import NavBar from "../../componentes/home/navbar";
import FormProfCad from "../../componentes/form_cadastro/formProfessor";

export default function CadastroProfs ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar cargo={"Admin"} nome={"Nome User"} itensMenu={itensMenu} cor={"#4F1313"}/>
            <FormProfCad/>
        </body>
    )
}