import React, { useState } from 'react';
import './certificados.css';
import TemplateCertificado from "../certificado/certificado";
import { FaSpinner } from "react-icons/fa6";

export default function Certificados({ certificadosData, mostrarBusca = true }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = certificadosData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(certificadosData.length / itemsPerPage);
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
    <div>
      <div className="titulo_certificados">
        <h2>Certificados</h2>
        <input 
          type="text" 
          placeholder="Procurar por evento..." 
        />
        {mostrarBusca && (
          <input 
            type="text" 
            placeholder="Procurar por professor..." 
          />
        )}
      </div>

      <div className="certificados">
        {certificadosData.length === 0 ? (
          <p className="flex items-center justify-center text-4xl">
            <FaSpinner className="animate-spin" />
          </p>
        ) : (
          <>
            {currentItems.length === 0 ? (
              <p>Não há nenhum registro de certificados!</p>
            ) : (
              currentItems.map((certificado, index) => (
                <TemplateCertificado
                  key={index}
                  certificadoId={certificado.presenceId}
                  evento={certificado.eventName}
                  professor={certificado.userName}
                  data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                  showDelete={mostrarBusca}
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
