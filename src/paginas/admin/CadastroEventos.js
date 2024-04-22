import React from "react";
import NavBar from "../../componentes/home/navbar";
import FormEvCad from "../../componentes/form_cadastro/formEvento";

export default function CadastroEv ({itensMenu}){
    return(
        <body className="sobre-adm">  
            <NavBar cargo={"Admin"} nome={"Nome User"} itensMenu={itensMenu} cor={"#4F1313"}/>
            <FormEvCad/>
        </body>
    )
}