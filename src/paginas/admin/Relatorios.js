import React from "react";
import NavBar from "../../componentes/home/navbar";
import Relatorio from "../../componentes/corpo_relatorio/relatorio";

//colocar a requisição http
const certificadosData = [
    { curso: "Aprendizado de Máquina", professor: "João Silva", data: new Date("01/01/2022") },
    { curso: "Desenvolvimento Web", professor: "João Silva", data: new Date("05/02/2023") },
    { curso: "Inteligência Artificial", professor: "João Silva", data: new Date("10/03/2022") },
    { curso: "Desenvolvimento Web", professor: "Maria Santos", data: new Date("05/02/2022") },
    { curso: "Inteligência Artificial", professor: "José Oliveira", data: new Date("10/03/2022") },
    { curso: "Ciência de Dados", professor: "Ana Souza", data: new Date("04/30/2022") },
    { curso: "Redes de Computadores", professor: "Pedro Almeida", data: new Date("05/20/2022") }
  ];
  
export default function Relatorios ({itensMenu}){
    return(
        <body>
            <NavBar cargo={"Admin"} nome={"Nome User"} itensMenu={itensMenu} cor={"#4F1313"}/>
            <Relatorio certificadosData={certificadosData} showProfessorSearch={true} />
        </body>
    );
}