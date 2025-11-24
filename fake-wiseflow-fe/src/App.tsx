// src/App.tsx
import { createRoot } from 'react-dom/client';
import './stylesheets/Main.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPage from "./pages/AdminPage.tsx";
import CreateExam from "./pages/CreateExam.jsx";

function App() {

    return (
        <div className="app-container">
            <main className="main-content">
                { <Header />}
                <Routes>
                    <Route path="/" element={ <HomePage /> }/>
                    <Route path="/admin"  element={ <AdminPage/> } />
              </Routes>
            </main>
            { <Footer /> }
        </div>
    );
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);