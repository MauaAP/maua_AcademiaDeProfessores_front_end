import React from "react";
import NavBar from "../../componentes/home/navbar";
import FormEvCad from "../../componentes/form_cadastro/formEvento";

export default function CadastroEvMod ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar cargo={"Moderador"} nome={"Nome User"} itensMenu={itensMenu} cor={"#006400"}/>
            <FormEvCad/>
        </body>
    )
}