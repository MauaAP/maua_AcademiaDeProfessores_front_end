import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './relatorio.css'
import TemplateCertificado from "../certificado/certificado";
import { IoIosDownload } from "react-icons/io";

export default function Relatorio({ certificadosData, showProfessorSearch }) {
  const [filtro, setFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleDataInicioChange = (date) => {
    setDataInicio(date);
  };

  const handleDataFimChange = (date) => {
    setDataFim(date);
  };

  const filteredCertificados = certificadosData.filter(certificado => {
    const dataCertificado = certificado.data;
    return certificado.professor.toLowerCase().includes(filtro.toLowerCase()) &&
      (!dataInicio || dataCertificado >= dataInicio) &&
      (!dataFim || dataCertificado <= dataFim);
  });

  return (
    <div>
      <div className="titulo_relatorio">
        <h2>Relatórios</h2>
        
        {showProfessorSearch && ( // Renderiza o campo de busca apenas se showProfessorSearch for true
          <input
              className="titulo_relatorio_input"
            type="text" 
            placeholder="Procurar por nome do professor..." 
            value={filtro} 
            onChange={handleFiltroChange} 
            onBlur={handleFiltroChange} 
          />
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

        <a href="#">Baixar Relatório <IoIosDownload size={15}/></a>
        
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
