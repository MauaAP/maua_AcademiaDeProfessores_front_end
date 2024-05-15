import React from "react";

export default function ErrorPage () {
  return (
    <div className="pagina" style={{ textAlign: "center", marginTop: "150px" }}>
      <h1>Ooops! Algo deu errado. 😢</h1>
      <p>Não foi possível acessar a página solicitada.</p>
      <p>Por favor, retorne a página anterior!</p>
      <p>Verifique com um Administrador se sua conta está Ativa!</p>
      <a href="/" onClick={localStorage.removeItem('token')}>Retorne a página de Login</a>
    </div>
  );
};
