import React from "react";
import FormsLogin from "../../componentes/form_login/formlogin";
import './Login.css'

export default function Login() {
    return(
        <div className="flex items-center">
            <img className='w-full h-screen object-cover' src="/imagens/fundo.png" alt="campus da mauá"/>
            <FormsLogin/>
        </div>
    )
}