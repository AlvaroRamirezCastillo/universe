import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { ListAccounts } from '@universe/accounts/application';
import { AxiosAccountRepository } from '@universe/accounts/data';
import { createMockServer } from '../src/app';

let server: Server;
let baseURL: string;

before(async () => {
  server = createMockServer({ delayMs: 0 }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as AddressInfo;
  baseURL = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /health reports that the mock server is available', async () => {
  const response = await fetch(`${baseURL}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('GET /accounts serves JSON accessible from the Angular origin', async () => {
  const response = await fetch(`${baseURL}/accounts`, {
    headers: { Origin: 'http://localhost:4200' },
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  const accounts = await response.json();
  assert.ok(Array.isArray(accounts));
  assert.equal(accounts.length, 2);
});

test('ListAccounts loads accounts over HTTP through the shared Axios repository', async () => {
  const listAccounts = new ListAccounts(new AxiosAccountRepository(baseURL));

  assert.deepEqual(await listAccounts.execute(), [
    { id: 'account-1', name: 'Ana Torres', email: 'ana@example.com' },
    { id: 'account-2', name: 'Luis Ramos', email: 'luis@example.com' },
  ]);
});

test('the Axios repository propagates HTTP failures to the caller', async () => {
  const repository = new AxiosAccountRepository(`${baseURL}/missing`);

  await assert.rejects(repository.findAll(), {
    name: 'AxiosError',
    message: 'Request failed with status code 404',
  });
});
