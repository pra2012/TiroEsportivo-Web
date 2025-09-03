import React, { useState, useEffect } from "react";
import { Acervo } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Package, Search, Calendar, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AcervoForm from "../components/AcervoForm";

export default function AcervoPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadEquipamentos();
  }, []);

  const loadEquipamentos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await Acervo.list("-created_date");
      setEquipamentos(data || []);
      setSelectedIds([]);
    } catch (error) {
      console.error("Erro ao carregar acervo:", error);
      setError("Erro ao carregar equipamentos. Verifique sua conexão.");
      setEquipamentos([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await Acervo.update(editingItem.id, data);
      } else {
        await Acervo.create(data);
      }
      setShowForm(false);
      setEditingItem(null);
      loadEquipamentos();
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      setError("Erro ao salvar equipamento. Tente novamente.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.")) {
      setDeletingId(id);
      try {
        await Acervo.delete(id);
        loadEquipamentos();
      } catch (error) {
        console.error("Erro ao excluir equipamento:", error);
        setError("Erro ao excluir equipamento. Tente novamente.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir os ${selectedIds.length} equipamentos selecionados?`)) {
      setDeletingId('bulk');
      try {
        const results = await Promise.allSettled(selectedIds.map(id => Acervo.delete(id)));
        
        const failedDeletions = results.filter(result => result.status === 'rejected');
        if (failedDeletions.length > 0) {
            console.error("Erros ao excluir múltiplos equipamentos:", failedDeletions);
            setError(`Ocorreu um erro ao excluir ${failedDeletions.length} dos ${selectedIds.length} equipamentos.`);
        }
        
        loadEquipamentos();
      } catch (error) {
        console.error("Erro crítico ao iniciar exclusão em massa:", error);
        setError("Ocorreu um erro ao tentar excluir os equipamentos.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredEquipamentos.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const filteredEquipamentos = equipamentos.filter(item =>
    item.equipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.calibre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidadeVencida = (dataValidade) => {
    if (!dataValidade) return false;
    try {
      return parseISO(dataValidade) < new Date();
    } catch {
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sem data";
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Acervo</h1>
            <p className="text-gray-500 mt-1">Gerencie seus equipamentos e documentações</p>
          </div>
          {selectedIds.length > 0 ? (
            <Button 
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deletingId === 'bulk'}
            >
              {deletingId === 'bulk' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Excluir ({selectedIds.length})
            </Button>
          ) : (
            <Button 
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Equipamento
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Editar Equipamento' : 'Novo Equipamento'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AcervoForm
                initialData={editingItem}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por equipamento, calibre ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando equipamentos...</p>
          </div>
        ) : (
          <>
            {filteredEquipamentos.length > 0 && (
              <div className="flex items-center gap-2 mb-4 px-2">
                  <Checkbox
                      id="select-all"
                      checked={filteredEquipamentos.length > 0 && selectedIds.length === filteredEquipamentos.length}
                      onCheckedChange={handleSelectAll}
                      disabled={filteredEquipamentos.length === 0 || !!deletingId}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium">
                      {selectedIds.length > 0 ? `${selectedIds.length} selecionado(s)` : 'Selecionar tudo'}
                  </Label>
              </div>
            )}
            <div className="grid gap-4">
              {filteredEquipamentos.map((item) => (
                <Card 
                    key={item.id} 
                    className={`hover:shadow-md transition-shadow ${selectedIds.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
                >
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
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.equipamento}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">
                              Calibre: {item.calibre}
                            </Badge>
                            {item.tipo && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Tipo: {item.tipo}
                              </Badge>
                            )}
                            {item.numero_sigma && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                Nº Sigma: {item.numero_sigma}
                              </Badge>
                            )}
                            {item.validade_craf && (
                              <Badge 
                                variant="outline"
                                className={
                                  isValidadeVencida(item.validade_craf)
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                CRAF: {formatDate(item.validade_craf)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start md:self-center">
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
          </>
        )}

        {filteredEquipamentos.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum equipamento encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Tente alterar os termos de busca" : "Comece adicionando seu primeiro equipamento"}
              </p>
              {!searchTerm && (
                <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Equipamento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

