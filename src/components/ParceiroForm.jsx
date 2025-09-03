import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, MessageCircle, Instagram, Facebook, Globe, Youtube } from "lucide-react";

export default function ParceiroForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    nome: "",
    descricao: "",
    logo_url: "",
    website_url: "",
    whatsapp: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    ativo: true,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Mock upload - in real implementation, this would upload to a service
      const mockUrl = URL.createObjectURL(file);
      handleChange("logo_url", mockUrl);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload do arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg my-4 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4 border-b pb-3">{initialData ? "Editar" : "Novo"} Parceiro</h3>

      <div className="space-y-2">
        <Label htmlFor="nome" className="font-semibold">Nome do Parceiro *</Label>
        <Input 
          id="nome" 
          value={formData.nome} 
          onChange={e => handleChange("nome", e.target.value)} 
          placeholder="Nome da empresa/parceiro"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao" className="font-semibold">Descrição</Label>
        <Textarea 
          id="descricao" 
          value={formData.descricao} 
          onChange={e => handleChange("descricao", e.target.value)} 
          placeholder="Descrição do parceiro..."
          rows={3} 
        />
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4 border-b pb-2">Contatos e Redes Sociais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="website_url" className="flex items-center gap-2">
                  <Globe className="w-4 h-4"/>Site *
                </Label>
                <Input 
                  id="website_url" 
                  type="url" 
                  value={formData.website_url} 
                  onChange={e => handleChange("website_url", e.target.value)} 
                  placeholder="https://seu-site.com.br" 
                  required 
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4"/>WhatsApp
                </Label>
                <Input 
                  id="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={e => handleChange("whatsapp", e.target.value)} 
                  placeholder="Ex: 5511999999999" 
                />
                <p className="text-xs text-gray-500">Apenas números. Ex: 5511999999999</p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="instagram_url" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4"/>Instagram
                </Label>
                <Input 
                  id="instagram_url" 
                  type="url" 
                  value={formData.instagram_url} 
                  onChange={e => handleChange("instagram_url", e.target.value)} 
                  placeholder="https://instagram.com/seu-perfil" 
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="facebook_url" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4"/>Facebook
                </Label>
                <Input 
                  id="facebook_url" 
                  type="url" 
                  value={formData.facebook_url} 
                  onChange={e => handleChange("facebook_url", e.target.value)} 
                  placeholder="https://facebook.com/sua-pagina" 
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="youtube_url" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4"/>YouTube
                </Label>
                <Input 
                  id="youtube_url" 
                  type="url" 
                  value={formData.youtube_url} 
                  onChange={e => handleChange("youtube_url", e.target.value)} 
                  placeholder="https://youtube.com/seu-canal" 
                />
            </div>
        </div>
      </div>
      
      <div>
         <h4 className="font-semibold text-lg mb-4 border-b pb-2">Mídia</h4>
         <div className="space-y-2">
              <Label htmlFor="logo_url">Logo *</Label>
              <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                {formData.logo_url && (
                  <div className="w-48 h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={formData.logo_url} alt="Preview do logo" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <Label htmlFor="logo-file" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    {isUploading ? "Enviando Logo..." : "Carregar Logo"}
                  </div>
                </Label>
                <Input 
                  id="logo-file" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={isUploading} 
                />
                <p className="text-xs text-gray-500">Ou cole uma URL do logo abaixo</p>
                <Input 
                  id="logo_url" 
                  value={formData.logo_url} 
                  onChange={e => handleChange("logo_url", e.target.value)} 
                  placeholder="https://exemplo.com/logo.jpg" 
                  required
                />
              </div>
            </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="ativo" 
          checked={formData.ativo} 
          onCheckedChange={checked => handleChange("ativo", checked)} 
        />
        <Label htmlFor="ativo">Parceiro Ativo</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isUploading}>
          {initialData ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

