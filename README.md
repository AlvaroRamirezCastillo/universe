# Universe

Monorepo con pnpm workspaces, dos aplicaciones, paquetes compartidos y un servidor de pruebas HTTP:

| Proyecto | Ubicación | Tecnologías |
| --- | --- | --- |
| Web | `apps/angular` | Angular 22, TypeScript, SCSS y routing |
| Móvil | `apps/mobile` | React Native 0.88, Expo SDK 58 y TypeScript |
| Accounts | `packages/accounts` | TypeScript compartido por web y móvil |
| Mock server | `mock-server` | Express, TypeScript y CORS |

## Requisitos e instalación

- Node.js 24.15.0 o una versión posterior de la rama 24. El archivo `.nvmrc` fija la versión inicial.
- pnpm 11.21.0, fijado en `package.json`.

```bash
nvm use
npm install --global pnpm@11.21.0
pnpm install
```

Ejecuta la instalación desde la raíz. Todos los workspaces comparten `pnpm-lock.yaml`.

## Desarrollo

```bash
# Mock de cuentas: http://localhost:3000/accounts
pnpm dev:mock-server

# En otra terminal, inicia la aplicación que quieras utilizar:
# Angular: http://localhost:4200
pnpm dev:angular

# React Native: inicia Metro y muestra el QR de Expo
pnpm dev:mobile

# Abrir en un emulador Android o simulador iOS
pnpm android
pnpm ios
```

El mock server debe estar ejecutándose para cargar las cuentas en ambas aplicaciones. `pnpm dev:mock-server` reinicia el servidor al editar sus archivos.

Para el móvil, utiliza Expo Go compatible con SDK 58. Android requiere un emulador configurado o un dispositivo conectado; el simulador iOS requiere macOS y Xcode.

También puedes ejecutar comandos directamente en cada workspace:

```bash
pnpm --filter @universe/angular ng generate component example
pnpm --filter @universe/mobile exec expo install nombre-del-paquete
```

## Verificación y compilación

```bash
pnpm build      # Angular en producción y bundles móviles para Android e iOS
pnpm test       # Integración HTTP del mock server y pruebas de Angular con Vitest
pnpm typecheck  # TypeScript del móvil, paquetes compartidos y mock server
pnpm check      # Ejecuta las tres comprobaciones anteriores
```

La compilación web se genera en `apps/angular/dist/`. Los bundles móviles se generan en `apps/mobile/dist/android/` y `apps/mobile/dist/ios/`.

Los bundles de Expo permiten verificar y distribuir el código JavaScript y los recursos. Para generar un APK, AAB o IPA se necesita una compilación nativa mediante Expo EAS Build o `expo run:android` / `expo run:ios`, junto con las herramientas y credenciales de cada plataforma. Los directorios nativos se generan cuando se necesitan.

## Paquete compartido de cuentas

`@universe/accounts` está declarado como dependencia `workspace:*` en Angular y mobile. Ambas aplicaciones utilizan `AxiosAccountRepository` para cargar las cuentas mediante una llamada HTTP al mock server.

El consumo del paquete y la interfaz de cuentas se agrupan en una carpeta `account/` dentro de cada aplicación:

```text
apps/angular/src/app/account/
├── account.ts           # Componente Angular y caso de uso
├── account.html         # Vista de cuentas
└── account.providers.ts # Inyección del repositorio HTTP

apps/mobile/src/account/
└── AccountScreen.tsx # Pantalla React Native y conexión con el paquete
```

Los componentes principales de las aplicaciones montan estas vistas.

```text
packages/accounts/
├── domain/       # Account y contrato AccountRepository
├── application/  # Caso de uso ListAccounts
├── data/         # Repositorios Axios e in-memory
├── index.ts      # API pública
├── package.json
└── tsconfig.json
```

`domain` es independiente. `application` y `data` dependen de los contratos de `domain`; cada aplicación conecta el caso de uso con el repositorio. Axios es una dependencia de `data`. La URL se recibe por constructor: la configuración de Angular, React Native y sus emuladores se resuelve dentro de cada aplicación. El paquete no importa Angular ni React Native y sus fuentes se compilan con cada app, sin una compilación previa del paquete.

```ts
import { ListAccounts } from '@universe/accounts/application';
import { AxiosAccountRepository } from '@universe/accounts/data';

const listAccounts = new ListAccounts(
  new AxiosAccountRepository('http://localhost:3000'),
);
const accounts = await listAccounts.execute();
```

También puedes importar desde `@universe/accounts` o importar los tipos desde `@universe/accounts/domain`. `InMemoryAccountRepository` sigue disponible para pruebas; el consumo normal de ambas apps utiliza Axios. El repositorio HTTP tiene un timeout de 10 segundos y propaga los errores a la aplicación para mostrar su estado de error.

## Mock server y URLs por plataforma

`mock-server` es el workspace `@universe/mock-server`. Los datos de ejemplo viven en `mock-server/src/account/accounts.mock.ts` y las rutas se agrupan en `mock-server/src/account/`.

| Endpoint | Respuesta |
| --- | --- |
| `GET /accounts` | Lista de cuentas con `id`, `name` y `email` |
| `GET /health` | `{ "status": "ok" }` |

El servidor escucha en `0.0.0.0:3000`, habilita CORS para el navegador y añade 300 ms de demora a las cuentas. Puedes cambiar el puerto y la latencia:

```bash
PORT=3001 MOCK_DELAY_MS=1000 pnpm dev:mock-server
```

Configura la URL que corresponda al entorno:

| Aplicación | URL por defecto | Configuración |
| --- | --- | --- |
| Angular | `http://localhost:3000` | `apps/angular/src/environments/environment.ts` |
| Emulador Android | `http://10.0.2.2:3000` | `apps/mobile/src/config/api.ts` |
| Simulador iOS | `http://localhost:3000` | `apps/mobile/src/config/api.ts` |
| Dispositivo físico | IP local de tu computadora | `EXPO_PUBLIC_API_URL` en `apps/mobile/.env.local` |

Para un dispositivo físico, copia `apps/mobile/.env.example` a `apps/mobile/.env.local`, descomenta `EXPO_PUBLIC_API_URL` y usa la IP local de tu computadora. El teléfono y la computadora deben poder comunicarse por la red local. Recarga por completo la app después de cambiar la variable. Si cambias `PORT`, actualiza también la URL de las aplicaciones.

Las pruebas HTTP arrancan su propia instancia del servidor en un puerto libre y comprueban la respuesta, CORS y el recorrido `ListAccounts → AxiosAccountRepository → Express`. Las pruebas de Angular inyectan un repositorio en memoria.

## Referencias

- [Angular CLI](https://angular.dev/cli)
- [Expo con monorepos](https://docs.expo.dev/guides/monorepos/)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Axios: instancias y configuración](https://axios-http.com/docs/config_defaults)
- [Variables de entorno en Expo](https://docs.expo.dev/guides/environment-variables/)
- [Express y CORS](https://expressjs.com/en/resources/middleware/cors/)
