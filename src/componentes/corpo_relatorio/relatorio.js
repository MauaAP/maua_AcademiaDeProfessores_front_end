import React, { useState, useEffect } from "react";
import TemplateCertificado from "../certificado/certificado";
import { IoIosDownload } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSpinner } from "react-icons/fa";

export default function Relatorio({ certificadosData, showProfessorSearch = true }) {
  const [filtroGeral, setFiltroGeral] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const itemsPerPage = 20;

  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleFiltroGeralChange = (event) => {
    setFiltroGeral(event.target.value);
    setCurrentPage(1);
  };

  const handleDataInicioChange = (date) => {
    setDataInicio(date);
    setCurrentPage(1);
  };

  const handleDataFimChange = (date) => {
    setDataFim(date);
    setCurrentPage(1);
  };

  const filteredCertificados = certificadosData.filter(certificado => {
    const filtroLowerCase = filtroGeral.toLowerCase();
    const matchesProfessor = certificado.userName.toLowerCase().includes(filtroLowerCase);
    const matchesCurso = certificado.eventName.toLowerCase().includes(filtroLowerCase);
    const matchesDate = (!dataInicio || new Date(certificado.date) >= dataInicio) &&
                        (!dataFim || new Date(certificado.date) <= dataFim);
    return (matchesProfessor || matchesCurso) && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertificados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCertificados.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 3;

    if (currentPage > 1) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );
    }

    if (currentPage > maxVisiblePages + 1) {
      pageButtons.push(<span key="before-dots">...</span>);
    }

    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 2);
    const endPage = Math.min(currentPage + Math.floor(maxVisiblePages / 2), totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - maxVisiblePages) {
      pageButtons.push(<span key="after-dots">...</span>);
    }

    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className='p-24 max-md:p-8'>
      <div className="flex justify-between lg:items-center gap-4 max-lg:flex-col">
        <h2 className="text-2xl font-semibold text-[#4F1313] max-lg:text-center">Relatórios</h2>

        {showProfessorSearch && (
          <div className="flex justify-between items-center max-md:flex-col">
            <input
              className="w-72 p-2 rounded-md shadow-xl border-2 border-gray-400 max-lg:w-full"
              type="text" 
              placeholder="Procurar por professor ou curso..." 
              value={filtroGeral} 
              onChange={handleFiltroGeralChange}
            />
          </div>
        )}
        
        <div className="flex justify-between items-center gap-4 max-md:flex-col">
          <DatePicker
            className="shadow-xl p-2 border-2 border-gray-400 rounded-lg"
            selected={dataInicio}
            onChange={handleDataInicioChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data de início"
          />
          <DatePicker
            className="shadow-xl p-2 border-2 border-gray-400 rounded-lg"
            selected={dataFim}
            onChange={handleDataFimChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data de fim"
          />
        </div>
        <button className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar Relatório <IoIosDownload size={16}/></button>
      </div>

      <div className="mt-12">
        {certificadosData.length === 0 ? (
          carregando ? (
            <p className="flex items-center justify-center text-4xl">
              <FaSpinner className="animate-spin" />
            </p>
          ) : (
            <p className='text-center text-xl'>Não há nenhum registro de certificados!</p>
          )
        ) : (
          <>
            {currentItems.length === 0 ? (
              <p className='text-center text-xl'>Não há nenhum registro de certificados!</p>
            ) : (
              currentItems.map((certificado, index) => (
                <TemplateCertificado
                  key={index}
                  certificadoId={certificado.presenceId}
                  evento={certificado.eventName}
                  professor={certificado.userName}
                  data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                  showDelete={showProfessorSearch}
                />
              ))
            )}
            <div className="flex justify-center">
              {renderPaginationButtons()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
