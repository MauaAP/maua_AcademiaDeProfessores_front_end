import React, { useState } from "react";
import { FaSpinner, FaUserPlus, FaSearch, FaFilter, FaTh, FaList, FaDownload } from "react-icons/fa";
import TemplateProfessor from "../professor/professor";
import axios from "axios";

export default function Professores({ listaprofessores }) {
    const [filtro, setFiltro] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 8;

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
        setCurrentPage(1);
    };

    const filteredProfessores = listaprofessores
        .filter(professor => {
            const matchesSearch = professor.name.toLowerCase().includes(filtro.toLowerCase()) ||
                                 professor.email.toLowerCase().includes(filtro.toLowerCase()) ||
                                 professor.cpf.includes(filtro);
            
            const matchesRole = roleFilter === 'all' || professor.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || professor.status === statusFilter;
            
            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'role':
                    aValue = a.role.toLowerCase();
                    bValue = b.role.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status.toLowerCase();
                    bValue = b.status.toLowerCase();
                    break;
                case 'name':
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Cálculos de paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProfessores.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProfessores.length / itemsPerPage);

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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
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
                    className={`px-3 py-2 text-sm font-medium border-t border-b ${
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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Próximo
            </button>
        );

        return pageButtons;
    };

    const handleDownloadUsers = async () => {
        try {
            const response = await axios.get('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/download-users', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              responseType: 'blob', // Adiciona o tipo de resposta como blob
            });
      
            const url = window.URL.createObjectURL(new Blob([response.data])); // Cria uma URL com o arquivo blob
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.csv'); // Substitua pelo nome do arquivo desejado
            document.body.appendChild(link);
            link.click();
            link.remove(); // Remove o link após o clique
          } catch (error) {
            console.error('Erro ao baixar usuários:', error);
          }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Usuários</h1>
                            <p className="text-gray-600">
                                {filteredProfessores.length} usuário{filteredProfessores.length !== 1 ? 's' : ''} encontrado{filteredProfessores.length !== 1 ? 's' : ''}
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
                  placeholder="Buscar por nome, email ou CPF..."
                  value={filtro}
                  onChange={handleFiltroChange}
                />
              </div>
              
              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 flex-1">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base flex-1 min-w-0"
                  >
                    <option value="all">Todos os cargos</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="MODERATOR">Moderador</option>
                    <option value="PROFESSOR">Professor</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base flex-1 min-w-0"
                  >
                    <option value="all">Todos os status</option>
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-maua-blue focus:outline-none transition-colors text-sm sm:text-base flex-1 min-w-0"
                  >
                    <option value="name">Nome</option>
                    <option value="email">Email</option>
                    <option value="role">Cargo</option>
                    <option value="status">Status</option>
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
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors text-sm sm:text-base ${
                      viewMode === 'list' 
                        ? 'bg-maua-blue text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadUsers}
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-maua-green to-maua-green-hover text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 text-sm sm:text-base"
                  >
                    <FaDownload className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Baixar CSV</span>
                    <span className="sm:hidden">CSV</span>
                  </button>
                  <a 
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-maua-orange to-maua-orange-hover text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 text-sm sm:text-base" 
                    href="/cadastroProfessores"
                  >
                    <FaUserPlus className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Cadastrar</span>
                    <span className="sm:hidden">+</span>
                  </a>
                </div>
              </div>
            </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaSpinner className="animate-spin text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                            <p className="text-gray-500">Não há usuários cadastrados no momento.</p>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 sm:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch' : 'space-y-4'}`}>
                                {currentItems.map((professor, index) => (
                                    <div key={index} className="animate-fadeIn h-full">
                                        <TemplateProfessor
                                            id={professor.id}
                                            professor={professor.name}
                                            cpf={professor.cpf}
                                            phone={professor.telefone}
                                            email={professor.email}
                                            role={professor.role}
                                            status={professor.status}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProfessores.length)} de {filteredProfessores.length} resultados
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="flex items-center space-x-1">
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
        </div>
    )
}
