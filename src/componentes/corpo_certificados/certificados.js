import React, { useState } from "react";
import './certificados.css'
import TemplateCertificado from "../certificado/certificado";

  export default function Certificados({certificadosData}) {
    const [filtro, setFiltro] = useState('');
  
    const handleFiltroChange = (event) => {
      setFiltro(event.target.value);
    };
  
    const filteredCertificados = certificadosData.filter(certificado =>
      certificado.curso.toLowerCase().includes(filtro.toLowerCase())
    );
  
    return (
      <div>
        <div className="titulo_certificados">
          <h2>Certificados</h2>
          <input 
            type="text" 
            placeholder="Procurar..." 
            value={filtro} 
            onChange={handleFiltroChange} 
            onBlur={handleFiltroChange} 
          />
        </div>
  
        <div className="certificados">
          {filteredCertificados.map((certificado, index) => (
            <TemplateCertificado
              key={index}
              curso={certificado.curso}
              professor={certificado.professor}
              data={certificado.data}
            />
          ))}
        </div>
      </div>
    );
  }