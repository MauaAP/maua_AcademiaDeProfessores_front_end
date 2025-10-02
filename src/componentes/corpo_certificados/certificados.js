import React, { useEffect, useState } from 'react';
import TemplateCertificado from "../certificado/certificado";
import { LoadingCard } from "../Loading/Loading";
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function Certificados({ certificadosData, mostrarBusca = true }) {
  const [timer, setTimer] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const itemsPerPage = 8;

  const filteredCertificados = certificadosData
    .filter(certificado =>
      certificado.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificado.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'event':
          aValue = a.eventName.toLowerCase();
          bValue = b.eventName.toLowerCase();
          break;
        case 'professor':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertificados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCertificados.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    // Botão anterior
    pageButtons.push(
      <button
        key="prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">‹</span>
      </button>
    );

    // Páginas
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-t border-b whitespace-nowrap ${
            currentPage === i
              ? 'text-maua-blue bg-blue-50 border-maua-blue'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Botão próximo
    pageButtons.push(
      <button
        key="next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <span className="hidden sm:inline">Próximo</span>
        <span className="sm:hidden">›</span>
      </button>
    );

    return pageButtons;
  };

  useEffect(() => {
    setTimeout(() => {
      setTimer(true)
    }, 3000)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Certificados</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredCertificados.length} certificado{filteredCertificados.length !== 1 ? 's' : ''} encontrado{filteredCertificados.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Search and Controls */}
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors"
                  type="text" 
                  placeholder="Buscar por evento ou professor..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Sort Controls */}
                <div className="flex gap-2 flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base"
                  >
                    <option value="date">Data</option>
                    <option value="event">Evento</option>
                    <option value="professor">Professor</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 hover:border-maua-blue focus:outline-none transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaFilter className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    <span className="sm:hidden">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors text-sm sm:text-base ${
                      viewMode === 'grid' 
                        ? 'bg-maua-blue text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sm:hidden">⚏</span>
                    <span className="hidden sm:inline">⚏</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors text-sm sm:text-base ${
                      viewMode === 'list' 
                        ? 'bg-maua-blue text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sm:hidden">☰</span>
                    <span className="hidden sm:inline">☰</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {certificadosData.length === 0 ? (
            timer ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum certificado encontrado</h3>
                <p className="text-gray-500">Não há registros de certificados no momento.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <LoadingCard key={index} />
                  ))}
                </div>
              </div>
            )
          ) : (
            <>
              {currentItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                </div>
              ) : (
                <div className={`p-4 sm:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch' : 'space-y-4'}`}>
                  {currentItems.map((certificado, index) => (
                    <div key={index} className="animate-fadeIn h-full">
                      <TemplateCertificado
                        certificadoId={certificado.presenceId}
                        evento={certificado.eventName}
                        professor={certificado.userName}
                        data={new Date(certificado.date).toLocaleDateString('pt-BR')}
                        showDelete={mostrarBusca}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                      Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredCertificados.length)} de {filteredCertificados.length} resultados
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center space-x-1 overflow-x-auto">
                        {renderPaginationButtons()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
