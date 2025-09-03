import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, UserCheck, UserX, Shield, Crown, User, Mail, Phone, Calendar, Trash2, Edit, Plus } from "lucide-react";
import { formatDateBR } from "@/utils";

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterRole, setFilterRole] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data para demonstração
  const mockUsuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      cr: "SP-001-2024",
      data_nascimento: "1985-03-15",
      endereco: "São Paulo, SP",
      role: "admin",
      status: "ativo",
      data_cadastro: "2024-01-15",
      ultimo_acesso: "2024-01-20"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 88888-8888",
      cr: "SP-002-2024",
      data_nascimento: "1990-07-22",
      endereco: "Rio de Janeiro, RJ",
      role: "parceiro",
      status: "ativo",
      data_cadastro: "2024-01-10",
      ultimo_acesso: "2024-01-19"
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      telefone: "(11) 77777-7777",
      cr: "RJ-001-2024",
      data_nascimento: "1988-11-30",
      endereco: "Belo Horizonte, MG",
      role: "user",
      status: "ativo",
      data_cadastro: "2024-01-05",
      ultimo_acesso: "2024-01-18"
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      telefone: "(11) 66666-6666",
      cr: "MG-001-2024",
      data_nascimento: "1992-05-10",
      endereco: "Salvador, BA",
      role: "user",
      status: "inativo",
      data_cadastro: "2023-12-20",
      ultimo_acesso: "2024-01-10"
    }
  ];

  useEffect(() => {
    setUsuarios(mockUsuarios);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'parceiro':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'parceiro':
        return 'Parceiro';
      default:
        return 'Usuário';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'ativo' ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inativo</Badge>
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredUsuarios.map(user => user.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, userId]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== userId));
    }
  };

  const handleChangeStatus = (userId, newStatus) => {
    setUsuarios(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleChangeRole = (userId, newRole) => {
    setUsuarios(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.length === 0) {
      alert("Selecione pelo menos um usuário.");
      return;
    }

    setUsuarios(prev => prev.map(user => 
      selectedIds.includes(user.id) ? { ...user, status: newStatus } : user
    ));
    setSelectedIds([]);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsuarios(prev => prev.filter(user => user.id !== userId));
    }
  };

  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || user.status === filterStatus;
    const matchesRole = filterRole === "todos" || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Gerenciar Usuários
            </h1>
            <p className="text-gray-500 mt-1">Administre usuários, permissões e status das contas</p>
          </div>
          <Button
            onClick={() => { setEditingUser(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou CR..."
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

              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Funções</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="parceiro">Parceiro</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange('ativo')}
                  disabled={selectedIds.length === 0}
                  className="flex-1"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Ativar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange('inativo')}
                  disabled={selectedIds.length === 0}
                  className="flex-1"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Desativar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usuarios.filter(u => u.status === 'ativo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usuarios.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Parceiros</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {usuarios.filter(u => u.role === 'parceiro').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Usuários ({filteredUsuarios.length})
                {selectedIds.length > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • {selectedIds.length} selecionado(s)
                  </span>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">
                      <Checkbox
                        checked={selectedIds.length === filteredUsuarios.length && filteredUsuarios.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4">Usuário</th>
                    <th className="text-left py-3 px-4">Contato</th>
                    <th className="text-left py-3 px-4">CR</th>
                    <th className="text-left py-3 px-4">Função</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Último Acesso</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.nome}</p>
                          <p className="text-sm text-gray-600">{user.endereco}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {user.telefone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{user.cr}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleChangeRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="parceiro">Parceiro</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={user.status}
                          onValueChange={(value) => handleChangeStatus(user.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDateBR(user.ultimo_acesso)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditingUser(user); setShowForm(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado com os filtros aplicados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

