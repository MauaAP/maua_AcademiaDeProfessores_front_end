import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai"; // Importa o ícone de carregamento
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CorpoCerti({ lista, eventId }) {
    const navegacao = useNavigate();
    const [filtro, setFiltro] = useState('');
    const [checkboxSelecionado, setCheckboxSelecionado] = useState(null);
    const [idSelecionado, setIdSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (pessoaId) => {
        if (!pessoaId) {
            if (!name || !email) {
                alert("Por favor, preencha os campos de nome e email ou selecione um nome antes de confirmar.");
                return;
            } else {
                try {
                    setLoading(true);
                    const response = await axios.post("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-external-presence", {
                        name: name,
                        email: email,
                        eventId: eventId
                    });
                    console.log('presença criada com sucesso:', response.data);
                    navegacao("/end");
                    return;
                } catch (error) {
                    console.error("Erro ao criar usuário:", error);
                    alert("Houve um erro ao adicionar presença externa. Tente novamente.");
                    return;
                }
            }
        }
        try {
            setLoading(true);
            const response = await axios.post("https://6mv3jcpmik.us-east-1.awsapprunner.com/api/create-presence", {
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
        <div className="p-2.5 flex flex-col text-lg">
            <p>Selecione seu nome e depois aperte o botão para confirmar sua presença!</p>
            <input className="w-94 mb-2.5 p-2.5 rounded-md border-none shadow-md text-base" type='text' placeholder="🔎 Digite seu nome" value={filtro} onChange={handleFiltroChange} />
            <div className="flex flex-col">
                {filteredList.map((pessoa) => (
                    <div className="rounded-md p-1.5 bg-maua-gray mt-2.5 mb-2.5 flex justify-between items-center" key={pessoa.id} onClick={() => handleTopicClick(pessoa.id)}>
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
                <input onChange={(e) => setName(e.target.value)} type="text" className="shadow-sm border-2 border-orange-900 rounded-lg p-2" placeholder="insira seu nome..."/>
                <input onChange={(e) => setEmail(e.target.value)} type="email" className="shadow-sm border-2 border-orange-900 rounded-lg p-2" placeholder="insira seu email..."/>
            </div>
            <button className="ml-10 w-4/5 p-5 mt-4 rounded-md bg-maua-green border-none text-white text-lg hover:cursor-pointer hover:font-bold hover:bg-maua-green-hover" onClick={() => handleSubmit(idSelecionado)}>
                {loading ? <AiOutlineLoading className="animate-spin" size={20} /> : "Confirmar Presença"}
            </button>
        </div>
    );
}
