import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import './App.css';  // Importar o CSS global
import AulasExperimentais from './pages/AulasExperimentais';
import Mensalidades from './pages/Mensalidades';
import Pagamentos from './pages/Pagamentos';
import Relatorios from './pages/Relatorios';
import UsersPermissoes from './pages/UsersPermissoes';
import Modalidades from './pages/Modalidades';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aulasexperimentais" element={<AulasExperimentais />} />
        <Route path="/mensalidades" element={<Mensalidades />} />
        <Route path="/modalidades" element={<Modalidades />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/userpermissoes" element={<UsersPermissoes />} />
      </Routes>
    </Router>
  );
}

export default App;
