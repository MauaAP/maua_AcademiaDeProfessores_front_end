import React from "react";
import NavBar from "../../componentes/home/navbar";
import Eventos from "../../componentes/corpo_eventos/listaeventos";

export default function ListaEventosMod ({itensMenu}){
    const listaEventos = [
        {
            nome: "WebTech Summit",
            data: "15 de Abril de 2024",
            local: "bloco H",
            modalidade: "Remoto",
            cargaHoraria: '8 horas',
            professorResp: 'João Silva',
            aplicador: 'Pedro Almeida',
            emailAplicador: 'pedro@example.com',
            publicoAlvo: 'Desenvolvedores',
            tipoAtividade: 'Palestra',
            numeroMaxParticipantes: '100',
            objetivo: 'Discutir as últimas tendências em tecnologia web',
            competencias: 'Desenvolvimento web, inovação',
            link: 'https://teams.microsoft.com/meeting'
        },
        {
            nome: "AI Conference",
            data: "22 de Maio de 2024",
            local: "bloco H",
            modalidade: "Presencial",
            cargaHoraria: '10 horas',
            professorResp: 'Maria Santos',
            aplicador: 'Carlos Oliveira',
            emailAplicador: 'carlos@example.com',
            publicoAlvo: 'Profissionais de IA',
            tipoAtividade: 'Workshop',
            numeroMaxParticipantes: '50',
            objetivo: 'Explorar avanços em inteligência artificial',
            competencias: 'Machine learning, deep learning',
            link: 'não se aplica'
        },
        {
            nome: "Blockchain Expo",
            data: "10 de Junho de 2024",
            local: "bloco H",
            modalidade: "Presencial",
            cargaHoraria: '6 horas',
            professorResp: 'Ana Souza',
            aplicador: 'Paulo Santos',
            emailAplicador: 'paulo@example.com',
            publicoAlvo: 'Entusiastas de blockchain',
            tipoAtividade: 'Apresentação',
            numeroMaxParticipantes: '80',
            objetivo: 'Explorar aplicações de blockchain em diversos setores',
            competencias: 'Blockchain, criptografia',
            link: 'não se aplica'
        },
        {
            nome: "Cybersecurity Forum",
            data: "18 de Julho de 2024",
            local: "bloco H",
            modalidade: "Remoto",
            cargaHoraria: '8 horas',
            professorResp: 'Fernanda Oliveira',
            aplicador: 'Gabriel Silva',
            emailAplicador: 'gabriel@example.com',
            publicoAlvo: 'Profissionais de segurança cibernética',
            tipoAtividade: 'Seminário',
            numeroMaxParticipantes: '120',
            objetivo: 'Debater desafios atuais e futuros em segurança cibernética',
            competencias: 'Segurança de rede, análise de malware',
            link: 'https://teams.microsoft.com/meeting'
        },
        {
            nome: "IoT World",
            data: "5 de Agosto de 2024",
            local: "bloco H",
            modalidade: "Remoto",
            cargaHoraria: '7 horas',
            professorResp: 'Marcos Oliveira',
            aplicador: 'Rafaela Santos',
            emailAplicador: 'rafaela@example.com',
            publicoAlvo: 'Entusiastas de IoT',
            tipoAtividade: 'Palestra',
            numeroMaxParticipantes: '90',
            objetivo: 'Explorar o potencial e os desafios da Internet das Coisas',
            competencias: 'IoT, sensores, conectividade',
            link: 'https://teams.microsoft.com/meeting'
        },
        {
            nome: "DevOps Conference",
            data: "12 de Setembro de 2024",
            local: "bloco H",
            modalidade: "Presencial",
            cargaHoraria: '9 horas',
            professorResp: 'Roberto Silva',
            aplicador: 'Mariana Oliveira',
            emailAplicador: 'mariana@example.com',
            publicoAlvo: 'Profissionais de TI',
            tipoAtividade: 'Workshop',
            numeroMaxParticipantes: '60',
            objetivo: 'Demonstrar práticas e ferramentas de DevOps',
            competencias: 'Integração contínua, entrega contínua',
            link: 'não se aplica'
        },
        {
            nome: "Big Data Summit",
            data: "20 de Outubro de 2024",
            local: "bloco H",
            modalidade: "Remoto",
            cargaHoraria: '8 horas',
            professorResp: 'Lucas Souza',
            aplicador: 'Ana Oliveira',
            emailAplicador: 'ana@example.com',
            publicoAlvo: 'Profissionais de dados',
            tipoAtividade: 'Palestra',
            numeroMaxParticipantes: '80',
            objetivo: 'Explorar técnicas e tecnologias de big data',
            competencias: 'Big data, análise de dados',
            link: 'https://teams.microsoft.com/meeting'
        },
        {
            nome: "Cloud Computing Expo",
            data: "8 de Novembro de 2024",
            local: "bloco H",
            modalidade: "Remoto",
            cargaHoraria: '7 horas',
            professorResp: 'Carla Santos',
            aplicador: 'Lucas Silva',
            emailAplicador: 'lucas@example.com',
            publicoAlvo: 'Profissionais de TI',
            tipoAtividade: 'Palestra',
            numeroMaxParticipantes: '70',
            objetivo: 'Explorar tendências e práticas em computação em nuvem',
            competencias: 'Computação em nuvem, virtualização',
            link: 'https://teams.microsoft.com/meeting'
        },
        {
            nome: "AR/VR Symposium",
            data: "16 de Dezembro de 2024",
            local: "bloco H",
            modalidade: "Presencial",
            cargaHoraria: '6 horas',
            professorResp: 'Daniel Oliveira',
            aplicador: 'Juliana Silva',
            emailAplicador: 'juliana@example.com',
            publicoAlvo: 'Desenvolvedores de AR/VR',
            tipoAtividade: 'Seminário',
            numeroMaxParticipantes: '40',
            objetivo: 'Explorar aplicações e tendências em realidade aumentada e virtual',
            competencias: 'AR, VR, desenvolvimento de jogos',
            link: 'não se aplica'
        },
        {
            nome: "Tech Innovation Summit",
            data: "24 de Janeiro de 2025",
            local: "bloco H",
            modalidade: "Presencial",
            cargaHoraria: '8 horas',
            professorResp: 'Fernando Souza',
            aplicador: 'Amanda Santos',
            emailAplicador: 'amanda@example.com',
            publicoAlvo: 'Empreendedores, inovadores',
            tipoAtividade: 'Conferência',
            numeroMaxParticipantes: '150',
            objetivo: 'Apresentar e discutir as últimas inovações tecnológicas',
            competencias: 'Inovação, empreendedorismo',
            link: 'não se aplica'
        }
    ];   

    return(
        <body>
            <NavBar itensMenu={itensMenu} cor={"#006400"}/>
            <Eventos listaEventos={listaEventos} cadEvento={"/cadastroEventosMod"}/>
        </body>
    )
}