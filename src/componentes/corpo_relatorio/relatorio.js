import React, { useState, useEffect } from "react";
import './relatorio.css';
import TemplateCertificado from "../certificado/certificado";
import { IoIosDownload } from "react-icons/io";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Relatorio({ certificadosData, showProfessorSearch }) {
  const [filtroProfessor, setFiltroProfessor] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [filteredCertificados, setFilteredCertificados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificadosCompletos = await Promise.all(certificadosData.map(async (certificado) => {
          try {
            const professorResponse = await axios.get(`http://18.228.10.97:3000/api/user-id/${certificado.userId}`);
            const nomeProfessor = professorResponse.data.name;

            const eventoResponse = await axios.get(`http://18.228.10.97:3000/api/events/${certificado.eventId}`);
            const nomeEvento = eventoResponse.data.eventName;

            return {
              ...certificado,
              nomeProfessor,
              nomeEvento
            };
          } catch (error) {
            console.error("Erro ao buscar informações do certificado:", error);
            return null;
          }
        }));

        const certificadosFiltrados = certificadosCompletos.filter(certificado => certificado !== null);
        setFilteredCertificados(certificadosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar certificados:", error);
        setCarregando(false);
      }
    };

    fetchData();
  }, [certificadosData]);

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

  const filteredCertificadosToShow = filteredCertificados.filter(certificado =>
    certificado.nomeEvento.toLowerCase().includes(filtroCurso.toLowerCase()) &&
    certificado.nomeProfessor.toLowerCase().includes(filtroProfessor.toLowerCase())
  );

  setTimeout(() => {
    setCarregando(false);
  }, 4000);

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
        {filteredCertificadosToShow.length === 0 ? (
            <p>{carregando ? "Carregando..." : "Não há nenhum registro de certificados!"}</p>
          ) : (
            filteredCertificadosToShow.map((certificado, index) => (
              <TemplateCertificado
                key={index}
                certificadoId={certificado.presenceId}
                evento={certificado.nomeEvento}
                professor={certificado.nomeProfessor}
                data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                showDelete={showProfessorSearch}
              />
            ))
          )}
      </div>
    </div>
  );
}
