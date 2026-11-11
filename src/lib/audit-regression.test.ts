import { describe, expect, it, vi } from 'vitest';
import { parseBRL } from './money';
import { csvCell } from '@/features/backup/csv';
vi.mock('expo-crypto', () => ({ randomUUID: () => crypto.randomUUID() }));
describe('validações ERS', () => {
  it('não aceita dinheiro além da precisão segura', () => {
    expect(parseBRL('999999999999999999999,99')).toBeNull();
    expect(parseBRL('1.234,56')).toBe(123456);
  });
  it('neutraliza fórmulas em CSV sem mudar valores negativos', () => {
    expect(csvCell('=HYPERLINK("exemplo")')).toContain("'=HYPERLINK");
    expect(csvCell('@SUM(1)')).toBe("'@SUM(1)");
    expect(csvCell('-comando')).toBe("'-comando");
    expect(csvCell('-123,45')).toBe('-123,45');
    expect(csvCell('-1+comando')).toBe("'-1+comando");
  });
});
