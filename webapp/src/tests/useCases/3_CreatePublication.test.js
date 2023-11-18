import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeAll(() => {
    delete window.location;
    window.location = { href: '' };

    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query) => ({
            media: query,
            matches: query === "(pointer: fine)",
            onchange: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            addListener: () => { },
            removeListener: () => { },
            dispatchEvent: () => false,
        }),
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(() => {
    delete window.matchMedia;
});

import { BrowserRouter } from 'react-router-dom';
import AddPublication from '../../components/publications/create/AddPublication';

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/publicationService', () => ({
    addImagesToAPublication: jest.fn(),
    addPublication: jest.fn()
}));

jest.mock('../../firebase/firebaseUtils', () => ({
    uploadImagesToPublication: jest.fn()
}));

describe('Crear publicación tests', () => {
    describe('faltan campos obligatorios por rellenar', () => {
        test('no se rellena el campo país', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <AddPublication />
                </BrowserRouter>);
            });

            const ratingInput = screen.getByTestId("rating").querySelector('input');
            const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

            act(() => {
                fireEvent.click(buttonLastMonth);
            });
            fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

            expect(ratingInput.value).toBe('0.5');

            const button = screen.getByRole('button', { name: 'Añadir publicación' });

            act(() => {
                fireEvent.click(button);
            });

            await waitFor(async () => {
                const toastText = await screen.findByText("Falta completar algún campo obligatorio");
                expect(toastText).toBeInTheDocument();
            }, { timeout: 3000 });

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull(), { timeout: 3000 });
        }, 10000);

        test('no se rellena el campo ciudad', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <AddPublication />
                </BrowserRouter>);
            });

            const autoCompleteCountries = screen.getByTestId("countries");

            const countriesInput = autoCompleteCountries.querySelector('input');

            autoCompleteCountries.focus();
            fireEvent.change(countriesInput, { target: { value: 'a' } })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
            await new Promise(resolve => setTimeout(resolve, 100));

            userEvent.click(document.body);

            const ratingInput = screen.getByTestId("rating").querySelector('input');
            const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

            fireEvent.change(countriesInput);
            await act(async () => {
                fireEvent.click(buttonLastMonth);
            });
            fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

            expect(countriesInput.value).toBe('Afganistán');
            expect(ratingInput.value).toBe('0.5');

            const button = screen.getByRole('button', { name: 'Añadir publicación' });

            await act(async () => {
                fireEvent.click(button);
            });

            await waitFor(async () => {
                const toastText = await screen.findByText("Falta completar algún campo obligatorio");
                expect(toastText).toBeInTheDocument();
            }, { timeout: 3000 });

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull(), { timeout: 3000 });
        }, 10000);

        test('no se rellena el campo periodo del viaje', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <AddPublication />
                </BrowserRouter>);
            });

            const autoCompleteCountries = screen.getByTestId("countries");
            const autoCompleteCities = screen.getByTestId("cities");

            const countriesInput = autoCompleteCountries.querySelector('input');
            const citiesInput = autoCompleteCities.querySelector('input');

            autoCompleteCountries.focus();
            fireEvent.change(countriesInput, { target: { value: 'a' } })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
            await new Promise(resolve => setTimeout(resolve, 100));

            userEvent.click(document.body);

            autoCompleteCities.focus();
            fireEvent.change(citiesInput, { target: { value: 'k' } })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCities, { key: 'ArrowDown' })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCities, { key: 'Enter' })
            await new Promise(resolve => setTimeout(resolve, 100));

            const selectedCitiesChips = autoCompleteCities.querySelectorAll('.MuiAutocomplete-tag');
            const selectedCities = Array.from(selectedCitiesChips).map(chip => chip.textContent.trim());

            const ratingInput = screen.getByTestId("rating").querySelector('input');

            fireEvent.change(countriesInput);
            await act(async () => {
                fireEvent.change(citiesInput);
            });
            fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

            expect(countriesInput.value).toBe('Afganistán');
            waitFor(() => expect(selectedCities).toEqual(['Kabul']), { timeout: 3000 });
            expect(ratingInput.value).toBe('0.5');

            const button = screen.getByRole('button', { name: 'Añadir publicación' });

            await act(async () => {
                fireEvent.click(button);
            });

            await waitFor(async () => {
                const toastText = await screen.findByText("Falta completar algún campo obligatorio");
                expect(toastText).toBeInTheDocument();
            }, { timeout: 3000 });

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull(), { timeout: 3000 });
        }, 10000);

        test('no se rellena el campo valoración', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <AddPublication />
                </BrowserRouter>);
            });

            const autoCompleteCountries = screen.getByTestId("countries");
            const autoCompleteCities = screen.getByTestId("cities");

            const countriesInput = autoCompleteCountries.querySelector('input');
            const citiesInput = autoCompleteCities.querySelector('input');

            autoCompleteCountries.focus();
            fireEvent.change(countriesInput, { target: { value: 'a' } })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
            await new Promise(resolve => setTimeout(resolve, 100));

            userEvent.click(document.body);

            autoCompleteCities.focus();
            fireEvent.change(citiesInput, { target: { value: 'k' } })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCities, { key: 'ArrowDown' })
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.keyDown(autoCompleteCities, { key: 'Enter' })
            await new Promise(resolve => setTimeout(resolve, 100));

            const selectedCitiesChips = autoCompleteCities.querySelectorAll('.MuiAutocomplete-tag');
            const selectedCities = Array.from(selectedCitiesChips).map(chip => chip.textContent.trim());

            const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

            fireEvent.change(countriesInput);
            await act(async () => {
                fireEvent.change(citiesInput); fireEvent.click(buttonLastMonth);
            });

            expect(countriesInput.value).toBe('Afganistán');
            waitFor(() => expect(selectedCities).toEqual(['Kabul']), { timeout: 3000 });

            const button = screen.getByRole('button', { name: 'Añadir publicación' });

            await act(async () => {
                fireEvent.click(button);
            });

            await waitFor(async () => {
                const toastText = await screen.findByText("Falta completar algún campo obligatorio");
                expect(toastText).toBeInTheDocument();
            }, { timeout: 3000 });

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull(), { timeout: 3000 });
        }, 10000);

        test('no se rellena ningún campo', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <AddPublication />
                </BrowserRouter>);
            });

            const button = screen.getByRole('button', { name: 'Añadir publicación' });

            await act(async () => {
                fireEvent.click(button);
            });

            await waitFor(async () => {
                const toastText = await screen.findByText("Falta completar algún campo obligatorio");
                expect(toastText).toBeInTheDocument();
            }, { timeout: 3000 });

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull(), { timeout: 3000 });
        }, 10000);
    });

    test('se suben más de 10 imágenes', async () => {
        global.URL.createObjectURL = jest.fn().mockImplementation((file) => {
            return "https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg";
        });

        await act(async () => {
            render(<BrowserRouter>
                <AddPublication />
            </BrowserRouter>);
        });

        const autoCompleteCountries = screen.getByTestId("countries");
        const autoCompleteCities = screen.getByTestId("cities");

        const countriesInput = autoCompleteCountries.querySelector('input');
        const citiesInput = autoCompleteCities.querySelector('input');

        autoCompleteCountries.focus();
        fireEvent.change(countriesInput, { target: { value: 'a' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        userEvent.click(document.body);

        autoCompleteCities.focus();
        fireEvent.change(citiesInput, { target: { value: 'k' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        const selectedCitiesChips = autoCompleteCities.querySelectorAll('.MuiAutocomplete-tag');
        const selectedCities = Array.from(selectedCitiesChips).map(chip => chip.textContent.trim());
        const ratingInput = screen.getByTestId("rating").querySelector('input');
        const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

        await act(async () => {
            fireEvent.change(countriesInput);
            fireEvent.change(citiesInput); fireEvent.click(buttonLastMonth);
        });
        fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

        expect(countriesInput.value).toBe('Afganistán');
        expect(ratingInput.value).toBe('0.5');

        expect(countriesInput.value).toBe('Afganistán');
        waitFor(() => expect(selectedCities).toEqual(['Kabul']), { timeout: 3000 });

        const imagesInput = screen.getByTestId("images");
        const files = Array.from({ length: 11 }, (_, index) => new File([new Blob()], `image${index}.png`));

        await new Promise(resolve => setTimeout(resolve, 1000));

        await act(async () => {
            fireEvent.change(imagesInput, { target: { files } });
        });

        const button = screen.getByRole('button', { name: 'Añadir publicación' });

        await act(async () => {
            fireEvent.click(button);
        });

        waitFor(() => expect(screen.queryByText("Puedes subir máximo 10 imágenes.")).toBeInTheDocument(), { timeout: 3000 });
    }, 10000);

    test('se rellenan únicamente los campos obligatorios', async () => {
        await act(async () => {
            render(<BrowserRouter>
                <AddPublication />
            </BrowserRouter>);
        });

        const autoCompleteCountries = screen.getByTestId("countries");
        const autoCompleteCities = screen.getByTestId("cities");

        const countriesInput = autoCompleteCountries.querySelector('input');
        const citiesInput = autoCompleteCities.querySelector('input');

        autoCompleteCountries.focus();
        fireEvent.change(countriesInput, { target: { value: 'a' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        userEvent.click(document.body);

        autoCompleteCities.focus();
        fireEvent.change(citiesInput, { target: { value: 'k' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        const selectedCitiesChips = autoCompleteCities.querySelectorAll('.MuiAutocomplete-tag');
        const selectedCities = Array.from(selectedCitiesChips).map(chip => chip.textContent.trim());
        const ratingInput = screen.getByTestId("rating").querySelector('input');
        const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

        await act(async () => {
            fireEvent.change(countriesInput);
            fireEvent.change(citiesInput); fireEvent.click(buttonLastMonth);
        });
        fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

        expect(countriesInput.value).toBe('Afganistán');
        expect(ratingInput.value).toBe('0.5');

        expect(countriesInput.value).toBe('Afganistán');
        waitFor(() => expect(selectedCities).toEqual(['Kabul']), { timeout: 3000 });

        const button = screen.getByRole('button', { name: 'Añadir publicación' });

        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull();
    }, 10000);

    test('se rellenan los datos obligatorios y opcionales', async () => {
        global.URL.createObjectURL = jest.fn().mockImplementation((file) => {
            return "https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg";
        });

        await act(async () => {
            render(<BrowserRouter>
                <AddPublication />
            </BrowserRouter>);
        });

        const autoCompleteCountries = screen.getByTestId("countries");
        const autoCompleteCities = screen.getByTestId("cities");

        const countriesInput = autoCompleteCountries.querySelector('input');
        const citiesInput = autoCompleteCities.querySelector('input');

        autoCompleteCountries.focus();
        fireEvent.change(countriesInput, { target: { value: 'a' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        userEvent.click(document.body);

        autoCompleteCities.focus();
        fireEvent.change(citiesInput, { target: { value: 'k' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCities, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));

        const selectedCitiesChips = autoCompleteCities.querySelectorAll('.MuiAutocomplete-tag');
        const selectedCities = Array.from(selectedCitiesChips).map(chip => chip.textContent.trim());
        const ratingInput = screen.getByTestId("rating").querySelector('input');
        const descriptionInput = screen.getByTestId("description").querySelector('textarea');
        const buttonLastMonth = screen.getByRole('button', { name: 'Last Month' });

        await act(async () => {
            fireEvent.change(countriesInput);
            fireEvent.change(citiesInput); fireEvent.click(buttonLastMonth);
        });
        fireEvent.click(screen.getByTestId('rating').querySelector(`[value="0.5"]`));

        expect(countriesInput.value).toBe('Afganistán');
        expect(ratingInput.value).toBe('0.5');

        expect(countriesInput.value).toBe('Afganistán');
        waitFor(() => expect(selectedCities).toEqual(['Kabul']), { timeout: 3000 });

        const imagesInput = screen.getByTestId("images");
        const files = Array.from({ length: 11 }, (_, index) => new File([new Blob()], `image${index}.png`));

        await new Promise(resolve => setTimeout(resolve, 1000));

        await act(async () => {
            fireEvent.change(imagesInput, { target: { files } });
        });

        fireEvent.change(descriptionInput, { target: { value: 'Recomiendo hacer este viaje' } });
        expect(descriptionInput.value).toBe('Recomiendo hacer este viaje');

        const button = screen.getByRole('button', { name: 'Añadir publicación' });

        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.queryByText("Falta completar algún campo obligatorio")).toBeNull();
    }, 10000);
});