import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Loader2, X, Plus } from "lucide-react";

export default function PostForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    titulo: "",
    conteudo: "",
    imagens_urls: []
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
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const currentImages = formData.imagens_urls || [];
    const remainingSlots = 4 - currentImages.length;
    
    if (files.length > remainingSlots) {
      alert(`Você só pode adicionar mais ${remainingSlots} imagem(ns). Máximo 4 fotos por post.`);
      return;
    }

    setIsUploading(true);
    try {
      // Mock upload - in real implementation, this would upload to a service
      const uploadPromises = files.map(file => {
        return new Promise(resolve => {
          const mockUrl = URL.createObjectURL(file);
          setTimeout(() => resolve({ file_url: mockUrl }), 1000);
        });
      });
      
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(result => result.file_url);
      
      handleChange("imagens_urls", [...currentImages, ...newUrls]);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload das imagens. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Limpar o input de arquivos
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = formData.imagens_urls.filter((_, index) => index !== indexToRemove);
    handleChange("imagens_urls", updatedImages);
  };

  const addImageUrl = () => {
    const url = prompt("Cole a URL da imagem:");
    if (url && url.trim()) {
      const currentImages = formData.imagens_urls || [];
      if (currentImages.length >= 4) {
        alert("Máximo de 4 fotos por post.");
        return;
      }
      handleChange("imagens_urls", [...currentImages, url.trim()]);
    }
  };

  const currentImages = formData.imagens_urls || [];

  return (
    <Card className="mb-6">
        <CardHeader>
            <CardTitle>{initialData ? "Editar Post" : "Criar Novo Post"}</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input 
                    id="titulo" 
                    value={formData.titulo} 
                    onChange={e => handleChange("titulo", e.target.value)} 
                    required 
                    placeholder="Um título para seu post" 
                  />
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo *</Label>
                  <Textarea 
                    id="conteudo" 
                    value={formData.conteudo} 
                    onChange={e => handleChange("conteudo", e.target.value)} 
                    required 
                    rows={6} 
                    placeholder="O que você está pensando?"
                  />
              </div>
              
              <div className="space-y-2">
                <Label>Imagens (opcional - máximo 4)</Label>
                
                {/* Exibição das imagens selecionadas */}
                {currentImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {currentImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
                          <img src={url} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botões de ação para adicionar imagens */}
                {currentImages.length < 4 && (
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex gap-3">
                      <Label htmlFor="imagens-file" className="cursor-pointer">
                        <div className={`flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${isUploading ? 'cursor-not-allowed' : ''}`}>
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                          {isUploading ? "Enviando..." : "Carregar Fotos"}
                        </div>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar URL
                      </Button>
                    </div>
                    <Input 
                      id="imagens-file" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      disabled={isUploading} 
                    />
                    <p className="text-xs text-gray-500 text-center">
                      Selecione até {4 - currentImages.length} foto(s) ou adicione URLs
                    </p>
                  </div>
                )}

                {currentImages.length >= 4 && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Máximo de 4 fotos atingido</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {initialData ? "Atualizar" : "Publicar"}
                  </Button>
              </div>
            </form>
        </CardContent>
    </Card>
  );
}

