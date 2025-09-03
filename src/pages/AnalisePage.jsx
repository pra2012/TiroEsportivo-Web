import React, { useState, useEffect } from "react";
import { Habitualidade } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, BarChart3, PieChart, Award, Target, Activity, AlertCircle } from "lucide-react";
import { format, parseISO, subMonths } from "date-fns";
import { pt } from "date-fns/locale";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function AnalisePage() {
  const [habitualidades, setHabitualidades] = useState([]);
  const [periodoFiltro, setPeriodoFiltro] = useState("12meses");
  const [tipoAnalise, setTipoAnalise] = useState("evolucao_classificacao");
  const [competicaoSelecionada, setCompeticaoSelecionada] = useState("todas");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await Habitualidade.list("-data");
      const competicoes = data.filter(a => a.nome_competicao);
      setHabitualidades(competicoes || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados para análise. Verifique sua conexão.");
      setHabitualidades([]);
    }
    setIsLoading(false);
  };

  const getBaseCompetitionName = (name) => {
    if (!name) return 'Sem Competição';
    
    const baseName = name
      .replace(/^\d+º?\s*/, '')
      .split(/–|-/)[0]
      .replace(/\s*(etapa|fase|final|on-line|online)\s*\d*/gi, '')
      .trim();
    
    return baseName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const filtrarDadosPorPeriodo = (dados) => {
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
        return parseISO(item.data) >= dataLimite;
      } catch (e) {
        console.warn("Invalid date format encountered in data:", item.data, e);
        return false;
      }
    });
  };

  const obterCompeticoes = () => {
    const competicoes = new Set();
    habitualidades.forEach(atividade => {
      if (atividade.nome_competicao) {
        competicoes.add(getBaseCompetitionName(atividade.nome_competicao));
      }
    });
    return Array.from(competicoes).sort();
  };

  const prepararEvolucaoClassificacao = () => {
    const dadosFiltrados = filtrarDadosPorPeriodo(habitualidades)
      .filter(a => a.classificacao && a.nome_competicao && (competicaoSelecionada === 'todas' || getBaseCompetitionName(a.nome_competicao) === competicaoSelecionada));

    const agrupado = dadosFiltrados.reduce((acc, atividade) => {
      const nomeCompeticao = getBaseCompetitionName(atividade.nome_competicao);
      if (!acc[nomeCompeticao]) {
        acc[nomeCompeticao] = [];
      }
      
      const etapaInfo = atividade.etapa || 'Etapa Única';
      const dataFormatted = format(parseISO(atividade.data), 'dd/MM', { locale: pt });
      const label = `${etapaInfo} (${dataFormatted})`;
      
      acc[nomeCompeticao].push({
        data: atividade.data,
        classificacao: parseInt(atividade.classificacao.match(/\d+/)?.[0]) || 0,
        label: label,
        dataOriginal: atividade.data,
        etapaOriginal: atividade.etapa
      });
      return acc;
    }, {});

    Object.keys(agrupado).forEach(comp => {
      agrupado[comp].sort((a, b) => {
        const dateA = parseISO(a.dataOriginal);
        const dateB = parseISO(b.dataOriginal);
        return dateA.getTime() - dateB.getTime();
      });
      
      const seen = new Set();
      agrupado[comp] = agrupado[comp].filter(item => {
        const key = `${item.etapaOriginal}-${item.dataOriginal}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    });
    
    return agrupado;
  };

  const prepararEvolucaoPontuacao = () => {
    const dadosFiltrados = filtrarDadosPorPeriodo(habitualidades)
      .filter(a => a.pontuacao_competicao != null && a.nome_competicao && (competicaoSelecionada === 'todas' || getBaseCompetitionName(a.nome_competicao) === competicaoSelecionada));

    const agrupado = dadosFiltrados.reduce((acc, atividade) => {
      const nomeCompeticao = getBaseCompetitionName(atividade.nome_competicao);
      if (!acc[nomeCompeticao]) {
        acc[nomeCompeticao] = [];
      }
      
      const etapaInfo = atividade.etapa || 'Etapa Única';
      const dataFormatted = format(parseISO(atividade.data), 'dd/MM', { locale: pt });
      const label = `${etapaInfo} (${dataFormatted})`;
      
      acc[nomeCompeticao].push({
        data: atividade.data,
        pontuacao: atividade.pontuacao_competicao,
        label: label,
        dataOriginal: atividade.data,
        etapaOriginal: atividade.etapa
      });
      return acc;
    }, {});

    Object.keys(agrupado).forEach(comp => {
      agrupado[comp].sort((a, b) => {
        const dateA = parseISO(a.dataOriginal);
        const dateB = parseISO(b.dataOriginal);
        return dateA.getTime() - dateB.getTime();
      });
      
      const seen = new Set();
      agrupado[comp] = agrupado[comp].filter(item => {
        const key = `${item.etapaOriginal}-${item.dataOriginal}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    });
    
    return agrupado;
  };

  const prepararDesempenhoPorDivisao = () => {
    const atividadesFiltradas = filtrarDadosPorPeriodo(habitualidades).filter(h => h.nome_competicao);
    const competicaoFiltrada = competicaoSelecionada !== "todas"
      ? atividadesFiltradas.filter(a => getBaseCompetitionName(a.nome_competicao) === competicaoSelecionada)
      : atividadesFiltradas;

    const agrupado = competicaoFiltrada.reduce((acc, atividade) => {
      if (atividade.divisao) {
        const divisao = atividade.divisao;
        if (!acc[divisao]) {
          acc[divisao] = { name: divisao, value: 0 };
        }
        acc[divisao].value += 1;
      }
      return acc;
    }, {});

    return Object.values(agrupado);
  };

  const prepararEstatisticas = () => {
    const dadosEvolucaoClassificacao = prepararEvolucaoClassificacao();
    const dadosEvolucaoPontuacao = prepararEvolucaoPontuacao();
    const dadosDesempenhoDivisao = prepararDesempenhoPorDivisao();

    const competicoesComPontuacao = Object.values(dadosEvolucaoPontuacao)
      .flat()
      .map(item => item.pontuacao);

    const totalAtividadesDeCompeticao = filtrarDadosPorPeriodo(habitualidades).filter(h => h.nome_competicao).length;
    const totalCompeticoesUnicas = obterCompeticoes().length;

    const mediaPontuacaoCompeticoes = competicoesComPontuacao.length > 0
      ? competicoesComPontuacao.reduce((sum, val) => sum + val, 0) / competicoesComPontuacao.length
      : 0;

    let melhorClassificacaoGeral = Infinity;
    Object.values(dadosEvolucaoClassificacao).forEach(compDataArray => {
      compDataArray.forEach(item => {
        if (item.classificacao > 0 && item.classificacao < melhorClassificacaoGeral) {
          melhorClassificacaoGeral = item.classificacao;
        }
      });
    });
    melhorClassificacaoGeral = melhorClassificacaoGeral === Infinity ? 0 : melhorClassificacaoGeral;

    const divisaoMaisFrequente = dadosDesempenhoDivisao.length > 0
      ? dadosDesempenhoDivisao.reduce((prev, current) => (prev.value > current.value) ? prev : current, { name: "N/A", value: 0 }).name
      : "N/A";

    return {
      totalCompeticoes: totalCompeticoesUnicas,
      totalAtividadesCompeticao: totalAtividadesDeCompeticao,
      mediaPontuacaoCompeticoes: mediaPontuacaoCompeticoes.toFixed(2),
      melhorClassificacaoGeral,
      divisaoMaisFrequente,
    };
  };

  const dadosEvolucaoClassificacao = prepararEvolucaoClassificacao();
  const dadosEvolucaoPontuacao = prepararEvolucaoPontuacao();
  const dadosDesempenhoDivisao = prepararDesempenhoPorDivisao();
  const estatisticas = prepararEstatisticas();
  const competicoesUnicas = obterCompeticoes();

  const handleTipoAnaliseChange = (value) => {
    setTipoAnalise(value);
    setCompeticaoSelecionada("todas");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0', '#19FFD1'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white border border-gray-300 rounded shadow-md">
          <p className="label">{`${label}`}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getLineColors = () => {
    const colors = {};
    Object.keys(dadosEvolucaoClassificacao).forEach((comp, index) => {
      colors[comp] = COLORS[index % COLORS.length];
    });
    Object.keys(dadosEvolucaoPontuacao).forEach((comp, index) => {
        if (!colors[comp]) {
            colors[comp] = COLORS[(Object.keys(colors).length + index) % COLORS.length];
        }
    });
    return colors;
  };

  const lineColors = getLineColors();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Análise de Desempenho</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Competições</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalCompeticoes}</div>
            <p className="text-xs text-muted-foreground">Competições únicas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Pontuação Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.mediaPontuacaoCompeticoes} pts</div>
            <p className="text-xs text-muted-foreground">Média das pontuações das competições</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Classificação</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas.melhorClassificacaoGeral > 0 ? `${estatisticas.melhorClassificacaoGeral}º` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Sua melhor colocação</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tempos</SelectItem>
            <SelectItem value="12meses">Últimos 12 meses</SelectItem>
            <SelectItem value="24meses">Últimos 24 meses</SelectItem>
            <SelectItem value="36meses">Últimos 36 meses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tipoAnalise} onValueChange={handleTipoAnaliseChange}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Tipo de Análise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="evolucao_classificacao">Evolução de Classificação</SelectItem>
            <SelectItem value="evolucao_pontuacao">Evolução de Pontuação</SelectItem>
            <SelectItem value="desempenho_divisao">Desempenho por Divisão</SelectItem>
          </SelectContent>
        </Select>

        {tipoAnalise !== "desempenho_divisao" && (
          <Select value={competicaoSelecionada} onValueChange={setCompeticaoSelecionada}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Filtrar por Competição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Competições</SelectItem>
              {competicoesUnicas.map(comp => (
                <SelectItem key={comp} value={comp}>{comp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {tipoAnalise === "evolucao_classificacao" && "Evolução de Classificação"}
            {tipoAnalise === "evolucao_pontuacao" && "Evolução de Pontuação"}
            {tipoAnalise === "desempenho_divisao" && "Participações por Divisão"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {tipoAnalise === "desempenho_divisao" ? (
              <RechartsPieChart>
                <Pie
                  data={dadosDesempenhoDivisao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosDesempenhoDivisao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            ) : (
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis reversed={tipoAnalise === "evolucao_classificacao"} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Object.keys(tipoAnalise === "evolucao_classificacao" ? dadosEvolucaoClassificacao : dadosEvolucaoPontuacao).map((comp) => (
                  <Line
                    key={comp}
                    type="monotone"
                    dataKey={tipoAnalise === "evolucao_classificacao" ? "classificacao" : "pontuacao"}
                    data={tipoAnalise === "evolucao_classificacao" ? dadosEvolucaoClassificacao[comp] : dadosEvolucaoPontuacao[comp]}
                    name={comp}
                    stroke={lineColors[comp]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

