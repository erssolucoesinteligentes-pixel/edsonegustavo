import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import { IconButton } from './IconButton';
import { Text } from './Text';
import { HelpButton } from './HelpButton';

/** Largura máxima do conteúdo em tablets e no navegador. */
export const CONTENT_MAX_WIDTH = 1000;

type Props = ScrollViewProps & {
  title?: string;
  right?: ReactNode;
  /** Mostra o botão de voltar (telas empilhadas, fora das abas). */
  back?: boolean;
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  title,
  right,
  back,
  children,
  refreshing,
  onRefresh,
  contentContainerStyle,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingHorizontal: space.lg,
          paddingTop: insets.top + space.sm,
          paddingBottom: space.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center' }}>
          <Text variant="micro" tone="brand">
            ERS FINANÇAS
          </Text>
          <ScreenHeader title={title} right={right} back={back} />
        </View>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: space.lg, paddingBottom: space.xxxl },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={colors.brand}
            />
          ) : undefined
        }
        {...rest}
      >
        {children}
      </ScrollView>
      <View
        style={{
          paddingVertical: 6,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Text variant="micro" tone="muted" align="center">
          ERS Soluções Inteligentes • Controle financeiro pessoal
        </Text>
      </View>
    </View>
  );
}

export function ScreenHeader({
  title,
  right,
  back,
}: {
  title?: string;
  right?: ReactNode;
  back?: boolean;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: space.xs }}>
        {back && (
          <IconButton
            icon="chevron-back"
            label="Voltar"
            style={{ marginLeft: -space.md }}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        )}
        {title ? (
          <Text
            variant="title"
            accessibilityRole="header"
            numberOfLines={1}
            style={{ flexShrink: 1 }}
          >
            {title}
          </Text>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        {right}
        <HelpButton />
      </View>
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="heading" accessibilityRole="header">
        {title}
      </Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.lg,
    gap: space.lg,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
    marginBottom: -space.xs,
  },
});
