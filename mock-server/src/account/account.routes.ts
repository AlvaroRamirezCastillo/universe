import { setTimeout } from 'node:timers/promises';
import { Router } from 'express';
import { mockAccounts } from './accounts.mock';

export function createAccountRouter(delayMs: number): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    await setTimeout(delayMs);
    response.json(mockAccounts);
  });

  return router;
}
