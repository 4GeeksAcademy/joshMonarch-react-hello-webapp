import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 
import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import { Grid } from './views/Grid';
import { NavBar } from './components/NavBar';
import { Details } from './views/Details';
import { StoreProvider } from './components/Contexts/StoreProvider';

const Main = () => {
    return (
        <React.StrictMode>
            <StoreProvider>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route element={<Grid />} path='/' />
                        <Route element={<Details />} path='/details' />
                    </Routes>
                </BrowserRouter>
            </StoreProvider>  
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
