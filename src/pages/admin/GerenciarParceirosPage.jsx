import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Search, Eye, EyeOff, Plus, Edit, Trash2, Globe, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import ParceiroForm from "../../components/ParceiroForm";
import { formatDateBR } from "@/utils";

export default function GerenciarParceirosPage() {
  const [parceiros, setParceiros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editingParceiro, setEditingParceiro] = useState(null);

  // Mock data para demonstração
  const mockParceiros = [
    {
      id: 1,
      nome: "Clube de Tiro São Paulo",
      descricao: "Clube tradicional de tiro esportivo com mais de 30 anos de história.",
      logo_url: "https://via.placeholder.com/100x60/0066cc/ffffff?text=CTSP",
      website_url: "https://clubetirosaopaulo.com.br",
      whatsapp: "5511999999999",
      instagram_url: "https://instagram.com/clubetirosaopaulo",
      facebook_url: "https://facebook.com/clubetirosaopaulo",
      youtube_url: "https://youtube.com/clubetirosaopaulo",
      ativo: true,
      data_cadastro: "2024-01-15",
      ultima_atualizacao: "2024-01-20"
    },
    {
      id: 2,
      nome: "Armamentos Rio",
      descricao: "Loja especializada em equipamentos para tiro esportivo e caça.",
      logo_url: "https://via.placeholder.com/100x60/cc6600/ffffff?text=AR",
      website_url: "https://armamentosrio.com.br",
      whatsapp: "5521888888888",
      instagram_url: "https://instagram.com/armamentosrio",
      facebook_url: "",
      youtube_url: "",
      ativo: true,
      data_cadastro: "2024-01-10",
      ultima_atualizacao: "2024-01-18"
    },
    {
      id: 3,
      nome: "Academia de Tiro Precision",
      descricao: "Treinamento profissional para competições de tiro esportivo.",
      logo_url: "https://via.placeholder.com/100x60/009900/ffffff?text=ATP",
      website_url: "https://academiaprecision.com.br",
      whatsapp: "5511777777777",
      instagram_url: "https://instagram.com/academiaprecision",
      facebook_url: "https://facebook.com/academiaprecision",
      youtube_url: "https://youtube.com/academiaprecision",
      ativo: false,
      data_cadastro: "2023-12-20",
      ultima_atualizacao: "2024-01-05"
    }
  ];

  useEffect(() => {
    setParceiros(mockParceiros);
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredParceiros.map(parceiro => parceiro.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectParceiro = (parceiroId, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, parceiroId]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== parceiroId));
    }
  };

  const handleChangeStatus = (parceiroId, newStatus) => {
    setParceiros(prev => prev.map(parceiro => 
      parceiro.id === parceiroId ? { ...parceiro, ativo: newStatus } : parceiro
    ));
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.length === 0) {
      alert("Selecione pelo menos um parceiro.");
      return;
    }

    setParceiros(prev => prev.map(parceiro => 
      selectedIds.includes(parceiro.id) ? { ...parceiro, ativo: newStatus } : parceiro
    ));
    setSelectedIds([]);
  };

  const handleDeleteParceiro = (parceiroId) => {
    if (window.confirm("Tem certeza que deseja excluir este parceiro?")) {
      setParceiros(prev => prev.filter(parceiro => parceiro.id !== parceiroId));
    }
  };

  const handleSubmitForm = (formData) => {
    if (editingParceiro) {
      // Editar parceiro existente
      setParceiros(prev => prev.map(parceiro => 
        parceiro.id === editingParceiro.id 
          ? { ...parceiro, ...formData, ultima_atualizacao: new Date().toISOString().split('T')[0] }
          : parceiro
      ));
    } else {
      // Criar novo parceiro
      const newParceiro = {
        id: Date.now(),
        ...formData,
        data_cadastro: new Date().toISOString().split('T')[0],
        ultima_atualizacao: new Date().toISOString().split('T')[0]
      };
      setParceiros(prev => [newParceiro, ...prev]);
    }
    setShowForm(false);
    setEditingParceiro(null);
  };

  const filteredParceiros = parceiros.filter(parceiro => {
    const matchesSearch = parceiro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parceiro.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || 
                         (filterStatus === "ativo" && parceiro.ativo) ||
                         (filterStatus === "inativo" && !parceiro.ativo);
    
    return matchesSearch && matchesStatus;
  });

  const getSocialLinks = (parceiro) => {
    const links = [];
    if (parceiro.website_url) links.push({ icon: Globe, url: parceiro.website_url, label: "Site" });
    if (parceiro.whatsapp) links.push({ icon: MessageCircle, url: `https://wa.me/${parceiro.whatsapp}`, label: "WhatsApp" });
    if (parceiro.instagram_url) links.push({ icon: Instagram, url: parceiro.instagram_url, label: "Instagram" });
    if (parceiro.facebook_url) links.push({ icon: Facebook, url: parceiro.facebook_url, label: "Facebook" });
    if (parceiro.youtube_url) links.push({ icon: Youtube, url: parceiro.youtube_url, label: "YouTube" });
    return links;
  };

  if (showForm) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setEditingParceiro(null); }}
              className="mb-4"
            >
              ← Voltar para Lista
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingParceiro ? "Editar Parceiro" : "Novo Parceiro"}
            </h1>
          </div>
          
          <ParceiroForm
            initialData={editingParceiro}
            onSubmit={handleSubmitForm}
            onCancel={() => { setShowForm(false); setEditingParceiro(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Handshake className="w-8 h-8 text-blue-600" />
              Gerenciar Parceiros
            </h1>
            <p className="text-gray-500 mt-1">Administre parceiros, logos e informações de contato</p>
          </div>
          <Button
            onClick={() => { setEditingParceiro(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Parceiro
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange(true)}
                  disabled={selectedIds.length === 0}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ativar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange(false)}
                  disabled={selectedIds.length === 0}
                  className="flex-1"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Desativar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Handshake className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Parceiros</p>
                  <p className="text-2xl font-bold text-gray-900">{parceiros.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Parceiros Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parceiros.filter(p => p.ativo).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <EyeOff className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Parceiros Inativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parceiros.filter(p => !p.ativo).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Parceiros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Parceiros ({filteredParceiros.length})
                {selectedIds.length > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • {selectedIds.length} selecionado(s)
                  </span>
                )}
              </CardTitle>
              <Checkbox
                checked={selectedIds.length === filteredParceiros.length && filteredParceiros.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredParceiros.map((parceiro) => (
                <div key={parceiro.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(parceiro.id)}
                      onCheckedChange={(checked) => handleSelectParceiro(parceiro.id, checked)}
                    />
                    
                    <div className="w-20 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {parceiro.logo_url ? (
                        <img src={parceiro.logo_url} alt={parceiro.nome} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Handshake className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{parceiro.nome}</h3>
                          <p className="text-sm text-gray-600 mt-1">{parceiro.descricao}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            {getSocialLinks(parceiro).map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                                title={link.label}
                              >
                                <link.icon className="w-4 h-4" />
                              </a>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={parceiro.ativo ? "ativo" : "inativo"}
                            onValueChange={(value) => handleChangeStatus(parceiro.id, value === "ativo")}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditingParceiro(parceiro); setShowForm(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteParceiro(parceiro.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>Cadastrado em {formatDateBR(parceiro.data_cadastro)}</span>
                        <span>Atualizado em {formatDateBR(parceiro.ultima_atualizacao)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredParceiros.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum parceiro encontrado com os filtros aplicados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

