import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, UserCircle, Phone, Mail, Calendar, MapPin, CreditCard, AlertCircle, LogOut, Shield, MessageSquare, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    foto_url: "",
    numero_cr: "",
    validade_cr: "",
    telefone: "",
    endereco: "",
    data_nascimento: ""
  });
  const [twoFactorData, setTwoFactorData] = useState({
    enabled: false,
    method: "sms",
    phone_verified: false
  });
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Mock user data for demonstration
      const userData = {
        email: "usuario@exemplo.com",
        full_name: "João Silva",
        role: "user",
        tipo_conta: "user",
        foto_url: "",
        numero_cr: "",
        validade_cr: "",
        telefone: "",
        endereco: "",
        data_nascimento: "",
        two_factor_enabled: false,
        two_factor_method: "sms",
        sms_verified: false
      };
      
      setUser(userData);
      setFormData({
        foto_url: userData.foto_url || "",
        numero_cr: userData.numero_cr || "",
        validade_cr: userData.validade_cr || "",
        telefone: userData.telefone || "",
        endereco: userData.endereco || "",
        data_nascimento: userData.data_nascimento || ""
      });
      setTwoFactorData({
        enabled: userData.two_factor_enabled || false,
        method: userData.two_factor_method || "sms",
        phone_verified: userData.sms_verified || false
      });
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setError("Erro ao carregar dados do perfil.");
    }
    setIsLoading(false);
  };

  const generateVerificationCode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const formatPhoneForSMS = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('55') && cleanPhone.length >= 10) {
      return `+${cleanPhone}`;
    }
    
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      return `+55${cleanPhone}`;
    }
    
    return `+55${cleanPhone}`;
  };

  const sendVerificationCode = async () => {
    if (!formData.telefone) {
      setError("Por favor, preencha o número de telefone primeiro nas informações pessoais.");
      return;
    }
    if (!user || !user.email || !user.full_name) {
        setError("Informações do usuário incompletas para enviar o código de verificação.");
        return;
    }

    setIsSending(true);
    setError(null);

    try {
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      const formattedPhone = formatPhoneForSMS(formData.telefone);
      const methodName = twoFactorData.method === 'sms' ? 'SMS' : 'WhatsApp';
      
      // Simulação de envio de código
      console.log(`Código de verificação: ${code} para ${formattedPhone} via ${methodName}`);
      
      setShowVerificationDialog(true);
    } catch (error) {
      console.error("Erro ao enviar código:", error);
      setError(`Erro ao enviar código via ${twoFactorData.method.toUpperCase()}. Tente novamente.`);
    }
    setIsSending(false);
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setError("Por favor, digite o código de verificação.");
      return;
    }

    if (verificationCode.toUpperCase() !== generatedCode) {
      setError("Código inválido. Verifique e tente novamente.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Mock update
      setTwoFactorData(prev => ({
        ...prev,
        enabled: true,
        phone_verified: true
      }));

      setShowVerificationDialog(false);
      setVerificationCode("");
      setGeneratedCode("");
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setError("Erro ao verificar código. Tente novamente.");
    }
    setIsVerifying(false);
  };

  const toggleTwoFactor = async () => {
    if (!twoFactorData.enabled && !twoFactorData.phone_verified) {
      sendVerificationCode();
    } else if (twoFactorData.enabled) {
      try {
        setTwoFactorData(prev => ({
          ...prev,
          enabled: false,
          phone_verified: false
        }));
        setSuccess(true);
        setError(null);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error("Erro ao desabilitar 2FA:", error);
        setError("Erro ao desabilitar autenticação de 2 fatores.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Mock save
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setError("Erro ao salvar perfil. Tente novamente.");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Mock logout
      console.log("Logout realizado");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao fazer logout. Tente novamente.");
    }
    setIsLoggingOut(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Mock file upload
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, foto_url: mockUrl }));
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      setError("Erro ao fazer upload da foto. Tente novamente.");
    }
    setIsUploading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValidadeVencida = (dataValidade) => {
    if (!dataValidade) return false;
    const [year, month, day] = dataValidade.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date < today;
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-500 mt-1">Gerencie suas informações pessoais</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Saindo..." : "Sair"}
          </Button>
        </div>

        {user && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Status da Conta</h3>
                  <p className="text-gray-600">Tipo de acesso e permissões</p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <Badge className={
                    user.role === 'admin' ? "bg-red-100 text-red-800 hover:bg-red-100" :
                    user.tipo_conta === 'parceiro' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }>
                    {user.role === 'admin' ? 'Administrador' :
                     user.tipo_conta === 'parceiro' ? 'Parceiro' : 'Usuário'}
                  </Badge>
                </div>
              </div>
              {user.tipo_conta === 'parceiro' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Conta Parceiro:</strong> Você pode gerenciar anúncios, competições e cadastrar parceiros/lojas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Perfil atualizado com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Autenticação de 2 Fatores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Ativar 2FA</h4>
                <p className="text-sm text-gray-600">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
              <Switch
                checked={twoFactorData.enabled}
                onCheckedChange={toggleTwoFactor}
                disabled={isSending || isVerifying}
              />
            </div>

            {twoFactorData.enabled && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">2FA Ativado</span>
                </div>
                <p className="text-sm text-green-700">
                  Método: {twoFactorData.method === 'sms' ? 'SMS' : 'WhatsApp'}
                </p>
                <p className="text-sm text-green-700">
                  Telefone cadastrado: {formData.telefone || "Não informado"}
                </p>
              </div>
            )}

            {!twoFactorData.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Método de Verificação</Label>
                  <Select
                    value={twoFactorData.method}
                    onValueChange={(value) => setTwoFactorData(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Como funciona:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Toda vez que você fizer login, um código será enviado</li>
                    <li>• O código será enviado via {twoFactorData.method === 'sms' ? 'SMS' : 'WhatsApp'}</li>
                    <li>• Você precisará inserir o código para acessar sua conta</li>
                    <li>• Certifique-se de que seu telefone está correto nas informações pessoais</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Modo de Teste</h5>
                  <p className="text-sm text-yellow-700">
                    Atualmente o código está sendo enviado via email para teste. 
                    O formato do telefone será preparado como: <strong>{formatPhoneForSMS(formData.telefone || 'SeuNúmeroAqui')}</strong>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={formData.foto_url} />
                    <AvatarFallback className="text-lg">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.full_name || 'Nome não informado'}</h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Vinculado à sua conta Google</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_cr" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Número do CR
                  </Label>
                  <Input
                    id="numero_cr"
                    value={formData.numero_cr}
                    onChange={(e) => handleChange("numero_cr", e.target.value)}
                    placeholder="Ex: 12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validade_cr" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Validade do CR
                  </Label>
                  <Input
                    id="validade_cr"
                    type="date"
                    value={formData.validade_cr}
                    onChange={(e) => handleChange("validade_cr", e.target.value)}
                    className={isValidadeVencida(formData.validade_cr) ? "border-red-300 bg-red-50" : ""}
                  />
                  {isValidadeVencida(formData.validade_cr) && (
                    <p className="text-xs text-red-600">⚠️ CR com validade vencida</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data_nascimento" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data de Nascimento
                  </Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleChange("data_nascimento", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço Completo
                  </Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    placeholder="Rua, número, bairro, cidade, CEP"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? "Salvando..." : "Salvar Perfil"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                <strong>Sobre a Segurança:</strong> Suas informações são protegidas e o login é feito via conta Google para maior segurança.
              </p>
              {user?.role === 'user' && (
                <p className="text-sm mt-2">
                  Para se tornar um parceiro e ter permissões de gerenciamento, entre em contato com a administração.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verificar Telefone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Um código de verificação foi enviado para <strong>{formatPhoneForSMS(formData.telefone || '')}</strong> via{' '}
                <strong>{twoFactorData.method === 'sms' ? 'SMS' : 'WhatsApp'}</strong>.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                📧 Temporariamente enviado via email para teste.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de Verificação</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="Digite o código de 6 caracteres"
                maxLength={6}
                disabled={isVerifying}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex-1"
              >
                {isVerifying ? "Verificando..." : "Verificar Código"}
              </Button>
              <Button
                variant="outline"
                onClick={sendVerificationCode}
                disabled={isSending || isVerifying}
              >
                {isSending ? "Enviando..." : "Reenviar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

