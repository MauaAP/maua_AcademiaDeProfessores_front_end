import React from "react";
import NavBar from "../../componentes/home/navbar";
import Certificados from "../../componentes/corpo_certificados/certificados";

//definir a roquisção HTTP
const certificadosData = [
    { curso: "Aprendizado de Máquina", professor: "João Silva", data: new Date("01/01/2022") },
    { curso: "Desenvolvimento Web", professor: "João Silva", data: new Date("05/02/2023") },
    { curso: "Inteligência Artificial", professor: "João Silva", data: new Date("10/03/2022") },
  ];

export default function HomeMod({itensMenu}) {
    return(
        <div>
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            <Certificados certificadosData={certificadosData}/>
        </div>
    )
}

  