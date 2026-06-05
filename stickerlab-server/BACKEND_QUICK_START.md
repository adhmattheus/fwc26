# 🚀 Quick Start Guide - Back-End Implementation

## � STATUS ATUAL

### ✅ Implementado e Funcionando

- ✅ Clean Architecture (Domain, Application, Infrastructure)
- ✅ PostgreSQL + Prisma ORM
- ✅ Swagger Documentation (`/api/docs`)
- ✅ AWS S3 Upload (team badges)
- ✅ **CRUD Completo**: Teams, Players
- ✅ **Read-Only**: Groups, Statistics, Clubs

**Endpoints Ativos:**

```
GET    /api/groups
GET    /api/teams
GET    /api/teams/:id
POST   /api/teams
PUT    /api/teams/:id
DELETE /api/teams/:id
POST   /api/teams/:id/upload-badge
GET    /api/players
POST   /api/players
PUT    /api/players/:id
DELETE /api/players/:id
PATCH  /api/players/:id/club
GET    /api/statistics/overall
GET    /api/statistics/ranking
GET    /api/clubs
GET    /api/clubs/ranking
```

### ⏳ Planejado (Não Implementado)

- ⏳ Autenticação JWT
- ⏳ Middleware de autorização
- ⏳ Entidades User/RefreshToken

---

## �📋 RESUMO EXECUTIVO

### Entidades

- **4 principais**: Team, Player, Group, Club
- **2 auth** (planejado): User, RefreshToken

### Endpoints

- **15 ativos**: 5 teams, 5 players, 1 groups, 2 statistics, 2 clubs
- **Planejado**: Autenticação (JWT + Refresh Token)

### Storage

- **Database**: PostgreSQL (AWS RDS ou Supabase)
- **Files**: AWS S3 (badges PNG) + CloudFront CDN

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial (1-2 dias)

- [ ] Criar repositório Git
- [ ] Setup Node.js + TypeScript
- [ ] Instalar dependências:
  ```bash
  npm install express @types/express
  npm install prisma @prisma/client
  npm install bcryptjs jsonwebtoken
  npm install @aws-sdk/client-s3
  npm install zod
  npm install dotenv
  npm install cors helmet
  ```
- [ ] Configurar `.env`:
  ```env
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  AWS_S3_BUCKET=...
  AWS_ACCESS_KEY_ID=...
  ```
- [ ] Setup PostgreSQL (local ou cloud)

### Fase 2: Database (2-3 dias)

- [ ] Criar `schema.prisma` com 5 tabelas
- [ ] Executar `prisma migrate dev`
- [ ] Criar script de seed:
  ```bash
  npx prisma db seed
  ```
- [ ] Testar conexão com database

### Fase 3: Core API (3-4 dias)

- [ ] Setup Express server
- [ ] Criar middleware de auth (JWT)
- [ ] Criar middleware de error handling
- [ ] Implementar repositories (Prisma):
  - [ ] TeamRepository
  - [ ] PlayerRepository
  - [ ] GroupRepository
- [ ] Implementar services:
  - [ ] TeamService (CRUD + statistics)
  - [ ] PlayerService (CRUD)
  - [ ] StatisticsService (cálculos)
- [ ] Implementar controllers:
  - [ ] TeamsController
  - [ ] PlayersController
  - [ ] StatisticsController
- [ ] Criar rotas:
  - [ ] GET `/api/teams`
  - [ ] GET `/api/teams/:id`
  - [ ] GET `/api/groups`
  - [ ] GET `/api/statistics/overall`
  - [ ] GET `/api/statistics/ranking`

### Fase 4: Autenticação (1-2 dias)

- [ ] Implementar AuthService:
  - [ ] Login (bcrypt compare)
  - [ ] Generate JWT
  - [ ] Refresh Token
- [ ] Criar rotas de auth:
  - [ ] POST `/api/auth/login`
  - [ ] POST `/api/auth/refresh`
  - [ ] POST `/api/auth/logout`
- [ ] Testar autenticação com Postman

### Fase 5: Upload S3 (1-2 dias)

- [ ] Setup AWS S3 bucket
- [ ] Configurar IAM policies
- [ ] Implementar S3Service:
  - [ ] uploadFile()
  - [ ] deleteFile()
- [ ] Criar endpoint:
  - [ ] POST `/api/teams/:id/upload-badge`
- [ ] Testar upload e delete

### Fase 6: Admin Endpoints (1 dia)

- [ ] Implementar rotas protegidas:
  - [ ] POST `/api/teams`
  - [ ] PUT `/api/teams/:id`
  - [ ] DELETE `/api/teams/:id`
  - [ ] POST `/api/players`
  - [ ] PUT `/api/players/:id`
  - [ ] DELETE `/api/players/:id`

### Fase 7: Migration Data (1 dia)

- [ ] Criar script `migrate-data.ts`
- [ ] Migrar grupos (12 registros)
- [ ] Migrar seleções (12 com dados)
- [ ] Migrar jogadores (~300 registros)
- [ ] Upload de badges existentes para S3

### Fase 8: Testes (2-3 dias)

- [ ] Setup Jest + Supertest
- [ ] Testar endpoints públicos
- [ ] Testar autenticação
- [ ] Testar upload S3
- [ ] Testar cálculos estatísticos

### Fase 9: Deploy (1-2 dias)

- [ ] Setup AWS Lambda ou ECS
- [ ] Configurar API Gateway
- [ ] Deploy database (RDS)
- [ ] Configurar CloudFront
- [ ] Setup CI/CD (GitHub Actions)

### Fase 10: Integração Front-End (2-3 dias)

- [ ] Criar API client no Next.js
- [ ] Substituir imports de `data/teams` por fetch
- [ ] Atualizar componentes para usar API
- [ ] Testar em desenvolvimento
- [ ] Deploy front-end (Vercel)

**Total estimado: 15-20 dias de desenvolvimento**

---

## 🎯 PRIORIDADES

### MVP (Minimum Viable Product) - 7 dias

1. ✅ Database + Prisma setup
2. ✅ Endpoints públicos (GET teams, groups, statistics)
3. ✅ Migration script (dados existentes)
4. ✅ Deploy basic (sem auth, sem upload)

### V1.0 (Full Features) - 15 dias

1. ✅ MVP completo
2. ✅ Autenticação JWT
3. ✅ Upload S3 (badges)
4. ✅ Admin endpoints (CRUD)
5. ✅ Integração front-end

---

## 📂 ARQUIVOS PARA BACK-END

### Documentação Criada

1. ✅ `BACKEND_SPEC.md` - Especificação técnica completa
2. ✅ `BACKEND_MOCK_EXAMPLES.json` - Exemplos de API responses
3. ✅ `BACKEND_ARCHITECTURE.md` - Diagramas e arquitetura
4. ✅ `BACKEND_QUICK_START.md` - Este guia rápido

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── server.ts              # Entry point
│   ├── config/
│   │   ├── database.ts
│   │   ├── aws.ts
│   │   └── auth.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── teams.routes.ts
│   │   ├── players.routes.ts
│   │   ├── groups.routes.ts
│   │   ├── statistics.routes.ts
│   │   └── auth.routes.ts
│   ├── controllers/
│   │   ├── teams.controller.ts
│   │   ├── players.controller.ts
│   │   ├── statistics.controller.ts
│   │   └── auth.controller.ts
│   ├── services/
│   │   ├── team.service.ts
│   │   ├── player.service.ts
│   │   ├── statistics.service.ts
│   │   ├── s3.service.ts
│   │   └── auth.service.ts
│   ├── repositories/
│   │   ├── team.repository.ts
│   │   ├── player.repository.ts
│   │   ├── group.repository.ts
│   │   └── user.repository.ts
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── scripts/
│   └── migrate-data.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔧 COMANDOS ÚTEIS

### Setup Inicial

```bash
# Criar projeto
mkdir backend && cd backend
npm init -y
npm install -D typescript @types/node ts-node nodemon

# Setup Prisma
npx prisma init

# Criar migration
npx prisma migrate dev --name init

# Executar seed
npx prisma db seed
```

### Desenvolvimento

```bash
# Rodar em dev
npm run dev

# Build
npm run build

# Rodar production
npm start
```

### Database

```bash
# Ver database no browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

### Testes

```bash
# Rodar testes
npm test

# Coverage
npm run test:coverage
```

---

## 🔑 CREDENCIAIS NECESSÁRIAS

### AWS

- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] S3 Bucket Name
- [ ] CloudFront Distribution ID

### Database

- [ ] PostgreSQL Connection String
- [ ] Database Name
- [ ] User/Password

### JWT

- [ ] JWT Secret (gerado: `openssl rand -base64 32`)
- [ ] Refresh Token Secret

### Admin User (seed)

```json
{
  "email": "admin@stickerlab.com",
  "password": "SecurePassword123!",
  "name": "Admin",
  "role": "admin"
}
```

---

## 📊 DADOS INICIAIS (Seed)

### Grupos (12)

- A, B, C, D, E, F, G, H, I, J, K, L

### Seleções com Dados (12)

1. Brasil (Grupo C)
2. Marrocos (Grupo C)
3. México (Grupo A)
4. África do Sul (Grupo A)
5. Canadá (Grupo B)
6. Bósnia e Herzegovina (Grupo B)
7. Coreia do Sul (Grupo A)
8. Tchéquia (Grupo A)
9. Catar (Grupo B)
10. Suíça (Grupo B)
11. Haiti (Grupo C)
12. Escócia (Grupo C)

### Seleções sem Dados (36)

- Criar registros básicos (nome, grupo, cores, fifa_code)
- Sem jogadores (players array vazio)

### Jogadores (~300)

- 12 seleções × 18 album = 216 album players
- 12 seleções × ~26 called_up = ~312 called_up
- Total único: ~300 registros (considerando overlaps)

---

## 🧪 TESTES POSTMAN

### Collection Structure

```
StickerLab API
├── Auth
│   ├── POST Login
│   ├── POST Refresh Token
│   └── POST Logout
├── Groups
│   └── GET All Groups
├── Teams
│   ├── GET All Teams
│   ├── GET Team by Slug
│   ├── POST Create Team (Auth)
│   ├── PUT Update Team (Auth)
│   ├── DELETE Team (Auth)
│   └── POST Upload Badge (Auth)
├── Players
│   ├── GET All Players
│   ├── GET Player by ID
│   ├── POST Create Player (Auth)
│   ├── PUT Update Player (Auth)
│   └── DELETE Player (Auth)
└── Statistics
    ├── GET Overall Statistics
    └── GET Ranking
```

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3001/api",
  "accessToken": "",
  "refreshToken": ""
}
```

---

## 🐛 DEBUG CHECKLIST

### Database Connection Issues

- [ ] Verificar DATABASE_URL no .env
- [ ] Testar conexão: `npx prisma db pull`
- [ ] Verificar firewall/whitelist IP (RDS)

### JWT Authentication Errors

- [ ] Verificar JWT_SECRET configurado
- [ ] Testar token: https://jwt.io
- [ ] Verificar expiração (exp claim)

### S3 Upload Errors

- [ ] Verificar AWS credentials
- [ ] Verificar bucket permissions (IAM policy)
- [ ] Testar upload manual via AWS Console

### Statistics Calculation Wrong

- [ ] Verificar queries SQL (console.log)
- [ ] Testar cálculos manualmente
- [ ] Comparar com dados mocados

---

## 📞 CONTATOS DE SUPORTE

### AWS

- Documentação S3: https://docs.aws.amazon.com/s3/
- IAM Policies: https://aws.amazon.com/iam/

### Prisma

- Docs: https://www.prisma.io/docs
- Discord: https://pris.ly/discord

### PostgreSQL

- Docs: https://www.postgresql.org/docs/

### Next.js (Front-End)

- Docs: https://nextjs.org/docs
- API Routes: https://nextjs.org/docs/api-routes/introduction

---

## 🎓 RECURSOS ADICIONAIS

### Tutoriais Recomendados

1. Prisma Quick Start: https://www.prisma.io/docs/getting-started
2. JWT Authentication: https://jwt.io/introduction
3. AWS S3 Upload: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html

### Repositórios Exemplo

- Express + Prisma: https://github.com/prisma/prisma-examples
- JWT Auth: https://github.com/auth0/node-jsonwebtoken

---

## 🏁 CONCLUSÃO

**Com esses 4 arquivos você tem:**

1. ✅ **BACKEND_SPEC.md**: Especificação técnica completa (entidades, endpoints, SQL)
2. ✅ **BACKEND_MOCK_EXAMPLES.json**: Exemplos de requests/responses
3. ✅ **BACKEND_ARCHITECTURE.md**: Diagramas e fluxos visuais
4. ✅ **BACKEND_QUICK_START.md**: Checklist e guia rápido

**Próximo passo:** Escolher stack (Express vs Fastify, Prisma vs TypeORM) e começar implementação!

---

**Boa sorte com o desenvolvimento! 🚀⚽**
