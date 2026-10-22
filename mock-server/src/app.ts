import cors from 'cors';
import express from 'express';
import { createAccountRouter } from './account/account.routes';

export function createMockServer({ delayMs = 300 }: { delayMs?: number } = {}) {
  const app = express();

  app.use(cors());
  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use('/accounts', createAccountRouter(delayMs));

  return app;
}
