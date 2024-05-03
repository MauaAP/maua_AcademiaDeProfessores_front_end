import React from "react";

export default function ErrorPage () {
  return (
    <div className="pagina" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Ooops! Algo deu errado. 😢</h1>
      <p>Não foi possível acessar a página solicitada.</p>
      <p>Por favor, retorne a página anterior!</p>
    </div>
  );
};
