import React from "react";
import NavBar from "../../componentes/home/navbar";
import Professores from "../../componentes/corpo_professores/listaprof";

const listaProfessores = [
    {
        nome: "João Silva",
        email: "joao.silva@example.com",
        cpf: "123.456.789-00",
        phone: "(12) 3456-7890"
    },
    {
        nome: "Maria Santos",
        email: "maria.santos@example.com",
        cpf: "987.654.321-00",
        phone: "(23) 4567-8901"
    },
    {
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@example.com",
        cpf: "111.222.333-44",
        phone: "(34) 5678-9012"
    },
    {
        nome: "Ana Souza",
        email: "ana.souza@example.com",
        cpf: "555.666.777-88",
        phone: "(45) 6789-0123"
    },
    {
        nome: "Carlos Pereira",
        email: "carlos.pereira@example.com",
        cpf: "999.888.777-66",
        phone: "(56) 7890-1234"
    },
    {
        nome: "Juliana Costa",
        email: "juliana.costa@example.com",
        cpf: "444.333.222-11",
        phone: "(67) 8901-2345"
    },
    {
        nome: "Lucas Oliveira",
        email: "lucas.oliveira@example.com",
        cpf: "222.333.444-55",
        phone: "(78) 9012-3456"
    },
    {
        nome: "Fernanda Lima",
        email: "fernanda.lima@example.com",
        cpf: "777.888.999-00",
        phone: "(89) 0123-4567"
    },
    {
        nome: "Ricardo Santos",
        email: "ricardo.santos@example.com",
        cpf: "666.555.444-33",
        phone: "(90) 1234-5678"
    },
    {
        nome: "Patrícia Oliveira",
        email: "patricia.oliveira@example.com",
        cpf: "333.444.555-66",
        phone: "(01) 2345-6789"
    }
];


export default function ListaProfessores ({itensMenu}){
    return(
        <body>
            <NavBar cargo={"Admin"} nome={"Nome User"} itensMenu={itensMenu} cor={"#4F1313"}/>
            <Professores listaprofessores={listaProfessores}/>
        </body>
    )
}