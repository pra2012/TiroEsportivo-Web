import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DisclaimerModal({ isOpen, onAccept }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-2xl" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Termos e Condições de Uso</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="space-y-4 text-sm text-gray-700">
            <p><strong>Bem vindo a comunidade Tiro Esportivo Brasileiro!</strong> O maior classificados de itens de proteção do Brasil.</p>
            <p>Em conformidade com determinação legal ou regulamentar, todas as armas anunciadas aqui possuem autorização, são de propriedade de pessoas físicas e/ou jurídicas e possuem registro válido no SINARM ou SIGMA.</p>
            <p>A Tiro Esportivo Brasileiro não comercializa armas de fogo, acessórios, munições ou qualquer outro item PCE.</p>
            <p>Nós comercializamos anúncios de publicidade, dentro da legislação vigente. Disponibilizamos aos usuários espaço para que seja exposto à venda armas de fogo com autorização e em conformidade com determinação legal ou regulamentar.</p>
            <p>Não nos responsabilizamos por nenhuma conduta ilegal, e caso tenhamos conhecimento, denunciaremos para os órgãos competentes.</p>
            <p>Para acesso ao site, você deve confirmar e declarar que:</p>
            <p>Preenche todos os requisitos necessários da lei 10.826/03 e demais legislações para compra e venda de arma de fogo. Além disso, se enquadra no Art. 4o da lei 10.826 de 22 de Dezembro de 2003. Ou seja, dentre todos os requisitos necessários, comprova idoneidade e não está respondendo a inquérito policial ou a processo criminal. Comprova também que possui o laudo de capacidade técnica e de aptidão psicológica para o manuseio de arma de fogo, possui residência fixa e ocupação lícita, além de ser maior de 25 anos, atestadas na forma disposta no regulamento desta Lei.</p>
            <p>Para se cadastrar no site é necessário que você envie seu documento de identificação. Para anunciar no site é necessário que você envie o documento (Craf) do item anunciado. Desta forma você comprova que se enquadra no artigo 4º, e preenche todos os requisitos para adquirir ou vender uma arma de fogo.</p>
            <p>É proibido a divulgação e anúncio de munição nessa plataforma.</p>
            <p>A comercialização de armas de fogo e acessórios entre pessoas físicas e jurídicas somente será efetivada mediante autorização do Sinarm ou do Sigma.</p>
            <p>Nunca entregue uma arma de fogo pra terceiros sem a devida transferência autorizada pelos órgãos competentes, seja ele a Polícia Federal ou o Exército, junto aos seus sistemas SINARM e SIGMA.</p>
            <p>Seguimos todas as leis vigentes e as regras do CONAR. Não aceitamos e não fazemos a divulgação e propaganda de uso indiscriminado de arma de fogo. Além disso somos um canal especializado no segmento, e autorizamos o acesso apenas de pessoas capacitadas que acessam o site por livre intenção e vontade.</p>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row items-start sm:items-center pt-4">
          <div className="flex items-start space-x-3 mb-4 sm:mb-0">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={setIsChecked} className="mt-1" />
            <Label htmlFor="terms" className="text-xs sm:text-sm text-gray-600">
              Clique no quadro para confirmar que você leu, está ciente, concorda e se enquadra nos termos citados acima.
            </Label>
          </div>
          <Button
            onClick={onAccept}
            disabled={!isChecked}
            className="w-full sm:w-auto ml-auto"
          >
            Concordo e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

