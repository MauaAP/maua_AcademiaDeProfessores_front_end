import React, { useState, useEffect } from "react";
import './certificados.css';
import TemplateCertificado from "../certificado/certificado";
import axios from "axios";

export default function Certificados({ certificadosData, mostrarBusca = true }) {
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('');
  const [filteredCertificados, setFilteredCertificados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificadosCompletos = await Promise.all(certificadosData.map(async (certificado) => {
          try {
            const professorResponse = await axios.get(`https://gmerola.com.br/ap/api/user-id/${certificado.userId}`);
            const nomeProfessor = professorResponse.data.name;

            const eventoResponse = await axios.get(`https://gmerola.com.br/ap/api/events/${certificado.eventId}`);
            const nomeEvento = eventoResponse.data.eventName;

            return {
              ...certificado,
              nomeProfessor,
              nomeEvento,
            };
          } catch (error) {
            console.error("Erro ao buscar informações do certificado:", error);
            setCarregando(false);
          }
        }));

        const certificadosFiltrados = certificadosCompletos.filter(certificado => certificado !== null);
        setFilteredCertificados(certificadosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar certificados:", error);
      }
    };

    fetchData();
  }, [certificadosData]);

  const handleFiltroCursoChange = (event) => {
    setFiltroCurso(event.target.value);
  };

  const handleFiltroProfessorChange = (event) => {
    setFiltroProfessor(event.target.value);
  };

  const filteredCertificadosToShow = filteredCertificados.filter(certificado =>
    certificado.nomeEvento.toLowerCase().includes(filtroCurso.toLowerCase()) &&
    certificado.nomeProfessor.toLowerCase().includes(filtroProfessor.toLowerCase())
  );

  setTimeout(() => {
      setCarregando(false);
  }, 3000); 

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
        {mostrarBusca && (
          <input 
            type="text" 
            placeholder="Procurar por professor..." 
            value={filtroProfessor} 
            onChange={handleFiltroProfessorChange} 
          />
        )}
      </div>

      {(
        <div className="certificados">
          {filteredCertificadosToShow.length === 0 ? ( carregando ? (
              <p>Carregando...</p> ) :  <p>Não há nenhum registro de certificados!</p>
          ) : (
            filteredCertificadosToShow.map((certificado, index) => (
              <TemplateCertificado
                key={index}
                certificadoId={certificado.presenceId}
                evento={certificado.nomeEvento}
                professor={certificado.nomeProfessor}
                data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                showDelete={mostrarBusca}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
