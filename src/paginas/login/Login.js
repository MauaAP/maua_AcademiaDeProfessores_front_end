import React from "react";
import FormsLogin from "../../componentes/form_login/formlogin";
import './Login.css'

export default function Login() {
    return(
        <div className="login">
            <img className='imagem_fundo' src="/imagens/fundo.png" alt="campus da mauá"/>
            <FormsLogin/>
        </div>
    )
}