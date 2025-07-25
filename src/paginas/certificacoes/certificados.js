import React, { useState, useEffect } from "react";
import Cabecalho from "../../componentes/cabecalho_certificacao/cabecalho";
import CorpoCerti from "../../componentes/corpo_certificacao/corpocertif";
import axios from "axios";

export default function Certificacao() {
    const [lista, setLista] = useState([]);
    const [evento, setEvento] = useState([]);

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    useEffect(() => {
        axios.get(`https://6mv3jcpmik.us-east-1.awsapprunner.com/api/events/${eventId}`)
        .then(response => {
            setEvento(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do evento:', error);
        });
    
    }, [eventId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://6mv3jcpmik.us-east-1.awsapprunner.com/api/users-list');
                setLista(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []); 
    
    return (
        <div>
            <Cabecalho nome={evento.eventName} horario={new Date(evento.initTime).toLocaleString()} descEv={evento.goals} />
            <CorpoCerti lista={lista} eventId={eventId}/>
        </div>
    )
}
