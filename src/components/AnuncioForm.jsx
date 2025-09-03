import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image as ImageIcon, Phone, MessageCircle, Instagram, Facebook, Globe, Youtube } from "lucide-react";

export default function AnuncioForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    titulo: "",
    conteudo: "",
    imagem_url: "",
    arquivo_url: "",
    telefone: "",
    whatsapp: "",
    instagram_url: "",
    facebook_url: "",
    website_url: "",
    youtube_url: ""
  });
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    if (fileType === 'image') {
      setIsUploadingImage(true);
    } else {
      setIsUploadingPdf(true);
    }

    try {
      // Mock upload - in real implementation, this would upload to a service
      const mockUrl = URL.createObjectURL(file);
      
      if (fileType === 'image') {
        handleChange("imagem_url", mockUrl);
      } else {
        handleChange("arquivo_url", mockUrl);
      }
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload do arquivo. Tente novamente.");
    } finally {
        if (fileType === 'image') {
          setIsUploadingImage(false);
        } else {
          setIsUploadingPdf(false);
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg my-4 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4 border-b pb-3">{initialData ? "Editar" : "Novo"} Anúncio</h3>
      
      <div className="space-y-2">
        <Label htmlFor="titulo" className="font-semibold">Título *</Label>
        <Input 
          id="titulo" 
          value={formData.titulo} 
          onChange={e => handleChange("titulo", e.target.value)} 
          placeholder="Título do anúncio"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="conteudo" className="font-semibold">Conteúdo *</Label>
        <Textarea 
          id="conteudo" 
          value={formData.conteudo} 
          onChange={e => handleChange("conteudo", e.target.value)} 
          placeholder="Descreva seu anúncio..."
          required 
          rows={5} 
        />
      </div>
      
      <div>
        <h4 className="font-semibold text-lg mb-4 border-b pb-2">Contatos e Redes Sociais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4"/>Telefone
                </Label>
                <Input 
                  id="telefone" 
                  value={formData.telefone} 
                  onChange={e => handleChange("telefone", e.target.value)} 
                  placeholder="(XX) XXXX-XXXX" 
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
                <Label htmlFor="website_url" className="flex items-center gap-2">
                  <Globe className="w-4 h-4"/>Site
                </Label>
                <Input 
                  id="website_url" 
                  type="url" 
                  value={formData.website_url} 
                  onChange={e => handleChange("website_url", e.target.value)} 
                  placeholder="https://seu-site.com.br" 
                />
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
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imagem_url">Imagem (opcional)</Label>
              <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                {formData.imagem_url && (
                  <div className="w-full h-32 border rounded-lg overflow-hidden">
                    <img src={formData.imagem_url} alt="Preview do anúncio" className="w-full h-full object-contain" />
                  </div>
                )}
                <Label htmlFor="imagem-file" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    {isUploadingImage ? "Enviando Imagem..." : "Carregar Imagem"}
                  </div>
                </Label>
                <Input 
                  id="imagem-file" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'image')} 
                  className="hidden" 
                  disabled={isUploadingImage} 
                />
                <p className="text-xs text-gray-500">Ou cole uma URL da imagem abaixo</p>
                <Input 
                  id="imagem_url" 
                  value={formData.imagem_url} 
                  onChange={e => handleChange("imagem_url", e.target.value)} 
                  placeholder="https://exemplo.com/imagem.jpg" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arquivo_url">Anexo PDF (opcional)</Label>
               <div className="flex flex-col items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg h-full">
                {formData.arquivo_url && (
                    <a href={formData.arquivo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <FileText className="w-4 h-4" />
                      <span>Ver anexo</span>
                    </a>
                )}
                <Label htmlFor="pdf-file" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                     <Upload className="w-4 h-4" />
                    {isUploadingPdf ? "Enviando PDF..." : "Carregar PDF"}
                  </div>
                </Label>
                 <Input 
                   id="pdf-file" 
                   type="file" 
                   accept=".pdf" 
                   onChange={(e) => handleFileUpload(e, 'pdf')} 
                   className="hidden" 
                   disabled={isUploadingPdf} 
                 />
                 <p className="text-xs text-gray-500">Apenas arquivos .pdf</p>
              </div>
            </div>
         </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isUploadingImage || isUploadingPdf}>
          {initialData ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

