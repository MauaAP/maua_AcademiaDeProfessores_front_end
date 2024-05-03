import React from "react";
import { Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

export default function PrivateRoutesAD () {
    const token = localStorage.getItem('token');
    //adicionar a verificacao dos status

    try {
        const tokenData = jwtDecode(token);

        if (token && (tokenData.role === "ADMIN" || tokenData.role === "SECRETARY")) {
            return <Outlet />;
        } else {
            return <Navigate to='/error' />;
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return <Navigate to='/' />;
    }
}
