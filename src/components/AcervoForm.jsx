import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar, Save, X } from "lucide-react";

export default function AcervoForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    equipamento: "",
    calibre: "",
    tipo: "",
    numero_serie: "",
    numero_sigma: "",
    fabricante: "",
    modelo: "",
    validade_craf: "",
    observacoes: "",
    status: "ativo"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        equipamento: initialData.equipamento || "",
        calibre: initialData.calibre || "",
        tipo: initialData.tipo || "",
        numero_serie: initialData.numero_serie || "",
        numero_sigma: initialData.numero_sigma || "",
        fabricante: initialData.fabricante || "",
        modelo: initialData.modelo || "",
        validade_craf: initialData.validade_craf || "",
        observacoes: initialData.observacoes || "",
        status: initialData.status || "ativo"
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tiposEquipamento = [
    "Pistola",
    "Revolver", 
    "Carabina",
    "Rifle",
    "Espingarda",
    "Outro"
  ];

  const calibresComuns = [
    "9mm",
    ".38",
    ".40",
    ".45",
    ".357",
    ".22",
    ".380",
    "12",
    "20",
    ".308",
    ".30-06"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipamento */}
        <div className="space-y-2">
          <Label htmlFor="equipamento">Equipamento *</Label>
          <Input
            id="equipamento"
            value={formData.equipamento}
            onChange={(e) => handleChange("equipamento", e.target.value)}
            placeholder="Ex: Glock 17, Taurus 85, CBC 8022"
            required
          />
        </div>

        {/* Calibre */}
        <div className="space-y-2">
          <Label htmlFor="calibre">Calibre *</Label>
          <Select value={formData.calibre} onValueChange={(value) => handleChange("calibre", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o calibre" />
            </SelectTrigger>
            <SelectContent>
              {calibresComuns.map(calibre => (
                <SelectItem key={calibre} value={calibre}>
                  {calibre}
                </SelectItem>
              ))}
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {formData.calibre === "outro" && (
            <Input
              placeholder="Digite o calibre"
              value={formData.calibre}
              onChange={(e) => handleChange("calibre", e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposEquipamento.map(tipo => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Número de Série */}
        <div className="space-y-2">
          <Label htmlFor="numero_serie">Número de Série</Label>
          <Input
            id="numero_serie"
            value={formData.numero_serie}
            onChange={(e) => handleChange("numero_serie", e.target.value)}
            placeholder="Ex: ABC123456"
          />
        </div>

        {/* Número Sigma */}
        <div className="space-y-2">
          <Label htmlFor="numero_sigma">Número Sigma</Label>
          <Input
            id="numero_sigma"
            value={formData.numero_sigma}
            onChange={(e) => handleChange("numero_sigma", e.target.value)}
            placeholder="Ex: 12345-67"
          />
        </div>

        {/* Fabricante */}
        <div className="space-y-2">
          <Label htmlFor="fabricante">Fabricante</Label>
          <Input
            id="fabricante"
            value={formData.fabricante}
            onChange={(e) => handleChange("fabricante", e.target.value)}
            placeholder="Ex: Glock, Taurus, CBC"
          />
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            value={formData.modelo}
            onChange={(e) => handleChange("modelo", e.target.value)}
            placeholder="Ex: 17 Gen5, 85, 8022"
          />
        </div>

        {/* Validade CRAF */}
        <div className="space-y-2">
          <Label htmlFor="validade_craf">Validade CRAF</Label>
          <div className="relative">
            <Input
              id="validade_craf"
              type="date"
              value={formData.validade_craf}
              onChange={(e) => handleChange("validade_craf", e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="manutencao">Em Manutenção</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleChange("observacoes", e.target.value)}
          placeholder="Informações adicionais sobre o equipamento..."
          rows={3}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.equipamento || !formData.calibre}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {initialData ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

