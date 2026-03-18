import React from "react";
import NavBar from "../../componentes/navbar/navbar";
import GerenciarPerguntasComp from "../../componentes/avaliacao/GerenciarPerguntas";

export default function GerenciarPerguntasPage({ itensMenu }) {
    return (
        <div>
            <NavBar itensMenu={itensMenu} cor={"#4F1313"} />
            <GerenciarPerguntasComp />
        </div>
    );
}
