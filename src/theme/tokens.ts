/** Identidade ERS: preto, laranja e contraste para uso diário. */
export type Palette = {
  bg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  /** Cor de ação: botões, links, item ativo. */
  brand: string;
  onBrand: string;
  brandSoft: string;
  /** Cartão de saldo. */
  heroBg: string;
  heroText: string;
  heroMuted: string;
  heroLine: string;
  accent: string;
  income: string;
  incomeSoft: string;
  expense: string;
  expenseSoft: string;
  danger: string;
  overlay: string;
  /**
   * Séries de gráfico (entradas x saídas). Azul x âmbar em vez de verde x vermelho:
   * o par passa no teste de daltonismo (deuteranopia/protanopia) nos dois temas.
   */
  chartIn: string;
  chartOut: string;
  /** Série de referência (mês anterior): neutra. */
  chartRef: string;
  grid: string;
};

export const light: Palette = {
  bg: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#ECEFF2',
  border: '#DCE1E6',
  text: '#202429',
  textMuted: '#56616D',
  textSubtle: '#64717D',
  brand: '#B95000',
  onBrand: '#FFFFFF',
  brandSoft: '#FFF0E1',
  heroBg: '#232629',
  heroText: '#FFFFFF',
  heroMuted: '#D3CCC5',
  heroLine: '#FF942D',
  accent: '#B95000',
  income: '#1B8457',
  incomeSoft: '#DDF1E7',
  expense: '#B9423E',
  expenseSoft: '#F7E1DF',
  danger: '#B9423E',
  overlay: 'rgba(8, 20, 24, 0.45)',
  chartIn: '#1A7FB8',
  chartOut: '#D07A1E',
  chartRef: '#9AA6AA',
  grid: '#E6EBEA',
};

export const dark: Palette = {
  bg: '#111315',
  surface: '#1C1F22',
  surfaceMuted: '#25292D',
  border: '#363D43',
  text: '#F3F4F5',
  textMuted: '#ADB5BD',
  textSubtle: '#89959F',
  brand: '#FF942D',
  onBrand: '#201409',
  brandSoft: '#38291D',
  heroBg: '#27211C',
  heroText: '#FFFFFF',
  heroMuted: '#C9B5A3',
  heroLine: '#FF942D',
  accent: '#FF942D',
  income: '#52C48C',
  incomeSoft: '#143327',
  expense: '#EF7B72',
  expenseSoft: '#3A1D1B',
  danger: '#EF7B72',
  overlay: 'rgba(0, 0, 0, 0.6)',
  chartIn: '#3A97D4',
  chartOut: '#C47820',
  chartRef: '#82909A',
  grid: '#30373D',
};

export const font = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

/** Escala tipográfica (tamanho / altura de linha). */
export const type = {
  display: { fontFamily: font.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.8 },
  title: { fontFamily: font.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  heading: { fontFamily: font.bold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  body: { fontFamily: font.medium, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: font.semibold, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: font.medium, fontSize: 13, lineHeight: 18 },
  micro: { fontFamily: font.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.2 },
} as const;

export type TypeVariant = keyof typeof type;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;

/** Raios diferentes por hierarquia: cartão de saldo > superfícies > controles. */
export const radius = { sm: 8, md: 12, lg: 18, xl: 26, pill: 999 } as const;
