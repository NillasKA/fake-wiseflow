import { createRoot } from 'react-dom/client'
import './stylesheets/Main.css'
import LoginPage from './pages/LoginPage'
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <LoginPage />
    </BrowserRouter>
)
