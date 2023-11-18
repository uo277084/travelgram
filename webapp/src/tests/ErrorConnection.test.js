import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ErrorConnection from '../components/error/ErrorConnection';

test('renders ErrorConnection component', () => {
    render(
        <MemoryRouter>
            <ErrorConnection />
        </MemoryRouter>
    );

    expect(screen.getByText("500 Server Error")).toBeInTheDocument();

    expect(screen.getByText("No se puede establecer conexión con el servidor.")).toBeInTheDocument();
    expect(screen.getByText("Inténtelo más tarde.")).toBeInTheDocument();

    const linkElement = screen.getByText("Volver al inicio de sesión");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/');
});
