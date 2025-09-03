import React, { useState, useEffect } from "react";
import { Habitualidade } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, Search, Calendar, Award, Activity, Target } from "lucide-react";
import { format, parseISO, subMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ResultadosPage() {
  const [competitionActivities, setCompetitionActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");

  useEffect(() => {
    loadData();
  }, []);
  
  const getBaseCompetitionName = (name) => {
    if (!name) return 'Sem Competição';
    const baseName = name.split('-')[0].trim();
    return baseName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const loadData = async () => {
    try {
      const atividadesData = await Habitualidade.list("-data");
      const activities = atividadesData.filter(a => a.nome_competicao);
      setCompetitionActivities(activities || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };
  
  const filtrarPorPeriodo = (dados) => {
    if (periodoFiltro === "todos") return dados;
    const mesesAtras = {
        "12meses": 12,
        "24meses": 24,
        "36meses": 36
    }[periodoFiltro];

    if (!mesesAtras) return dados;

    const dataLimite = subMonths(new Date(), mesesAtras);
    return dados.filter(item => {
        try {
            return item.data && parseISO(item.data) >= dataLimite;
        } catch {
            return false;
        }
    });
  };
  
  const atividadesFiltradasPorPeriodo = filtrarPorPeriodo(competitionActivities);

  const filteredActivities = atividadesFiltradasPorPeriodo.filter(item =>
    item.nome_competicao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.divisao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.equipamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const analisarAtividades = (atividades) => {
    const resumoPorCompeticao = {};

    atividades.forEach(atividade => {
      const nomeBaseCompeticao = getBaseCompetitionName(atividade.nome_competicao);
      
      if (!resumoPorCompeticao[nomeBaseCompeticao]) {
        resumoPorCompeticao[nomeBaseCompeticao] = {
          nome: nomeBaseCompeticao,
          participacoes: [],
          totalTiros: 0,
          totalPontos: 0,
          classificacoes: [],
          datas: []
        };
      }

      const competicao = resumoPorCompeticao[nomeBaseCompeticao];
      
      competicao.participacoes.push(atividade);
      competicao.totalTiros += atividade.numero_tiros || 0;
      competicao.totalPontos += atividade.pontuacao_competicao || 0;
      
      if (atividade.classificacao) {
        competicao.classificacoes.push(atividade.classificacao);
      }
      
      if (atividade.data) {
        competicao.datas.push(atividade.data);
      }
    });

    return Object.values(resumoPorCompeticao).map(competicao => ({
      ...competicao,
      mediaDisparos: competicao.participacoes.length > 0 ? 
        competicao.totalTiros / competicao.participacoes.length : 0,
      mediaPontuacao: competicao.participacoes.length > 0 ?
        competicao.totalPontos / competicao.participacoes.length : 0,
      ultimaParticipacao: competicao.datas.length > 0 ? 
        competicao.datas.sort().reverse()[0] : null
    }));
  };

  const resumoCompeticoes = analisarAtividades(atividadesFiltradasPorPeriodo);

  const getPontuacaoColor = (pontuacao) => {
    if (pontuacao >= 90) return "bg-green-100 text-green-800";
    if (pontuacao >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resultados de Competições</h1>
            <p className="text-gray-500 mt-1">Acompanhe seu desempenho em competições</p>
          </div>
        </div>

        <Tabs defaultValue="resultados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resultados">Meus Resultados</TabsTrigger>
            <TabsTrigger value="analise">Análise Agrupada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resultados" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Buscar por competição, divisão ou equipamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md flex-grow"
                    />
                  </div>
                  <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filtrar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tempos</SelectItem>
                      <SelectItem value="12meses">Últimos 12 meses</SelectItem>
                      <SelectItem value="24meses">Últimos 24 meses</SelectItem>
                      <SelectItem value="36meses">Últimos 36 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {filteredActivities.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">
                            {formatDate(item.data)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.nome_competicao} {item.etapa && `- ${item.etapa}`}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{item.divisao}</Badge>
                          <Badge variant="outline">{item.equipamento}</Badge>
                          {item.pontuacao_competicao && (
                            <Badge className={getPontuacaoColor(item.pontuacao_competicao)}>
                              <Award className="w-3 h-3 mr-1" />
                              {item.pontuacao_competicao.toFixed(2)} pontos
                            </Badge>
                          )}
                          {item.classificacao && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              {item.classificacao}
                            </Badge>
                          )}
                          {item.nivel_competicao && (
                            <Badge className={getNivelColor(item.nivel_competicao)}>
                              {item.nivel_competicao}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum resultado de competição encontrado
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Registre uma atividade e preencha o campo "Nome da Competição" para vê-la aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analise" className="mt-6">
            <div className="grid gap-4">
              {resumoCompeticoes.map((competicao, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {competicao.nome}
                          </h3>
                          {competicao.ultimaParticipacao && (
                            <span className="text-sm text-gray-500">
                              Última participação: {formatDate(competicao.ultimaParticipacao)}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-600">Participações</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{competicao.participacoes.length}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-600">Média de Pontos</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                              {competicao.mediaPontuacao.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-600">Classificações</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {competicao.classificacoes.length > 0 ? (
                                competicao.classificacoes.map((classif, i) => (
                                  <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700">
                                    {classif}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">Sem registro</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes das Participações:</h4>
                          <div className="flex flex-wrap gap-2">
                            {competicao.participacoes.map((participacao, i) => (
                              <div key={i} className="text-xs bg-white border rounded px-2 py-1">
                                {formatDate(participacao.data)} - {participacao.etapa || 'Etapa Única'}
                                {participacao.classificacao && ` (${participacao.classificacao})`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {resumoCompeticoes.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma competição analisada
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Registre atividades com competições na aba "Atividades" para ver as análises aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

