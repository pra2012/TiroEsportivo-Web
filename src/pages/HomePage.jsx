import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Anuncio, Competicao, Parceiro, Post } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, ArrowRight, Instagram, Facebook, Globe, Youtube, Phone, MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function HomePage() {
  const [anuncios, setAnuncios] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anunciosData, competicoesData, parceirosData, postsData] = await Promise.all([
          Anuncio.list("-created_date", 4),
          Competicao.list("-created_date", 4),
          Parceiro.list("-created_date", 4),
          Post.list("-created_date", 3)
        ]);
        setAnuncios(anunciosData || []);
        setCompeticoes(competicoesData || []);
        setParceiros(parceirosData || []);
        setPosts(postsData || []);
      } catch (error) {
        console.error("Erro ao buscar dados para a home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cleanPhoneNumberForWhatsApp = (phone) => {
    return phone.replace(/\D/g, '');
  };

  const generateWhatsAppLink = (phoneNumber, message) => {
    const cleanNumber = cleanPhoneNumberForWhatsApp(phoneNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Sem data";
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
    } catch {
      return "Data inválida";
    }
  };

  const AnuncioCard = ({ anuncio }) => {
    const defaultMessage = `Olá, tudo bem? Peguei seu contato no site Tiro Esportivo Brasil e gostaria de tirar algumas dúvidas.`;

    return (
      <Card className="flex flex-col overflow-hidden">
        {anuncio.imagem_url && (
          <img src={anuncio.imagem_url} alt={anuncio.titulo} className="w-full h-40 object-cover" />
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{anuncio.titulo}</CardTitle>
          <CardDescription>
            Publicado em {formatDate(anuncio.created_date)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3">
            {anuncio.conteudo}
          </p>
        </CardContent>
        <div className="p-4 border-t flex flex-wrap gap-2">
           {anuncio.whatsapp && (
            <a href={generateWhatsAppLink(anuncio.whatsapp, defaultMessage)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
              </Button>
            </a>
          )}
          {anuncio.telefone && (
            <a href={`tel:${anuncio.telefone}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Ligar
              </Button>
            </a>
          )}
        </div>
      </Card>
    );
  };

  const CompeticaoCard = ({ competicao }) => {
    const getNivelColor = (nivel) => {
        const colors = {
            'Nacional (Nivel 3)': 'bg-red-100 text-red-800',
            'Regional (Nivel 2)': 'bg-yellow-100 text-yellow-800',
            'Habitualidade (Nivel 1)': 'bg-green-100 text-green-800'
        };
        return colors[nivel] || 'bg-gray-100 text-gray-800';
    };

    return (
      <Card className="flex flex-col overflow-hidden">
        {competicao.imagem_url && (
          <img src={competicao.imagem_url} alt={competicao.nome} className="w-full h-40 object-cover" />
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{competicao.nome}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(competicao.data_inicio)}
            {competicao.data_fim && ` - ${formatDate(competicao.data_fim)}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{competicao.local}</span>
          </div>
          {competicao.nivel_competicao && (
              <Badge className={getNivelColor(competicao.nivel_competicao)}>{competicao.nivel_competicao}</Badge>
          )}
        </CardContent>
        <div className="p-4 border-t">
          {competicao.url_inscricao ? (
            <a href={competicao.url_inscricao} target="_blank" rel="noopener noreferrer">
              <Button className="w-full">Inscreva-se</Button>
            </a>
          ) : (
             <Button className="w-full" disabled>Inscrições em breve</Button>
          )}
        </div>
      </Card>
    );
  };

  const ParceiroCard = ({ parceiro }) => (
    <Card className="flex flex-col items-center p-4 text-center">
      <img src={parceiro.logo_url} alt={parceiro.nome} className="w-20 h-20 rounded-full object-contain mb-4" />
      <h3 className="font-semibold">{parceiro.nome}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{parceiro.descricao}</p>
      <a href={parceiro.website_url} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <Button variant="outline">Visitar Site</Button>
      </a>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24 px-4 bg-white">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Controle de Habitualidade, Nivel e Desempenho</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Sua plataforma completa para gerenciamento, competições e comunidade do tiro esportivo.</p>
          <div className="mt-8 flex justify-center gap-4">
              <Link to={createPageUrl("Comunidade")}>
                <Button size="lg">Explorar Comunidade</Button>
              </Link>
              <Link to={createPageUrl("Dashboard")}>
                  <Button size="lg" variant="outline">Meu Painel</Button>
              </Link>
          </div>
      </div>
      
      {/* Latest News/Posts */}
      {posts.length > 0 && (
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Últimas Notícias</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map(post => (
                <Card key={post.id}>
                  {post.imagem_url && <img src={post.imagem_url} alt={post.titulo} className="w-full h-40 object-cover rounded-t-lg" />}
                  <CardHeader>
                    <CardTitle>{post.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{post.conteudo}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Link to={createPageUrl("Comunidade")}>
                        <Button variant="link" className="p-0">Ler mais <ArrowRight className="w-4 h-4 ml-2" /></Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitions Section */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Próximas Competições</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competicoes.map(competicao => <CompeticaoCard key={competicao.id} competicao={competicao} />)}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl("Comunidade", { defaultTab: "competicoes" })}>
                <Button variant="outline">Ver todas as competições <ArrowRight className="w-4 h-4 ml-2"/></Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Anuncios Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Classificados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {anuncios.map(anuncio => <AnuncioCard key={anuncio.id} anuncio={anuncio} />)}
          </div>
          <div className="text-center mt-8">
             <Link to={createPageUrl("Comunidade", { defaultTab: "anuncios" })}>
                 <Button variant="outline">Ver todos os anúncios <ArrowRight className="w-4 h-4 ml-2"/></Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Parceiros Section */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Nossos Parceiros</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {parceiros.map(parceiro => <ParceiroCard key={parceiro.id} parceiro={parceiro} />)}
          </div>
        </div>
      </div>
      
       {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
              <p>&copy; {new Date().getFullYear()} Controle de Habitualidade, Nivel e Desempenho. Todos os direitos reservados.</p>
              <div className="flex justify-center gap-4 mt-4">
                  <Link to={createPageUrl("Home")} className="hover:text-blue-400">Home</Link>
                  <Link to={createPageUrl("Comunidade")} className="hover:text-blue-400">Comunidade</Link>
                  <Link to={createPageUrl("Dashboard")} className="hover:text-blue-400">Painel</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}

