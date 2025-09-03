import React, { useState, useEffect } from "react";
import { Habitualidade, Acervo } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Target, Search, Activity, Calendar, Clock, X, Trash2, Loader2 } from "lucide-react";
import { formatDateBR } from "@/utils";
import PdfExtractor from "../components/atividades/PdfExtractor";

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState([]);
  const [acervo, setAcervo] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Mock data para demonstração
      const mockAtividades = [
        {
          id: 1,
          data: "2024-01-15",
          hora: "14:30",
          clube: "Clube de Tiro São Paulo",
          nome_competicao: "Campeonato Paulista de Tiro Esportivo",
          etapa: "1ª Etapa",
          divisao: "Production",
          equipamento: "Pistola",
          calibre: "9mm",
          numero_tiros: 120,
          nivel_competicao: "Regional (Nivel 2)",
          classificacao: "3º lugar",
          pontuacao_competicao: 485.50
        },
        {
          id: 2,
          data: "2024-01-20",
          hora: "09:00",
          clube: "Clube de Tiro Rio de Janeiro",
          nome_competicao: null,
          etapa: null,
          divisao: "Limited",
          equipamento: "Pistola",
          calibre: ".40",
          numero_tiros: 100,
          nivel_competicao: "Habitualidade (Nivel 1)",
          classificacao: null,
          pontuacao_competicao: null
        },
        {
          id: 3,
          data: "2024-02-01",
          hora: "16:00",
          clube: "Clube de Tiro Brasília",
          nome_competicao: "Copa Brasil de Tiro Prático",
          etapa: "Final",
          divisao: "Open",
          equipamento: "Pistola",
          calibre: "9mm",
          numero_tiros: 150,
          nivel_competicao: "Nacional (Nivel 3)",
          classificacao: "1º lugar",
          pontuacao_competicao: 520.75
        }
      ];

      const mockAcervo = [
        { id: 1, tipo: "Pistola", calibre: "9mm", fabricante: "Taurus", modelo: "PT92" },
        { id: 2, tipo: "Pistola", calibre: ".40", fabricante: "Glock", modelo: "G22" },
        { id: 3, tipo: "Revolver", calibre: ".38", fabricante: "Taurus", modelo: "RT82" }
      ];

      setAtividades(mockAtividades);
      setAcervo(mockAcervo);
      setSelectedIds([]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem && editingItem.id) {
        // Mock update
        setAtividades(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...data } : item
        ));
      } else {
        // Mock create
        const newItem = {
          id: Date.now(),
          ...data
        };
        setAtividades(prev => [newItem, ...prev]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
      setDeletingId(id);
      try {
        // Mock delete
        setAtividades(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Erro ao excluir atividade:", error);
        alert("Não foi possível excluir a atividade. Tente novamente.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir as ${selectedIds.length} atividades selecionadas?`)) {
      setDeletingId('bulk');
      try {
        // Mock bulk delete
        setAtividades(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        alert(`${selectedIds.length} atividades foram excluídas com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir atividades:", error);
        alert("Ocorreu um erro ao tentar excluir as atividades. Tente novamente.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Função para lidar com dados extraídos do PDF
  const handleDataExtracted = (extractedDataArray) => {
    console.log('handleDataExtracted chamada com:', extractedDataArray);
    
    if (!extractedDataArray || !Array.isArray(extractedDataArray)) {
      console.error('Dados extraídos inválidos:', extractedDataArray);
      return;
    }

    if (extractedDataArray.length === 0) {
      console.warn('Nenhum dado foi extraído do PDF');
      return;
    }
    
    // Adicionar os dados extraídos à lista de atividades
    const newActivities = extractedDataArray.map((data, index) => {
      console.log(`Processando atividade ${index + 1}:`, data);
      return {
        id: Date.now() + index + Math.random() * 1000, // ID mais único
        ...data
      };
    });
    
    console.log('Novas atividades criadas:', newActivities);
    
    setAtividades(prev => {
      const updated = [...newActivities, ...prev];
      console.log('Lista de atividades atualizada. Total:', updated.length);
      return updated;
    });
    
    // Mostrar notificação de sucesso
    alert(`${newActivities.length} atividade(s) criada(s) com sucesso a partir do PDF!`);
  };

  const filteredAtividades = atividades.filter(item =>
    item.clube?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.divisao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.equipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nome_competicao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredAtividades.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const getNivelColor = (nivel) => {
    const colors = {
      'Nacional (Nivel 3)': 'bg-red-100 text-red-800',
      'Regional (Nivel 2)': 'bg-yellow-100 text-yellow-800',
      'Habitualidade (Nivel 1)': 'bg-green-100 text-green-800'
    };
    return colors[nivel] || 'bg-gray-100 text-gray-800';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Sem data";
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
    } catch (error) {
      console.error("Erro ao formatar data:", error, "Data string:", dateString);
      return "Data inválida";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Atividades</h1>
            <p className="text-gray-500 mt-1">Gerencie suas sessões de treino e habitualidades</p>
          </div>
          <Button
            onClick={() => { setEditingItem(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Atividade
          </Button>
        </div>

        {/* Componente de upload de PDF sempre visível na página */}
        <PdfExtractor
          onDataExtracted={handleDataExtracted}
        />

        {showForm && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>
                {editingItem?.id ? 'Editar Atividade' : 'Nova Atividade'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                handleSubmit(data);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      name="data"
                      type="date"
                      defaultValue={editingItem?.data || ""}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      name="hora"
                      type="time"
                      defaultValue={editingItem?.hora || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clube">Clube</Label>
                    <Input
                      id="clube"
                      name="clube"
                      defaultValue={editingItem?.clube || ""}
                      placeholder="Nome do clube"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipamento">Equipamento</Label>
                    <Input
                      id="equipamento"
                      name="equipamento"
                      defaultValue={editingItem?.equipamento || ""}
                      placeholder="Pistola, Revolver, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="calibre">Calibre</Label>
                    <Input
                      id="calibre"
                      name="calibre"
                      defaultValue={editingItem?.calibre || ""}
                      placeholder="9mm, .40, .38, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="divisao">Divisão</Label>
                    <Input
                      id="divisao"
                      name="divisao"
                      defaultValue={editingItem?.divisao || ""}
                      placeholder="Production, Limited, Open, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero_tiros">Número de Tiros</Label>
                    <Input
                      id="numero_tiros"
                      name="numero_tiros"
                      type="number"
                      defaultValue={editingItem?.numero_tiros || ""}
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nome_competicao">Nome da Competição (opcional)</Label>
                    <Input
                      id="nome_competicao"
                      name="nome_competicao"
                      defaultValue={editingItem?.nome_competicao || ""}
                      placeholder="Nome da competição"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingItem?.id ? 'Atualizar' : 'Criar'} Atividade
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar por clube, divisão, equipamento, competição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              {selectedIds.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete} disabled={!!deletingId}>
                  {deletingId === 'bulk' ? (
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2"/>
                  )}
                  Excluir ({selectedIds.length})
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
        
        {filteredAtividades.length > 0 && (
          <div className="flex items-center gap-2 mb-4 px-2">
              <Checkbox
                  id="select-all"
                  checked={filteredAtividades.length > 0 && selectedIds.length === filteredAtividades.length}
                  onCheckedChange={handleSelectAll}
                  disabled={filteredAtividades.length === 0 || !!deletingId}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                  {selectedIds.length > 0 ? `${selectedIds.length} selecionado(s)` : 'Selecionar tudo'}
              </Label>
          </div>
        )}

        <div className="grid gap-4">
          {filteredAtividades.map((item) => (
            <Card key={item.id} className={`hover:shadow-md transition-all ${selectedIds.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelect(item.id)}
                        disabled={!!deletingId}
                      />
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          {formatDateBR(item.data)}
                        </span>
                        {item.hora && (
                          <>
                            <Clock className="w-4 h-4 text-gray-500 ml-2" />
                            <span>{item.hora}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.nome_competicao ? `${item.nome_competicao}${item.etapa ? ` - ${item.etapa}` : ''}` : item.clube}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.divisao && (
                           <Badge variant="secondary">{item.divisao}</Badge>
                        )}
                        <Badge variant="outline">{item.equipamento}</Badge>
                        <Badge variant="outline">{item.calibre}</Badge>
                        {item.numero_tiros && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {item.numero_tiros} disparos
                          </Badge>
                        )}
                        {item.nivel_competicao && (
                          <Badge className={getNivelColor(item.nivel_competicao)}>
                            {item.nivel_competicao}
                          </Badge>
                        )}
                        {item.classificacao && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Classificação: {item.classificacao}
                          </Badge>
                        )}
                        {item.pontuacao_competicao && (
                           <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Pontuação: {item.pontuacao_competicao.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      disabled={!!deletingId}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={!!deletingId}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAtividades.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma atividade encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Tente alterar os termos de busca" : "Comece registrando sua primeira atividade"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primeira Atividade
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

