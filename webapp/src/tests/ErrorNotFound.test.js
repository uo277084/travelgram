import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ErrorNotFound from '../components/error/ErrorNotFound';

test('renders ErrorNotFound component', () => {
    render(
        <MemoryRouter>
            <ErrorNotFound />
        </MemoryRouter>
    );

    expect(screen.getByText("404 Not Found")).toBeInTheDocument();

    expect(screen.getByText("La página que estás buscando no se encuentra.")).toBeInTheDocument();

    const linkElement = screen.getByText("Volver al inicio de sesión");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('/');
});
