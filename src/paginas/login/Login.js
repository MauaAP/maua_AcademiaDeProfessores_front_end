import React from "react";
import FormsLogin from "../../componentes/form_login/formlogin";

export default function Login() {
    return(
        <div className="flex items-center min-h-screen">
            {/* Background Image - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 h-screen">
                <img 
                    className='w-full h-full object-cover' 
                    src="/imagens/fundo.png" 
                    alt="campus da mauá"
                />
            </div>
            
            {/* Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <FormsLogin/>
            </div>
        </div>
    )
}