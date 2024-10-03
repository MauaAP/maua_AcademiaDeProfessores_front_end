import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosDownload } from "react-icons/io";
import Select from 'react-select';

export function CorpoDownloadRelatorio({ professor }) {
    const [users, setUsers] = useState([]);
    const [prof, setProf] = useState(null);

    async function relatorioGeral() {
        try {
            await axios.get("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/download-events", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data])); // Cria uma URL com o arquivo blob
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'relatorioGeral.csv'); // Substitua pelo nome do arquivo desejado
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        }
    }

    async function relatorioProfessor(idProfessor, nomeProfessor) {
        try {
            if((idProfessor === undefined && nomeProfessor === undefined) || (idProfessor === null && nomeProfessor === null)) {
                alert("professor nao encontrado")
                return
            }
            await axios.get(`https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/professor-report/${idProfessor}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                const reportUrl = response.data.reportUrl;
                // Cria um link para download sem abrir o arquivo
                const link = document.createElement('a');
                link.href = reportUrl;
                link.setAttribute('download', `relatorioDo${nomeProfessor}.pdf`); // Nome do arquivo de download
                document.body.appendChild(link);
                link.style.display = 'none'; // Esconde o link
                link.click(); // Dispara o click para baixar o arquivo
                document.body.removeChild(link);
            })
        } catch (error) {
            console.error("erro ao buscar relatorio do professor: ", error)
        }
    }

    async function relatorioProfUnico() {
        try {
            await axios.get(`https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/professor-report`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                const reportUrl = response.data.reportUrl;
                // Cria um link para download sem abrir o arquivo
                const link = document.createElement('a');
                link.href = reportUrl;
                link.setAttribute('download', `relatorio.pdf`); // Nome do arquivo de download
                document.body.appendChild(link);
                link.style.display = 'none'; // Esconde o link
                link.click(); // Dispara o click para baixar o arquivo
                document.body.removeChild(link);
            })
        } catch (error) {
            console.error("erro ao buscar relatorio do professor: ", error)
        }
    }

    async function allUsers() {
        try {
            await axios.get("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                setUsers(response.data);
            });
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        }
    }

    useEffect(() => {
        allUsers();
    }, [])

    return (
        <section className='p-24 max-md:p-8'>
            <div className="flex justify-between lg:items-center gap-4 max-lg:flex-col">
                <h2 className="text-2xl font-semibold text-[#4F1313] max-lg:text-center">Relatórios</h2>
            </div>

            <div className="flex flex-col justify-center items-center gap-8 mt-8">
                <div className={`${professor ? "hidden" : "flex"} items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md max-md:flex-col max-md:w-full`}>
                    <div>
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório Geral de Atividades</h3>
                        <p className="text-sm text-[#4F1313]">Baixe o relatório de certificados em CSV.</p>
                    </div>
                    <button onClick={relatorioGeral} className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16} /></button>
                </div>

                <div className={`${professor ? "hidden" : "flex"} items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md max-md:flex-col max-md:w-full`}>
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório de um professor</h3>
                        <p className="text-sm text-[#4F1313] mb-4">Baixe o relatório de certificados em PDF.</p>
                        <Select 
                            onChange={(selectedOption) => setProf(selectedOption)}
                            options={users.map((user) => ({ value: user.id, label: user.name }))} 
                            placeholder="Selecione um professor..."
                            className="w-1/2 mb-4 max-md:w-full" 
                        />
                    </div>
                    <button onClick={() => prof && relatorioProfessor(prof.value, prof.label)} className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16} /></button>
                </div>

                <div className={`${professor ? "flex" : "hidden"} items-center justify-between p-8 bg-gray-300 w-1/2 rounded-xl shadow-md max-md:flex-col max-md:w-full`}>
                    <div>
                        <h3 className="text-lg font-semibold text-[#4F1313]">Download Relatório</h3>
                        <p className="text-sm text-[#4F1313]">Baixe o relatório de certificados em PDF.</p>
                    </div>
                    <button onClick={relatorioProfUnico} className="flex items-center justify-between gap-2 bg-[#69A120] text-white p-2 rounded-lg duration-100 hover:bg-[#517e17] max-md:justify-center">Baixar <IoIosDownload size={16} /></button>
                </div>
            </div>
        </section>
    );
}
