import { createMockServer } from './app';

const port = Number(process.env['PORT'] ?? 3000);
const delayMs = Number(process.env['MOCK_DELAY_MS'] ?? 300);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT debe ser un entero entre 1 y 65535.');
}

if (!Number.isFinite(delayMs) || delayMs < 0) {
  throw new Error('MOCK_DELAY_MS debe ser un número mayor o igual a cero.');
}

createMockServer({ delayMs }).listen(port, '0.0.0.0', () => {
  console.log(`Mock server: http://localhost:${port}/accounts (${delayMs} ms)`);
});
