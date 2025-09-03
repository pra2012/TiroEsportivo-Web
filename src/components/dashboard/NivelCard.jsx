import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Target, Trophy, Activity } from "lucide-react";

const NivelCard = ({ equipmentKey, levelData }) => {
  if (!levelData) return null;

  const { level, progress, displayName, debug } = levelData;

  const getLevelColor = (level) => {
    switch (level) {
      case 3: return "bg-red-100 text-red-800 border-red-200";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1: return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelName = (level) => {
    switch (level) {
      case 3: return "Nacional (Nível 3)";
      case 2: return "Regional (Nível 2)";
      case 1: return "Habitualidade (Nível 1)";
      default: return "Sem Nível";
    }
  };

  const getProgressPercentage = () => {
    if (progress.targetLevel === "Máximo") return 100;
    
    if (progress.habitualities) {
      return Math.min((progress.habitualities.current / progress.habitualities.needed) * 100, 100);
    }
    
    if (progress.trainings && progress.competitions) {
      const trainingProgress = (progress.trainings.current / progress.trainings.needed) * 50;
      const competitionProgress = (progress.competitions.current / progress.competitions.needed) * 50;
      return Math.min(trainingProgress + competitionProgress, 100);
    }
    
    return 0;
  };

  const renderProgressDetails = () => {
    if (progress.targetLevel === "Máximo") {
      return (
        <div className="text-center py-2">
          <p className="text-sm font-medium text-green-600">🎯 Nível máximo atingido!</p>
        </div>
      );
    }

    if (progress.habitualities) {
      return (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Atividades necessárias:</span>
            <span className="font-medium">
              {progress.habitualities.current}/{progress.habitualities.needed}
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <p className="text-xs text-gray-600">
            Faltam {Math.max(0, progress.habitualities.needed - progress.habitualities.current)} atividades para o Nível {progress.targetLevel}
          </p>
        </div>
      );
    }

    if (progress.trainings && progress.competitions) {
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Atividades totais:</span>
              <span className="font-medium">
                {progress.trainings.current}/{progress.trainings.needed}
              </span>
            </div>
            <Progress 
              value={Math.min((progress.trainings.current / progress.trainings.needed) * 100, 100)} 
              className="h-2" 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Competições:</span>
              <span className="font-medium">
                {progress.competitions.current}/{progress.competitions.needed}
              </span>
            </div>
            <Progress 
              value={Math.min((progress.competitions.current / progress.competitions.needed) * 100, 100)} 
              className="h-2 bg-orange-100" 
            />
          </div>
          
          <p className="text-xs text-gray-600">
            Para Nível {progress.targetLevel}: {Math.max(0, progress.trainings.needed - progress.trainings.current)} atividades e {Math.max(0, progress.competitions.needed - progress.competitions.current)} competições
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{displayName}</CardTitle>
          <Badge className={`${getLevelColor(level)} font-medium`}>
            {getLevelName(level)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estatísticas atuais */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium">{debug.totalAtividades}</span>
            </div>
            <p className="text-xs text-gray-500">Atividades</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Target className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium">{debug.treinamentos}</span>
            </div>
            <p className="text-xs text-gray-500">Treinos</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Trophy className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium">{debug.competicoesHab}</span>
            </div>
            <p className="text-xs text-gray-500">Competições</p>
          </div>
        </div>

        {/* Progresso para próximo nível */}
        <div className="border-t pt-3">
          {renderProgressDetails()}
        </div>

        {/* Debug info (opcional - pode ser removido em produção) */}
        {debug.divisoesEncontradas && debug.divisoesEncontradas.length > 0 && (
          <div className="border-t pt-2">
            <p className="text-xs text-gray-500">
              Divisões: {debug.divisoesEncontradas.join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NivelCard;

