# Universe

Monorepo con pnpm workspaces y dos proyectos independientes:

| Proyecto | Ubicación | Tecnologías |
| --- | --- | --- |
| Web | `apps/angular` | Angular 22, TypeScript, SCSS y routing |
| Móvil | `apps/mobile` | React Native 0.88, Expo SDK 58 y TypeScript |

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
pnpm typecheck  # TypeScript del proyecto móvil
pnpm check      # Ejecuta las tres comprobaciones anteriores
```

La compilación web se genera en `apps/angular/dist/`. Los bundles móviles se generan en `apps/mobile/dist/android/` y `apps/mobile/dist/ios/`.

Los bundles de Expo permiten verificar y distribuir el código JavaScript y los recursos. Para generar un APK, AAB o IPA se necesita una compilación nativa mediante Expo EAS Build o `expo run:android` / `expo run:ios`, junto con las herramientas y credenciales de cada plataforma. Los directorios nativos se generan cuando se necesitan.

## Referencias

- [Angular CLI](https://angular.dev/cli)
- [Expo con monorepos](https://docs.expo.dev/guides/monorepos/)
- [pnpm workspaces](https://pnpm.io/workspaces)
