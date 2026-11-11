import { useState } from 'react';
import { View } from 'react-native';
import { Sheet } from './Sheet';
import { IconButton } from './IconButton';
import { Text } from './Text';
import { Button } from './Button';
export function HelpButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton icon="help-circle-outline" label="Ajuda" onPress={() => setOpen(true)} />
      <Sheet visible={open} title="Ajuda • ERS Finanças" onClose={() => setOpen(false)}>
        <View style={{ padding: 20, gap: 14 }}>
          <Text>
            Cadastre suas contas e cartões. Use o botão + para receitas, despesas e transferências.
            O extrato permite pesquisar e conferir os lançamentos.
          </Text>
          <Text>
            Em Mais você encontra categorias, vencimentos, recorrências, relatórios, metas,
            orçamentos, temas e backups.
          </Text>
          <Text>
            O banco principal fica neste aparelho. Em Mais → Sincronização na nuvem, entre na mesma
            conta em seus aparelhos para sincronizar pelo Supabase. Sem login, não há sincronização.
          </Text>
          <Text>
            Na web, aguarde o aviso “Aplicativo disponível offline” após o primeiro acesso. Limpar
            os dados do navegador pode apagar os dados locais. Faça backups regularmente.
          </Text>
          <Text>
            Ao sair da conta, os dados locais são apagados após a confirmação. Envie as alterações
            ou exporte um backup antes de sair. Na sincronização, a última edição pelo horário do
            aparelho vence. Mantenha data e hora automáticas.
          </Text>
          <Text>
            Biometria e lembretes de vencimento estão disponíveis apenas no aplicativo nativo. O
            banco local e os backups não são criptografados pelo aplicativo.
          </Text>
          <Button label="Entendi" onPress={() => setOpen(false)} />
        </View>
      </Sheet>
    </>
  );
}
