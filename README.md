# RefaccionesFront — VagXpress

Frontend Angular 19 (standalone components, Material + Bootstrap) del
sistema de gestión de refaccionaria. Backend en el repo `API-Refaccionaria`.

## Desarrollo local

Requisitos: Node 20+, el API corriendo en `http://127.0.0.1:8000`
(ver README del backend).

```bash
npm install
npm start        # http://localhost:4200
```

Usuario local: **admin / admin123**.

Los entornos viven en `src/environments/` (`environment.development.ts`
se usa en `ng serve` vía fileReplacements). `src/app/conexion.ts` es un
puente deprecado que re-exporta el environment.

## Arquitectura

```
src/app/core/          Sesión, guards funcionales, interceptors, modelos
  service/auth.service      Login/logout con token Sanctum
  service/storage.service   Único acceso a localStorage
  service/notification.service  SweetAlert2 envuelto
  interceptor/jwt            Único origen del header Authorization
  interceptor/error          401 centralizado → logout + login
  models/                    ApiResponse<T> y tipos de dominio
src/app/services/      Servicios de dominio tipados (ApiBase)
src/app/pages/         Pantallas de negocio (una carpeta por módulo)
src/app/layout/        Header, sidebar (menú por permisos), temas
```

## Deuda conocida

- `ng lint` reporta ~800 errores heredados (`any` y estilo en componentes
  cuya lógica visual se conservó tal cual). El tipado real lo garantiza
  `ng build` (TypeScript strict), que compila sin errores.
- Los directorios `calendar/`, `contacts/`, `forms/` y `extra-pages/` son
  demos de la plantilla, no están ruteados y se conservan a propósito.
