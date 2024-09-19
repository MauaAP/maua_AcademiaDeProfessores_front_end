import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai"; // Importa o ícone de carregamento
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './corpocertif.css';

export default function CorpoCerti({ lista, eventId }) {
    const navegacao = useNavigate();
    const [filtro, setFiltro] = useState('');
    const [checkboxSelecionado, setCheckboxSelecionado] = useState(null);
    const [idSelecionado, setIdSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (pessoaId) => {
        if (!pessoaId) {
            alert("Por favor, selecione um nome antes de confirmar.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("https://serene-mountain-65884-1b703ae41d98.herokuapp.com/api/create-presence", {
                userid: pessoaId,
                eventid: eventId
            });

            console.log("Presença criada com sucesso:", response.data);
            navegacao("/end");
        } catch (error) {
            console.error("Erro ao criar presença:", error);
            alert("Houve um erro ao confirmar sua presença. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const handleCheckboxChange = (pessoaId) => {
        if (checkboxSelecionado === pessoaId) {
            setCheckboxSelecionado(null);
            setIdSelecionado(null);
        } else {
            setCheckboxSelecionado(pessoaId);
            setIdSelecionado(pessoaId);
        }
    };

    const handleTopicClick = (pessoaId) => {
        if (checkboxSelecionado === pessoaId) {
            setCheckboxSelecionado(null);
            setIdSelecionado(null);
        } else {
            setCheckboxSelecionado(pessoaId);
            setIdSelecionado(pessoaId);
        }
    };

    const filteredList = lista.filter(pessoa =>
        pessoa.name.toLowerCase().includes(filtro.toLowerCase())
    );

    const censorEmail = (email) => {
        const [user, domain] = email.split('@');
        const censoredUser = user.slice(0, 2) + '****' + user.slice(-1);
        const censoredDomain = domain.split('.').map((part, index) => {
            return index === 0 ? part.slice(0, 1) + '***' + part.slice(-1) : part;
        }).join('.');
        return `${censoredUser}@${censoredDomain}`;
    };

    return (
        <div className="corpo-certificacao">
            <p>Selecione seu nome e depois aperte o botão para confirmar sua presença!</p>
            <input className="pesquisa" type='text' placeholder="🔎 Digite seu nome" value={filtro} onChange={handleFiltroChange} />
            <div className="lista">
                {filteredList.map((pessoa) => (
                    <div className="topicos" key={pessoa.id} onClick={() => handleTopicClick(pessoa.id)}>
                        <FaUserCircle size={30} />
                        <div>
                            <p>{pessoa.name}</p>
                            <p>{censorEmail(pessoa.email)}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={checkboxSelecionado === pessoa.id}
                            onChange={() => handleCheckboxChange(pessoa.id)}
                        />
                    </div>
                ))}
            </div>
            <br />
            <h2 className="text-center text-3xl">Usuário Externo</h2>
            <div className="flex gap-4 items-center justify-center">
                <input type="text" className="shadow-sm border-2 border-orange-900 rounded-lg p-2" placeholder="insira seu nome..."/>
                <input type="email" className="shadow-sm border-2 border-orange-900 rounded-lg p-2" placeholder="insira seu email..."/>
            </div>
            <button className="botao" onClick={() => handleSubmit(idSelecionado)}>
                {loading ? <AiOutlineLoading className="loading-icon" size={20} /> : "Confirmar Presença"}
            </button>
        </div>
    );
}
