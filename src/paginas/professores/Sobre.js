import React from "react";
import NavBar from "../../componentes/home/navbar";
import FormSobre from "../../componentes/form_sobre/formSobre";

export default function SobreProf ({itensMenu}){
    
    return(
        <body className="sobre-professor">  
            <NavBar cargo={"Professor"} nome={"Nome User"} itensMenu={itensMenu} cor={"#14134F"}/>
            <FormSobre nomeP='Joana Silva' emailP='joana@gmail.br' cpfP='111.222.333.44' phone='(11) 98765-4321'/>
        </body>
    )
}