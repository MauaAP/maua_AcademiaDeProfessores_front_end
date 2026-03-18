import React, { useState, useEffect } from "react";
import Cabecalho from "../../componentes/cabecalho_certificacao/cabecalho";
import FormAvaliacao from "../../componentes/avaliacao/FormAvaliacao";
import axios from "axios";

const API_BASE = "https://6mv3jcpmik.us-east-1.awsapprunner.com";

export default function AvaliacaoPage() {
    const [evento, setEvento] = useState(null);

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");

    useEffect(() => {
        if (!eventId) return;
        axios
            .get(`${API_BASE}/api/events/${eventId}`)
            .then((response) => setEvento(response.data))
            .catch((error) => console.error("Erro ao buscar dados do evento:", error));
    }, [eventId]);

    if (!eventId) {
        return (
            <div className="pagina" style={{ textAlign: "center", marginTop: "150px" }}>
                <h1>Evento não encontrado 😢</h1>
                <p>O link de avaliação está incompleto. Por favor, use o link correto.</p>
            </div>
        );
    }

    return (
        <div>
            <Cabecalho
                nome={evento?.eventName || "Avaliação de Evento"}
                horario={evento?.initTime ? new Date(evento.initTime).toLocaleString("pt-BR") : ""}
                descEv="Agradecemos sua participação! Por favor, avalie o evento abaixo."
            />
            <FormAvaliacao eventId={eventId} />
        </div>
    );
}
