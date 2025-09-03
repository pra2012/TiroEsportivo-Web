import React, { useState, useEffect, useCallback } from "react";
import { Acervo, Habitualidade } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Target, Activity, Trophy, Calendar, AlertCircle } from "lucide-react";
import { format, subMonths, isAfter, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NivelCard from "../components/dashboard/NivelCard";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    acervo: 0,
    habitualidades: 0, // Now represents training sessions
    competicoes: 0,    // Now represents competition habitualities
    totalAtividades: 0, // Sum of all habitualities (trainings + competitions)
  });
  const [resumoData, setResumoData] = useState([]);
  const [levelsByEquipment, setLevelsByEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultimasAtividades, setUltimasAtividades] = useState([]);
  const [periodoMeses, setPeriodoMeses] = useState(12);

  const calculateLevelsByEquipment = useCallback((habitualidades, mesesAtras = 12) => {
    // Função para normalizar calibres similares
    const normalizeCalibre = (calibre) => {
      if (!calibre || typeof calibre !== 'string') return '';
      
      const normalized = calibre.trim().toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\.]/g, ''); // Remove caracteres especiais exceto pontos
      
      // Mapeamento de calibres equivalentes
      const calibreMap = {
        // 9mm variations
        '9mm': '9mm',
        '9x19': '9mm',
        '9x19 parabellum': '9mm',
        '9 mm': '9mm',
        '9': '9mm',
        '9x19mm': '9mm',
        '9x19mm parabellum': '9mm',
        
        // .38 variations
        '.38': '.38',
        '38': '.38',
        '.38 spl': '.38',
        '.38 special': '.38',
        '38 special': '.38',
        
        // .40 variations
        '.40': '.40',
        '40': '.40',
        '.40 sw': '.40',
        '.40 s&w': '.40',
        '40 sw': '.40',
        
        // .45 variations
        '.45': '.45',
        '45': '.45',
        '.45 acp': '.45',
        '45 acp': '.45',
        
        // .357 variations
        '.357': '.357',
        '357': '.357',
        '.357 magnum': '.357',
        '357 magnum': '.357',
        
        // .22 variations
        '.22': '.22',
        '22': '.22',
        '.22 lr': '.22',
        '22 lr': '.22',

        // .380 variations
        '.380': '.380',
        '380': '.380',
        '.380 acp': '.380',
        '380 acp': '.380',
      };
      
      return calibreMap[normalized] || normalized;
    };

    // Função melhorada para normalizar equipamentos
    const normalizeEquipamento = (equipamento) => {
      if (!equipamento || typeof equipamento !== 'string') return '';
      
      return equipamento
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s]/g, '') // Remove pontuação exceto espaços e letras/números
        .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
        .replace(/\b(pistol|pistola|revolver|carabina|rifle)\b/g, '') // Remove palavras comuns de tipo
        .trim();
    };

    // 1. Agrupar por tipo genérico (Pistola, Revolver, Carabina) + calibre
    const equipmentMap = new Map();

    habitualidades.forEach(h => {
      if (h.equipamento && h.calibre) {
        const normalizedCalibre = normalizeCalibre(h.calibre);
        
        // Determinar tipo genérico baseado no equipamento
        let tipoGenerico = 'Pistola'; // default
        const equipamentoLower = h.equipamento.toLowerCase();
        
        if (equipamentoLower.includes('revolver')) {
          tipoGenerico = 'Revolver';
        } else if (equipamentoLower.includes('carabina') || equipamentoLower.includes('rifle')) {
          tipoGenerico = 'Carabina';
        }
        
        const uniqueKey = `${tipoGenerico}|${normalizedCalibre}`;
        
        if (!equipmentMap.has(uniqueKey)) {
          equipmentMap.set(uniqueKey, {
            key: uniqueKey,
            display: `${tipoGenerico} ${normalizedCalibre}`,
            tipo: tipoGenerico,
            calibre: normalizedCalibre,
            normalizedTipo: tipoGenerico.toLowerCase(),
            normalizedCalibre: normalizedCalibre
          });
        }
      }
    });

    // 3. Converter Map para Array
    const uniqueEquipments = Array.from(equipmentMap.values());

    console.log('✅ EQUIPAMENTOS AGRUPADOS POR TIPO:', uniqueEquipments.map(e => e.display));

    const calculatedLevels = {};
    
    const dataLimite12m = subMonths(new Date(), 12);
    const dataLimitePeriodo = subMonths(new Date(), mesesAtras);

    // 4. Calcular níveis para cada tipo de equipamento único
    uniqueEquipments.forEach(equipment => {
        // Filtrar atividades por tipo genérico e calibre
        const habsForEquipment = habitualidades.filter(h => {
          const normalizedCalibre = normalizeCalibre(h.calibre);
          
          // Determinar tipo genérico da atividade
          let tipoGenerico = 'Pistola';
          const equipamentoLower = h.equipamento?.toLowerCase() || '';
          
          if (equipamentoLower.includes('revolver')) {
            tipoGenerico = 'Revolver';
          } else if (equipamentoLower.includes('carabina') || equipamentoLower.includes('rifle')) {
            tipoGenerico = 'Carabina';
          }
          
          return tipoGenerico.toLowerCase() === equipment.normalizedTipo && 
                 normalizedCalibre === equipment.normalizedCalibre;
        });
        
        console.log(`🔫 ${equipment.display}: ${habsForEquipment.length} atividades TOTAIS`);
        
        // Filtrar por 12 meses para cálculo do nível (sempre)
        const habs12m = habsForEquipment.filter(h => h.data && isAfter(parseISO(h.data), dataLimite12m));
        
        // Filtrar por período selecionado para exibição de dados adicionais
        const habsPeriodo = habsForEquipment.filter(h => h.data && isAfter(parseISO(h.data), dataLimitePeriodo));
        
        // CÁLCULO DO NÍVEL: Sempre baseado em 12 meses
        const treinamentos12m = habs12m.filter(h => !h.nome_competicao);
        const competicoes12m = habs12m.filter(h => h.nome_competicao);

        const treinamentosCount12m = treinamentos12m.length;
        const competicoesHabCount12m = competicoes12m.length;
        const totalCompeticoes12m = competicoesHabCount12m;
        const totalTreinamentosECompeticoes12m = treinamentosCount12m + competicoesHabCount12m;
        
        // DADOS INFORMATIVOS: Do período selecionado
        const treinamentosPeriodo = habsPeriodo.filter(h => !h.nome_competicao);
        const competicoesPeriodo = habsPeriodo.filter(h => h.nome_competicao);

        const treinamentosCountPeriodo = treinamentosPeriodo.length;
        const competicoesHabCountPeriodo = competicoesPeriodo.length;
        const totalCompeticoesPeriodo = competicoesHabCountPeriodo;
        const totalTreinamentosECompeticoesPeriodo = treinamentosCountPeriodo + competicoesHabCountPeriodo;

        let currentLevel = 0;
        const progress = {};

        // Critérios de nível SEMPRE baseados em 12 meses
        if (totalTreinamentosECompeticoes12m >= 20 && totalCompeticoes12m >= 6) {
          currentLevel = 3;
        } else if (totalTreinamentosECompeticoes12m >= 12 && totalCompeticoes12m >= 4) {
          currentLevel = 2;
        } else if (totalTreinamentosECompeticoes12m >= 8) {
          currentLevel = 1;
        }
        
        if (currentLevel === 3) {
          progress.targetLevel = "Máximo";
          progress.message = "Você atingiu o nível máximo!";
        } else if (currentLevel === 2) {
          progress.targetLevel = 3;
          progress.trainings = { current: totalTreinamentosECompeticoes12m, needed: 20 };
          progress.competitions = { current: totalCompeticoes12m, needed: 6 };
        } else if (currentLevel === 1) {
          progress.targetLevel = 2;
          progress.trainings = { current: totalTreinamentosECompeticoes12m, needed: 12 };
          progress.competitions = { current: totalCompeticoes12m, needed: 4 };
        } else {
          progress.targetLevel = 1;
          progress.habitualities = { current: totalTreinamentosECompeticoes12m, needed: 8 };
        }

        calculatedLevels[equipment.key] = {
            level: currentLevel,
            progress: progress,
            displayName: equipment.display,
            tipo: equipment.tipo,
            calibre: equipment.calibre,
            debug: {
                treinamentos: treinamentosCount12m,
                competicoesHab: competicoesHabCount12m,
                competicoesResultados: 0, // Always 0 as results are not included in this calculation
                totalAtividades: totalTreinamentosECompeticoes12m,
                totalCompeticoes: totalCompeticoes12m,
                ...(mesesAtras > 12 && {
                    [`treinamentos_${mesesAtras}m`]: treinamentosCountPeriodo,
                    [`competicoes_${mesesAtras}m`]: competicoesHabCountPeriodo,
                    [`totalAtividades_${mesesAtras}m`]: totalTreinamentosECompeticoesPeriodo,
                    [`totalCompeticoes_${mesesAtras}m`]: totalCompeticoesPeriodo,
                }),
                divisoesEncontradas: [...new Set(habsForEquipment.map(h => h.divisao).filter(Boolean))]
            }
        };

        console.log(`📊 ${equipment.display} - Nível ${currentLevel}:`, {
          atividades12m: totalTreinamentosECompeticoes12m,
          competicoes12m: totalCompeticoes12m,
          divisoes: [...new Set(habsForEquipment.map(h => h.divisao).filter(Boolean))]
        });
    });

    console.log('🎯 Níveis finais calculados:', Object.keys(calculatedLevels));
    setLevelsByEquipment(calculatedLevels);
  }, []); // Removed 'resultados' from dependency array

  const generateResumoData = useCallback((habitualidades) => {
    const dozeUltimosMeses = subMonths(new Date(), 12);

    const dadosRecentes = habitualidades.filter(h => h.data && isAfter(parseISO(h.data), dozeUltimosMeses));

    const resumoPorMes = {};
    
    dadosRecentes.forEach(item => {
      if (!item.data) return;
      const mes = format(parseISO(item.data), 'yyyy-MM');
      if (!resumoPorMes[mes]) {
        resumoPorMes[mes] = {
          mes,
          treinamentos: 0,
          competicoes: 0,
          total: 0
        };
      }
      
      // É uma habitualidade - verificar se é treinamento ou competição
      if (item.nome_competicao) {
        resumoPorMes[mes].competicoes += 1;
      } else {
        resumoPorMes[mes].treinamentos += 1;
      }
      resumoPorMes[mes].total += 1;
    });

    const dataArray = Object.values(resumoPorMes)
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .map(item => ({
        ...item,
        mesNome: format(parseISO(item.mes + '-01'), 'MMM yyyy', { locale: pt })
      }));

    setResumoData(dataArray);
  }, []); // Removed 'resultados' from dependency array

  const formatDate = (dateString) => {
    if (!dateString) return "Sem data";
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return "Data inválida";
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 Recarregando dados e recalculando níveis com nova lógica...');
      const [acervo, habitualidades] = await Promise.all([
        Acervo.list().catch(() => []),
        Habitualidade.list().catch(() => []),
      ]);

      // Separar treinamentos (habitualidades) e competições
      const treinos = habitualidades.filter(h => !h.nome_competicao);
      const competicoes = habitualidades.filter(h => h.nome_competicao);

      setStats({
        acervo: acervo.length,
        habitualidades: treinos.length, // Renamed from 'treinamentos'
        competicoes: competicoes.length, // Renamed from 'competicoes' (now only habitualities)
        totalAtividades: habitualidades.length // Sum of all habitualities
      });

      // RECALCULAR com a nova lógica que ignora divisão
      console.log('📊 Calculando níveis - NOVA LÓGICA: ignorando divisão completamente');
      calculateLevelsByEquipment(habitualidades, periodoMeses);
      generateResumoData(habitualidades);

      // Merge and sort all activities for the "Atividades Recentes" card
      const sortedActivities = [...habitualidades].sort((a, b) => {
        const dateA = a.data ? parseISO(a.data) : new Date(0);
        const dateB = b.data ? parseISO(b.data) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      }).map(h => ({
        ...h,
        type: h.nome_competicao ? 'competicao' : 'treinamento', 
        nomeCompeticao: h.nome_competicao || h.clube 
      }));

      setUltimasAtividades(sortedActivities.slice(0, 5));

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados. Verifique sua conexão com a internet.");
    }
    setIsLoading(false);
  }, [calculateLevelsByEquipment, generateResumoData, periodoMeses]);

  useEffect(() => {
    console.log('🚀 Inicializando Dashboard com nova lógica de cálculo');
    loadData();
  }, [loadData]);

  // Handle period change - força recálculo
  const handlePeriodoChange = (novoMeses) => {
    console.log(`📅 Período alterado para ${novoMeses} meses - recalculando...`);
    setPeriodoMeses(parseInt(novoMeses));
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${color} rounded-full opacity-10`} />
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>
            <CardTitle className="text-3xl font-bold mt-2">
              {value}
            </CardTitle>
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error} Tente recarregar a página.
            </AlertDescription>
          </Alert>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resumo Geral</h1>
          <p className="text-gray-500 mt-1">Visão geral do seu acervo e atividades</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <StatCard 
            title="Equipamentos no Acervo" 
            value={stats.acervo}
            icon={Package}
            color="bg-blue-500"
          />
          <StatCard 
            title="Habitualidades (Treinos)"
            value={stats.habitualidades}
            icon={Target}
            color="bg-green-500"
          />
          <StatCard 
            title="Competições Participadas"
            value={stats.competicoes}
            icon={Trophy}
            color="bg-orange-500"
          />
          <StatCard 
            title="Total de Atividades"
            value={stats.totalAtividades}
            icon={Activity}
            color="bg-purple-500"
          />
        </div>

        {/* Seção de Níveis por Equipamento */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Níveis por Equipamento</h2>
              <p className="text-gray-500 text-sm">Baseado nos últimos 12 meses</p>
            </div>
            <Select value={periodoMeses.toString()} onValueChange={handlePeriodoChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Últimos 12 meses</SelectItem>
                <SelectItem value="24">Últimos 24 meses</SelectItem>
                <SelectItem value="36">Últimos 36 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Calculando níveis...</p>
            </div>
          ) : levelsByEquipment && Object.keys(levelsByEquipment).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(levelsByEquipment).map(([key, levelData]) => (
                <NivelCard key={key} equipmentKey={key} levelData={levelData} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Nenhum equipamento com atividades registradas</p>
                <p className="text-sm text-gray-400">Adicione habitualidades para ver os níveis</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seção de Atividades Recentes e Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500 text-sm">Carregando...</p>
                </div>
              ) : ultimasAtividades.length > 0 ? (
                <div className="space-y-3">
                  {ultimasAtividades.map((atividade) => (
                    <div key={atividade.id || `${atividade.type}-${atividade.data}-${Math.random()}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{atividade.nomeCompeticao || 'Não especificado'}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(atividade.data)}
                          {atividade.divisao && ` - ${atividade.divisao}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {atividade.type === 'treinamento' && atividade.numero_tiros !== undefined && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Target className="w-3 h-3 mr-1" />
                            {atividade.numero_tiros} tiros
                          </Badge>
                        )}
                        {atividade.type === 'competicao' && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            <Trophy className="w-3 h-3 mr-1" />
                            {atividade.etapa || 'Competição'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma atividade recente registrada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Atividade dos Últimos 12 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Carregando dados...</p>
                </div>
              ) : resumoData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resumoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mesNome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="treinamentos" fill="#10b981" name="Treinamentos" />
                    <Bar dataKey="competicoes" fill="#f59e0b" name="Competições" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma atividade registrada nos últimos 12 meses</p>
                  <p className="text-sm">Comece adicionando sessões de treino e competições</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

