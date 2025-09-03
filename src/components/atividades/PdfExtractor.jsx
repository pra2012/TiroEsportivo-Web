import React, { useState } from 'react';
import { Acervo, Habitualidade } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, Files, AlertCircle, CheckCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PdfExtractor({ onDataExtracted, onProcessing }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progressInfo, setProgressInfo] = useState({ current: 0, total: 0, fileName: '' });
  const [isMinimized, setIsMinimized] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data para demonstração
  const mockExtractedData = {
    competicao_base: {
      nome_competicao: "Campeonato Brasileiro de Tiro Prático",
      etapa: "1ª Etapa",
      nivel_competicao: "NACIONAL",
      data: "2024-03-15",
      clube_organizador: "Clube de Tiro São Paulo",
      cr_entidade: "SP-001-2024",
      confederacao_liga: "CBTP"
    },
    resultados_por_divisao: [
      {
        divisao: "Production",
        tipo_equipamento: "Pistola",
        calibre: "9mm",
        numero_sigma: "12345",
        disparos: 120,
        classificacao: "3º lugar",
        pontuacao: 485.50
      },
      {
        divisao: "Limited",
        tipo_equipamento: "Pistola",
        calibre: ".40",
        numero_sigma: "67890",
        disparos: 100,
        classificacao: "1º lugar",
        pontuacao: 520.75
      },
      {
        divisao: "Open",
        tipo_equipamento: "Pistola",
        calibre: "9mm",
        numero_sigma: "11111",
        disparos: 80,
        classificacao: "2º lugar",
        pontuacao: 510.25
      }
    ]
  };

  const enrichWithAcervoData = async (registrosParaCriar) => {
    try {
      // Mock acervo data
      const mockAcervo = [
        { id: 1, equipamento: "Pistola", calibre: "9mm", numero_sigma: "12345" },
        { id: 2, equipamento: "Pistola", calibre: ".40", numero_sigma: "67890" }
      ];

      const registrosEnriquecidos = [];
      let enriquecidosCount = 0;

      registrosParaCriar.forEach((registro, index) => {
        let equipamentoEncontrado = null;

        // Buscar por número Sigma
        if (registro.sigma && registro.sigma.trim()) {
          equipamentoEncontrado = mockAcervo.find(item => 
            item.numero_sigma === registro.sigma.trim()
          );
        }

        if (equipamentoEncontrado) {
          const registroEnriquecido = {
            ...registro,
            equipamento: equipamentoEncontrado.equipamento,
            calibre: equipamentoEncontrado.calibre,
            sigma: equipamentoEncontrado.numero_sigma,
            _enriquecido_com_acervo: true,
            _equipamento_acervo_id: equipamentoEncontrado.id
          };
          registrosEnriquecidos.push(registroEnriquecido);
          enriquecidosCount++;
        } else {
          registrosEnriquecidos.push({
            ...registro,
            _enriquecido_com_acervo: false
          });
        }
      });

      return {
        registros: registrosEnriquecidos,
        enriquecidosCount,
        detalhes: []
      };
      
    } catch (error) {
      console.error("Erro ao buscar dados do acervo:", error);
      return {
        registros: registrosParaCriar,
        enriquecidosCount: 0,
        detalhes: []
      };
    }
  };

  const processarArquivo = async (file, fileIndex, totalFiles) => {
    setProgressInfo({ 
      current: fileIndex + 1, 
      total: totalFiles, 
      fileName: file.name 
    });

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const extracted = mockExtractedData;

      // Mapear nível da competição
      const mapNivelCompeticao = (nivel) => {
        if (!nivel || typeof nivel !== 'string') return '';
        const lowerNivel = nivel.trim().toLowerCase();

        if (lowerNivel.includes('nacional')) {
          return 'Nacional (Nivel 3)';
        }
        if (lowerNivel.includes('estadual') || lowerNivel.includes('regional')) {
          return 'Regional (Nivel 2)';
        }
        if (lowerNivel.includes('habitualidade')) {
          return 'Habitualidade (Nivel 1)';
        }
        return '';
      };

      const nivelMapeado = mapNivelCompeticao(extracted.competicao_base.nivel_competicao);

      // Criar registros para cada divisão
      const registrosParaCriar = extracted.resultados_por_divisao.map(resultado => ({
        nome_competicao: extracted.competicao_base.nome_competicao || '',
        etapa: extracted.competicao_base.etapa || '',
        nivel_competicao: nivelMapeado,
        data: extracted.competicao_base.data ? extracted.competicao_base.data.split('T')[0] : new Date().toISOString().split('T')[0],
        clube: extracted.competicao_base.clube_organizador || '',
        cr_entidade: extracted.competicao_base.cr_entidade || '',
        confederacao_liga: extracted.competicao_base.confederacao_liga || '',
        divisao: resultado.divisao || '',
        equipamento: resultado.tipo_equipamento || '',
        calibre: resultado.calibre || '',
        sigma: resultado.numero_sigma || '',
        numero_tiros: resultado.disparos && !isNaN(resultado.disparos) ? parseInt(resultado.disparos, 10) : null,
        classificacao: resultado.classificacao || '',
        pontuacao_competicao: resultado.pontuacao && !isNaN(resultado.pontuacao) ? parseFloat(resultado.pontuacao) : null,
        hora: ''
      }));

      console.log('PdfExtractor: Registros criados para', file.name, ':', registrosParaCriar);

      // Enriquecer com dados do acervo
      const { registros: registrosEnriquecidos, enriquecidosCount } = await enrichWithAcervoData(registrosParaCriar);

      console.log('PdfExtractor: Registros enriquecidos:', registrosEnriquecidos);

      return {
        sucesso: true,
        registros: registrosEnriquecidos,
        fileName: file.name,
        divisoes: registrosEnriquecidos.map(r => r.divisao),
        enriquecidosCount
      };

    } catch (err) {
      console.error(`Erro ao processar ${file.name}:`, err);
      return {
        sucesso: false,
        error: `Erro ao processar ${file.name}: ${err.message}`,
        fileName: file.name
      };
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setSuccessMessage('');
    
    // Clear file input
    event.target.value = '';

    try {
      const resultados = [];
      const errosProcessamento = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de arquivo
        if (file.type !== 'application/pdf') {
          errosProcessamento.push(`${file.name}: Apenas arquivos PDF são aceitos.`);
          continue;
        }

        // Validar tamanho (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          errosProcessamento.push(`${file.name}: Arquivo muito grande (máximo 10MB).`);
          continue;
        }

        const resultado = await processarArquivo(file, i, files.length);
        
        if (resultado.sucesso) {
          resultados.push(resultado);
        } else {
          errosProcessamento.push(resultado.error);
        }
      }

      // Processar resultados bem-sucedidos
      if (resultados.length > 0) {
        let totalRegistrosCriados = 0;
        let totalEnriquecidos = 0;

        for (const resultado of resultados) {
          // Mock save to database
          for (const registro of resultado.registros) {
            // Simular criação no banco
            console.log('Criando registro:', registro);
            totalRegistrosCriados++;
            if (registro._enriquecido_com_acervo) {
              totalEnriquecidos++;
            }
          }
        }

        let mensagemSucesso = `✅ Processamento concluído!\n\n`;
        mensagemSucesso += `📄 ${resultados.length} arquivo(s) processado(s) com sucesso\n`;
        mensagemSucesso += `📝 ${totalRegistrosCriados} atividade(s) criada(s)\n`;
        
        if (totalEnriquecidos > 0) {
          mensagemSucesso += `🔗 ${totalEnriquecidos} atividade(s) vinculada(s) ao seu acervo\n`;
        }

        const divisoesUnicas = [...new Set(resultados.flatMap(r => r.divisoes))];
        if (divisoesUnicas.length > 0) {
          mensagemSucesso += `🎯 Divisões encontradas: ${divisoesUnicas.join(', ')}`;
        }

        setSuccessMessage(mensagemSucesso);

        // Notificar componente pai
        if (onDataExtracted) {
          const todosRegistros = resultados.flatMap(r => r.registros);
          console.log('PdfExtractor: Chamando onDataExtracted com', todosRegistros.length, 'registros:', todosRegistros);
          onDataExtracted(todosRegistros);
        } else {
          console.warn('PdfExtractor: onDataExtracted não foi fornecido como prop');
        }
      }

      // Mostrar erros se houver
      if (errosProcessamento.length > 0) {
        const mensagemErro = `⚠️ Alguns arquivos não puderam ser processados:\n\n${errosProcessamento.join('\n')}`;
        
        if (resultados.length === 0) {
          setError(mensagemErro);
        } else {
          setError(`${mensagemErro}\n\n${successMessage}`);
        }
      }

    } catch (error) {
      console.error('Erro geral no processamento:', error);
      setError(`Erro inesperado: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProgressInfo({ current: 0, total: 0, fileName: '' });
      
      if (onProcessing) {
        onProcessing(false);
      }
    }
  };

  return (
    <Card className={`mb-6 transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Files className="w-5 h-5" />
          Extrator de PDF de Competições
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8"
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </Button>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Faça upload de PDFs de comprovantes de competições para extrair automaticamente os dados das atividades.</p>
            <p className="mt-1 text-xs">
              ✅ Suporta múltiplos arquivos • ✅ Máximo 10MB por arquivo • ✅ Vinculação automática com seu acervo
            </p>
          </div>

          {isProcessing && (
            <Alert>
              <Loader2 className="w-4 h-4 animate-spin" />
              <AlertDescription>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    Processando arquivo {progressInfo.current} de {progressInfo.total}
                  </span>
                  <span className="text-sm text-gray-600">
                    {progressInfo.fileName}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm text-green-800">{successMessage}</pre>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Label htmlFor="pdf-files" className="cursor-pointer">
              <div className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}>
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {isProcessing ? "Processando..." : "Selecionar PDFs"}
              </div>
            </Label>
            <Input 
              id="pdf-files" 
              type="file" 
              accept=".pdf" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden" 
              disabled={isProcessing} 
            />
            <p className="text-xs text-gray-500 text-center max-w-md">
              Selecione um ou mais arquivos PDF de comprovantes de competições. 
              O sistema irá extrair automaticamente as informações e criar as atividades correspondentes.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

