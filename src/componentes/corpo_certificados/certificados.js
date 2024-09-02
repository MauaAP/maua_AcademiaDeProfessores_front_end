import './certificados.css';
import React, { useState } from 'react';
import TemplateCertificado from "../certificado/certificado";
import { FaSpinner } from "react-icons/fa6";

export default function Certificados({ certificadosData, mostrarBusca = true }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 20;

  const filteredCertificados = certificadosData.filter(certificado =>
    certificado.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificado.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <main className='p-24 max-md:p-8'>
      <div className="flex justify-between items-center mb-8 max-md:flex-col">
        <h2 className="text-2xl font-semibold text-[#4F1313]">Certificados</h2>
        <input 
          className="w-72 p-2 rounded-md shadow-xl border-2 border-gray-400 max-md:w-full"
          type="text" 
          placeholder="Procurar por evento ou professor..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetar para a primeira página ao fazer uma nova busca
          }}
        />
      </div>

      <div>
        {certificadosData.length === 0 ? (
          <p className="flex items-center justify-center text-4xl">
            <FaSpinner className="animate-spin" />
          </p>
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
    </main>
  );
}
