# vektor-front

Frontend del proyecto **VEKTOR**: SPA en **Angular 20** (standalone components + signals) servida por **Nginx**, que muestra la marca "VEKTOR" (servida por el backend, con estética terminal/glitch estilo Mr. Robot) y un CRUD de `items` contra [`vektor-backend`](../vektor-backend).

Forma parte de un sistema de 3 repos desplegado en Azure Container Apps — ver [`vektor-infra`](../vektor-infra) para la infraestructura.

## Arquitectura del servicio

- El front **nunca conoce la URL del backend**: todas las llamadas son relativas a `/api/...`.
  - En local: el dev-server de Angular las proxya a `http://localhost:8000` (`proxy.conf.json`).
  - En Azure: el Nginx del contenedor hace reverse proxy hacia `$BACKEND_URL`, variable inyectada por Terraform con el FQDN interno del backend.
- La palabra "VEKTOR" viene de `GET /api/brand`; no está hardcodeada en el front.
- Imagen Docker multi-stage: build con Node 22 → runtime `nginx-unprivileged` (non-root, puerto **8080**).

## Requisitos

- Node.js 22 LTS (nota: Angular CLI 21 exige Node ≥ 24.15; este workspace usa Angular 20, compatible con Node 22/24).
- **pnpm** como gestor de paquetes (versión fijada en `package.json` → `packageManager`; con Corepack habilitado (`corepack enable`) se resuelve sola).
- Para los tests: Chrome/Chromium instalado (se ejecutan en ChromeHeadless).

## Ejecutar en local

```bash
pnpm install
pnpm start          # http://localhost:4200, proxya /api -> localhost:8000
```

Arranca antes el backend (`cd ../vektor-backend && uvicorn app.main:app --reload`) para que el título y el CRUD funcionen.

## Tests y lint

```bash
pnpm lint       # ESLint (angular-eslint)
pnpm test       # unit tests, una pasada en ChromeHeadless (igual que CI)
pnpm test:watch # modo desarrollo
```

## Docker

```bash
docker build -t vektor-front .
docker run -p 8080:8080 -e BACKEND_URL=http://host.docker.internal:8000 vektor-front
# http://localhost:8080
```

| Variable | Descripción | Default |
|---|---|---|
| `BACKEND_URL` | URL base del backend a la que Nginx proxya `/api/` | `http://localhost:8000` |

## CI/CD

Workflow en `.github/workflows/ci.yml`:

1. **quality** (PRs y pushes): `pnpm lint` + tests headless + build de producción. Bloqueante.
2. **deploy** (solo push a `dev` o `master`): login OIDC en Azure (sin secretos), `az acr build` etiquetando la imagen con el SHA del commit, y `az containerapp update` sobre `ca-vektor-front` del entorno correspondiente:
   - rama `dev` → `rg-vektor-dev` (entorno dev)
   - rama `master` → `rg-vektor-prod` (entorno prod, GitHub Environment `prod` con aprobación manual)

Variables de repositorio necesarias en GitHub (Settings → Secrets and variables → Actions → **Variables**): `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `ACR_NAME`. La configuración de OIDC y de los environments está documentada en el README de `vektor-infra`.

## Estructura

```
src/app/
├── core/            # ApiService (HttpClient) + tipos del contrato con el backend
├── vektor-title/    # marca "VEKTOR" gigante con efecto glitch CSS
├── items/           # CRUD de items (signals, sin librería de estado)
└── app.ts           # componente raíz
nginx/               # template de Nginx (envsubst de BACKEND_URL en runtime)
```

## Deuda técnica y roadmap

- Tipos del contrato duplicados a mano (`core/models.ts`) → generar cliente desde el OpenAPI del backend (openapi-typescript).
- Fuente monospace del sistema → añadir una fuente terminal libre vía `@font-face` local para más fidelidad Mr. Robot.
- E2E con Playwright como smoke test post-deploy.
- OpenTelemetry en el navegador → Application Insights (tracing front→back).
