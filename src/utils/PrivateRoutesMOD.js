import React from "react";
import { Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

export default function PrivateRoutesMOD () {
    const token = localStorage.getItem('token');
    //adicionar a verificação do status

    try {
        const tokenData = jwtDecode(token);

        if (token && (tokenData.role === "MODERATOR")) {
            return <Outlet />;
        } else {
            return <Navigate to='/error' />;
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return <Navigate to='/' />;
    }
}
