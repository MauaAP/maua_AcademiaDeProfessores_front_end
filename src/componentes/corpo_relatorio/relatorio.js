import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './relatorio.css';
import TemplateCertificado from "../certificado/certificado";
import { IoIosDownload } from "react-icons/io";

export default function Relatorio({ certificadosData, showProfessorSearch }) {
  const [filtroProfessor, setFiltroProfessor] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const handleFiltroProfessorChange = (event) => {
    setFiltroProfessor(event.target.value);
  };

  const handleFiltroCursoChange = (event) => {
    setFiltroCurso(event.target.value);
  };

  const handleDataInicioChange = (date) => {
    setDataInicio(date);
  };

  const handleDataFimChange = (date) => {
    setDataFim(date);
  };

  const filteredCertificados = certificadosData.filter(certificado => {
    const dataCertificado = new Date(certificado.data);
    return certificado.professor.toLowerCase().includes(filtroProfessor.toLowerCase()) &&
      certificado.curso.toLowerCase().includes(filtroCurso.toLowerCase()) &&
      (!dataInicio || dataCertificado >= dataInicio) &&
      (!dataFim || dataCertificado <= dataFim);
  });

  return (
    <div>
      <div className="titulo_relatorio">
        <h2>Relatórios</h2>
        
        {showProfessorSearch && (
          <>
            <input
              className="titulo_relatorio_input"
              type="text" 
              placeholder="Procurar por professor..." 
              value={filtroProfessor} 
              onChange={handleFiltroProfessorChange}
            />
            <input
              className="titulo_relatorio_input"
              type="text" 
              placeholder="Procurar por curso..." 
              value={filtroCurso} 
              onChange={handleFiltroCursoChange}
            />
          </>
        )}
        
        <DatePicker
          className="date-picker"
          selected={dataInicio}
          onChange={handleDataInicioChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data de início"
        />
        <DatePicker
          className="date-picker"
          selected={dataFim}
          onChange={handleDataFimChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data de fim"
        />

        <button>Baixar Relatório <IoIosDownload size={15}/></button>
      </div>

      <div className="certificados">
        {filteredCertificados.length === 0 ? (
            <p>Não há nenhum registro de certificados!</p>
          ) : (
            filteredCertificados.map((certificado, index) => (
              <TemplateCertificado
                key={index}
                certificadoId={certificado.presenceId}
                cursoId={certificado.eventId}
                professorId={certificado.userId}
                data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                showDelete={showProfessorSearch}
              />
            ))
          )}
      </div>
    </div>
  );
}
