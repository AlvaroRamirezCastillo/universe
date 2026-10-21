# Universe

Monorepo con pnpm workspaces, dos aplicaciones y paquetes compartidos:

| Proyecto | Ubicación | Tecnologías |
| --- | --- | --- |
| Web | `apps/angular` | Angular 22, TypeScript, SCSS y routing |
| Móvil | `apps/mobile` | React Native 0.88, Expo SDK 58 y TypeScript |
| Accounts | `packages/accounts` | TypeScript compartido por web y móvil |

## Requisitos e instalación

- Node.js 24.15.0 o una versión posterior de la rama 24. El archivo `.nvmrc` fija la versión inicial.
- pnpm 11.21.0, fijado en `package.json`.

```bash
nvm use
npm install --global pnpm@11.21.0
pnpm install
```

Ejecuta la instalación desde la raíz. Ambos proyectos comparten `pnpm-lock.yaml`.

## Desarrollo

```bash
# Angular: http://localhost:4200
pnpm dev:angular

# React Native: inicia Metro y muestra el QR de Expo
pnpm dev:mobile

# Abrir en un emulador Android o simulador iOS
pnpm android
pnpm ios
```

Para el móvil, utiliza Expo Go compatible con SDK 58. Android requiere un emulador configurado o un dispositivo conectado; el simulador iOS requiere macOS y Xcode.

También puedes ejecutar comandos directamente en cada workspace:

```bash
pnpm --filter @universe/angular ng generate component example
pnpm --filter @universe/mobile exec expo install nombre-del-paquete
```

## Verificación y compilación

```bash
pnpm build      # Angular en producción y bundles móviles para Android e iOS
pnpm test       # Pruebas de Angular con Vitest
pnpm typecheck  # TypeScript del proyecto móvil y de los paquetes compartidos
pnpm check      # Ejecuta las tres comprobaciones anteriores
```

La compilación web se genera en `apps/angular/dist/`. Los bundles móviles se generan en `apps/mobile/dist/android/` y `apps/mobile/dist/ios/`.

Los bundles de Expo permiten verificar y distribuir el código JavaScript y los recursos. Para generar un APK, AAB o IPA se necesita una compilación nativa mediante Expo EAS Build o `expo run:android` / `expo run:ios`, junto con las herramientas y credenciales de cada plataforma. Los directorios nativos se generan cuando se necesitan.

## Paquete compartido de cuentas

`@universe/accounts` está declarado como dependencia `workspace:*` en Angular y mobile. Ambas aplicaciones lo consumen para mostrar las mismas cuentas de ejemplo.

El consumo del paquete y la interfaz de cuentas se agrupan en una carpeta `account/` dentro de cada aplicación:

```text
apps/angular/src/app/account/
├── account.ts        # Componente Angular y conexión con el paquete
└── account.html      # Vista de cuentas

apps/mobile/src/account/
└── AccountScreen.tsx # Pantalla React Native y conexión con el paquete
```

Los componentes principales de las aplicaciones montan estas vistas.

```text
packages/accounts/
├── domain/       # Account y contrato AccountRepository
├── application/  # Caso de uso ListAccounts
├── data/         # Repositorio en memoria y datos de ejemplo
├── index.ts      # API pública
├── package.json
└── tsconfig.json
```

`domain` es independiente. `application` y `data` dependen de los contratos de `domain`; cada aplicación conecta el caso de uso con el repositorio. El paquete utiliza TypeScript puro y sus fuentes se compilan con cada app, sin una compilación previa del paquete.

```ts
import { ListAccounts } from '@universe/accounts/application';
import { demoAccounts, InMemoryAccountRepository } from '@universe/accounts/data';

const listAccounts = new ListAccounts(new InMemoryAccountRepository(demoAccounts));
const accounts = await listAccounts.execute();
```

También puedes importar desde `@universe/accounts` o importar los tipos desde `@universe/accounts/domain`. Para conectar una API o almacenamiento local, implementa `AccountRepository` en `data` e inyecta esa implementación en `ListAccounts` desde la aplicación.

## Referencias

- [Angular CLI](https://angular.dev/cli)
- [Expo con monorepos](https://docs.expo.dev/guides/monorepos/)
- [pnpm workspaces](https://pnpm.io/workspaces)
