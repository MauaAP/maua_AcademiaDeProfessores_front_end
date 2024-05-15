import React, { useState } from "react";
import './certificados.css'
import TemplateCertificado from "../certificado/certificado";

export default function Certificados({ certificadosData, mostrarBusca = true}) {
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('');

  const handleFiltroCursoChange = (event) => {
    setFiltroCurso(event.target.value);
  };

  const handleFiltroProfessorChange = (event) => {
    setFiltroProfessor(event.target.value);
  };

  const filteredCertificados = certificadosData.filter(certificado =>
    certificado.curso.toLowerCase().includes(filtroCurso.toLowerCase()) &&
    certificado.professor.toLowerCase().includes(filtroProfessor.toLowerCase())
  );

  return (
    <div>
      <div className="titulo_certificados">
        <h2>Certificados</h2>
        <input 
          type="text" 
          placeholder="Procurar por evento..." 
          value={filtroCurso} 
          onChange={handleFiltroCursoChange} 
        />
        { mostrarBusca &&
          <input 
            type="text" 
            placeholder="Procurar por professor..." 
            value={filtroProfessor} 
            onChange={handleFiltroProfessorChange} 
          />
        }
        
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
