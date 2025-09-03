import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Calendar, MapPin, MessageCircle, Phone, Users, Trophy, Megaphone } from "lucide-react";
import DisclaimerModal from "../components/DisclaimerModal";

export default function ComunidadePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const posts = [
    {
      id: 1,
      titulo: "Dicas para Melhorar a Precisão",
      autor: "Carlos Santos",
      data: "2024-01-20",
      conteudo: "Compartilho algumas técnicas que me ajudaram a melhorar minha precisão nos últimos meses...",
      likes: 15,
      comentarios: 8
    },
    {
      id: 2,
      titulo: "Resultado do Campeonato Regional",
      autor: "Maria Silva",
      data: "2024-01-18",
      conteudo: "Parabéns a todos os participantes do campeonato regional! Foi uma competição incrível...",
      likes: 23,
      comentarios: 12
    }
  ];

  const competicoes = [
    {
      id: 1,
      nome: "Campeonato Brasileiro de Tiro Prático",
      data: "2024-03-15",
      local: "São Paulo, SP",
      nivel: "Nacional (Nivel 3)",
      participantes: 150,
      inscricoes_abertas: true
    },
    {
      id: 2,
      nome: "Copa Regional de Tiro Esportivo",
      data: "2024-02-20",
      local: "Rio de Janeiro, RJ",
      nivel: "Regional (Nivel 2)",
      participantes: 80,
      inscricoes_abertas: true
    }
  ];

  const anuncios = [
    {
      id: 1,
      titulo: "Pistola Glock 17 - Seminova",
      preco: "R$ 2.500,00",
      vendedor: "João Oliveira",
      telefone: "11999999999",
      whatsapp: "11999999999",
      data: "2024-01-15"
    },
    {
      id: 2,
      titulo: "Munição .40 S&W - 500 unidades",
      preco: "R$ 800,00",
      vendedor: "Pedro Costa",
      telefone: "11888888888",
      whatsapp: "11888888888",
      data: "2024-01-14"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  const generateWhatsAppLink = (phoneNumber, message) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  // Função para verificar se o disclaimer foi aceito
  const checkDisclaimerAndExecute = (action) => {
    const disclaimerAccepted = localStorage.getItem('tiroesportivo_disclaimer_accepted');
    
    if (!disclaimerAccepted) {
      // Se não foi aceito, mostrar o disclaimer e guardar a ação pendente
      setPendingAction(action);
      setShowDisclaimer(true);
    } else {
      // Se já foi aceito, executar a ação diretamente
      action();
    }
  };

  // Função chamada quando o disclaimer é aceito
  const handleDisclaimerAccept = () => {
    localStorage.setItem('tiroesportivo_disclaimer_accepted', 'true');
    setShowDisclaimer(false);
    
    // Executar a ação pendente se houver
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Função para publicar post (exemplo)
  const handlePublicarPost = () => {
    alert('Post publicado com sucesso!');
    // Aqui você adicionaria a lógica real de publicação
  };

  // Função para publicar anúncio (exemplo)
  const handlePublicarAnuncio = () => {
    alert('Anúncio publicado com sucesso!');
    // Aqui você adicionaria a lógica real de publicação
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comunidade</h1>
          <p className="text-gray-600">Conecte-se com outros atiradores esportivos</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="competicoes" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Competições
            </TabsTrigger>
            <TabsTrigger value="anuncios" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Classificados
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Button 
                    className="w-full"
                    onClick={() => checkDisclaimerAndExecute(handlePublicarPost)}
                  >
                    Criar Nova Postagem
                  </Button>
                </CardHeader>
              </Card>

              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{post.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">Por {post.autor} • {formatDate(post.data)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.conteudo}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{post.likes} curtidas</span>
                      <span>{post.comentarios} comentários</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Curtir</Button>
                      <Button variant="outline" size="sm">Comentar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Competições Tab */}
          <TabsContent value="competicoes" className="mt-6">
            <div className="grid gap-6">
              {competicoes.map(competicao => (
                <Card key={competicao.id}>
                  <CardHeader>
                    <CardTitle>{competicao.nome}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(competicao.data)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {competicao.local}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {competicao.participantes} participantes
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{competicao.nivel}</Badge>
                      {competicao.inscricoes_abertas ? (
                        <Button>Inscrever-se</Button>
                      ) : (
                        <Button disabled>Inscrições Encerradas</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Anúncios Tab */}
          <TabsContent value="anuncios" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Button 
                    className="w-full"
                    onClick={() => checkDisclaimerAndExecute(handlePublicarAnuncio)}
                  >
                    Publicar Anúncio
                  </Button>
                </CardHeader>
              </Card>

              {anuncios.map(anuncio => (
                <Card key={anuncio.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{anuncio.titulo}</span>
                      <span className="text-lg font-bold text-green-600">{anuncio.preco}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">Por {anuncio.vendedor} • {formatDate(anuncio.data)}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {anuncio.whatsapp && (
                        <a 
                          href={generateWhatsAppLink(anuncio.whatsapp, `Olá! Vi seu anúncio "${anuncio.titulo}" e gostaria de mais informações.`)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            WhatsApp
                          </Button>
                        </a>
                      )}
                      {anuncio.telefone && (
                        <a href={`tel:${anuncio.telefone}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Ligar
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onAccept={handleDisclaimerAccept} 
      />
    </div>
  );
}

