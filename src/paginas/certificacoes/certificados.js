import React from "react";
import Cabecalho from "../../componentes/cabecalho_certificacao/cabecalho";
import CorpoCerti from "../../componentes/corpo-certificacao/corpocertif";

export default function Certificacao() {
    const lista = [
        { id: 1, nome: "Maria Silva" },
        { id: 2, nome: "João Santos" },
        { id: 3, nome: "Ana Oliveira" },
        { id: 4, nome: "Pedro Costa" },
        { id: 5, nome: "Laura Fernandes" },
        { id: 6, nome: "Carlos Oliveira" },
        { id: 7, nome: "Mariana Almeida" },
        { id: 8, nome: "Rafael Mendes" },
        { id: 9, nome: "Juliana Pereira" },
        { id: 10, nome: "André Ferreira" }
    ];//chamar o banco

    return (
        <div>
            <Cabecalho nome="Evento de TI" data="21/05/2025" horario="13:30" descEv="Um evento para aprimorar as abilidades e alavancar a carreira no mundo tecnológico" />
            <CorpoCerti lista={lista}/>
        </div>
    )
}
