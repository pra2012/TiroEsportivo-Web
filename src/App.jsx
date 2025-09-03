import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GlobalUploadProvider } from './contexts/GlobalUploadContext';
import Layout from './components/Layout';
import DisclaimerModal from './components/DisclaimerModal';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ComunidadePage from './pages/ComunidadePage';
import AcervoPage from './pages/AcervoPage';
import AtividadesPage from './pages/AtividadesPage';
import ResultadosPage from './pages/ResultadosPage';
import AnalisePage from './pages/AnalisePage';
import PerfilPage from './pages/PerfilPage';
import { Button } from '@/components/ui/button.jsx';
import { Target } from 'lucide-react';
import './App.css';

// Página 404
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Página não encontrada</p>
        <Link to="/">
          <Button>Voltar ao Início</Button>
        </Link>
      </div>
    </div>
  );
}

// Página de Login simples
function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
          <p className="text-gray-600">Acesse sua conta TiroEsportivo</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <Button className="w-full">Entrar</Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Página de Cadastro simples
function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar</h1>
          <p className="text-gray-600">Crie sua conta TiroEsportivo</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <Button className="w-full">Cadastrar</Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Remover o disclaimer automático - agora será controlado pela página da Comunidade
  
  const handleDisclaimerAccept = () => {
    localStorage.setItem('tiroesportivo_disclaimer_accepted', 'true');
  };

  return (
    <GlobalUploadProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/acervo" element={<AcervoPage />} />
              <Route path="/atividades" element={<AtividadesPage />} />
              <Route path="/resultados" element={<ResultadosPage />} />
              <Route path="/analise" element={<AnalisePage />} />
              <Route path="/comunidade" element={<ComunidadePage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </GlobalUploadProvider>
  );
}

export default App;

