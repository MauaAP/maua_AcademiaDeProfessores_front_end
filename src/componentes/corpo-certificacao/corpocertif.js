import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './corpocertif.css';

export default function CorpoCerti({ lista }) {
    const navegacao = useNavigate();
    const [filtro, setFiltro] = useState('');
    const [checkboxSelecionado, setCheckboxSelecionado] = useState(null);
    const [idSelecionado, setIdSelecionado] = useState(null);

    const  handleSubmit = (pessoaId) =>{
        console.log("Id selecionado:", pessoaId)
        navegacao("/end")
    }

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
        pessoa.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="corpo-certificacao">
            <p>Selecione seu nome e depois aperte o botão para confirmar sua presença!</p>
            <input className="pesquisa" type='text' placeholder="🔎 Digite seu nome" value={filtro} onChange={handleFiltroChange} />
            <div className="lista">
                {filteredList.map((pessoa) => (
                    <div className="topicos" key={pessoa.id} onClick={() => handleTopicClick(pessoa.id)}>
                        <FaUserCircle size={30} />
                        <p>{pessoa.nome}</p>
                        <input
                            type="checkbox"
                            checked={checkboxSelecionado === pessoa.id} 
                            onChange={() => handleCheckboxChange(pessoa.id)}
                        />
                    </div>
                ))}
            </div>
            <button className="botao" onClick={() =>  handleSubmit(idSelecionado)}>Confirmar Presença</button>
        </div>
    );
}
