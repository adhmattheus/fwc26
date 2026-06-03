## 📊 Diagrama de Entidades (ERD)

```
┌──────────────┐
│    Group     │
│──────────────│
│ id (PK)      │
│ name         │ (A-L)
│ display_order│
└──────┬───────┘
       │
       │ 1:N (4 teams por grupo)
       │
       ▼
┌──────────────┐
│     Team     │
│──────────────│
│ id (PK)      │
│ name         │ UNIQUE
│ slug         │ UNIQUE
│ fifa_code    │ UNIQUE (3 chars)
│ badge_url     │ → AWS S3
│ group_name   │ (FK → Group)
│ color_primary│
│ color_secondary│
└──────┬───────┘
       │
       │ 1:N (~26 players por team)
       │
       ▼
┌──────────────┐
│   Player     │
│──────────────│
│ id (PK)      │
│ name         │
│ canonical_name│ (usado para match)
│ album_code   │ NULLABLE (ex: "BRA-2")
│ team_id      │ (FK → Team)
│ in_album     │ BOOLEAN
│ called_up    │ BOOLEAN
└──────────────┘


┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │
│ email        │ UNIQUE
│ password_hash│
│ name         │
│ role         │ (admin/viewer)
└──────┬───────┘
       │
       │ 1:N
       │
       ▼
┌──────────────┐
│RefreshToken  │
│──────────────│
│ id (PK)      │
│ user_id      │ (FK → User)
│ token        │
│ expires_at   │
└──────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Home Page (`/`)

```
┌─────────────┐
│  Browser    │
└──────┬──────┘
       │
       │ GET /api/groups
       │ GET /api/statistics/overall
       │ GET /api/statistics/ranking
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
└──────┬──────┘     └──────────────┘
       │
       │ Response JSON
       │
       ▼
┌─────────────┐
│  Next.js    │
│  Rendering  │
└─────────────┘
```

**Dados carregados:**

- 12 grupos com 48 seleções
- Estatísticas agregadas (totais + percentuais)
- Ranking ordenado por Panini Accuracy

---

### 2. Team Detail Page (`/team/[id]`)

```
┌─────────────┐
│  Browser    │
└──────┬──────┘
       │
       │ GET /api/teams/:id
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
└──────┬──────┘     └──────────────┘
       │              - Query team by slug
       │              - Join players
       │              - Calculate stats
       │
       │ Response JSON
       │ {
       │   team: {...},
       │   players: {album: [...], called_up: [...]},
       │   comparison: {...},
       │   statistics: {...}
       │ }
       │
       ▼
┌─────────────┐
│  Next.js    │
│  Rendering  │
└─────────────┘
```

**Dados carregados:**

- Informações da seleção (nome, cores, badge)
- ~18 jogadores do álbum
- ~26 jogadores convocados
- Comparação em 3 categorias
- Estatísticas calculadas

---

### 3. Admin - Upload Badge

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ POST /api/teams/:id/upload-badge
       │ Authorization: Bearer {JWT}
       │ Content-Type: multipart/form-data
       │
       ▼
┌─────────────┐
│  API Server │
│ (Middleware)│
│ - Verify JWT│
│ - Check role│
└──────┬──────┘
       │
       │ 1. Delete old badge from S3 (if exists)
       │ 2. Upload new PNG to S3
       │ 3. Update team.badge_url in DB
       │
       ▼                    ▼
┌──────────────┐    ┌──────────────┐
│   AWS S3     │    │ PostgreSQL   │
│  Bucket      │    │  teams table │
└──────────────┘    └──────────────┘
       │
       │ Return CloudFront URL
       │
       ▼
┌─────────────┐
│  Admin UI   │
│  (Success)  │
└─────────────┘
```

---

## 🏗️ Arquitetura de Camadas

```
┌────────────────────────────────────────────┐
│           FRONT-END (Next.js)              │
│  ┌──────────────────────────────────────┐  │
│  │  Pages                               │  │
│  │  - app/page.tsx (Home)               │  │
│  │  - app/team/[id]/page.tsx          │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Components                          │  │
│  │  - TeamCard, PlayerCard, etc.        │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  API Client (fetch)                  │  │
│  │  - /api/teams, /api/groups, etc.     │  │
│  └──────────────────────────────────────┘  │
└────────────────┬───────────────────────────┘
                 │
                 │ HTTP/JSON
                 │
┌────────────────▼───────────────────────────┐
│           BACK-END (Node.js)               │
│  ┌──────────────────────────────────────┐  │
│  │  Routes (Express)                    │  │
│  │  - /api/teams                        │  │
│  │  - /api/players                      │  │
│  │  - /api/groups                       │  │
│  │  - /api/statistics                   │  │
│  │  - /api/auth                         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Middleware                          │  │
│  │  - authMiddleware (JWT)              │  │
│  │  - errorHandler                      │  │
│  │  - multer (file upload)              │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Controllers                         │  │
│  │  - teamsController                   │  │
│  │  - playersController                 │  │
│  │  - authController                    │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Services                            │  │
│  │  - teamService (business logic)      │  │
│  │  - playerService                     │  │
│  │  - statisticsService                 │  │
│  │  - s3Service (upload/delete)         │  │
│  │  - authService (JWT, bcrypt)         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Repositories (ORM)                  │  │
│  │  - teamRepository (Prisma/TypeORM)   │  │
│  │  - playerRepository                  │  │
│  │  - userRepository                    │  │
│  └──────────────────────────────────────┘  │
└────────────────┬───────────────────────────┘
                 │
     ┌───────────┴────────────┐
     │                        │
     ▼                        ▼
┌─────────────┐      ┌─────────────┐
│ PostgreSQL  │      │   AWS S3    │
│   Database  │      │   Bucket    │
│             │      │             │
│ - groups    │      │ - teams-badges│
│ - teams     │      │   /bra.png  │
│ - players   │      │   /arg.png  │
│ - users     │      │   ...       │
└─────────────┘      └──────┬──────┘
                            │
                            │ CDN
                            ▼
                     ┌──────────────┐
                     │ CloudFront   │
                     │ (Public CDN) │
                     └──────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ POST /api/auth/login
       │ { email, password }
       │
       ▼
┌─────────────┐
│  API Server │
│ - bcrypt    │
│   compare   │
└──────┬──────┘
       │
       │ Valid credentials?
       │
       ├── YES ──────────────────────┐
       │                             │
       │ Generate JWT                │
       │ - accessToken (15min)       │
       │ - refreshToken (7 days)     │
       │                             │
       ▼                             ▼
┌──────────────┐            ┌──────────────┐
│ PostgreSQL   │            │  Response    │
│ Save refresh │            │  {           │
│ token        │            │   user,      │
└──────────────┘            │   tokens     │
                            │  }           │
                            └──────┬───────┘
                                   │
                                   │ Store in localStorage/cookie
                                   │
                                   ▼
                            ┌──────────────┐
                            │  Admin UI    │
                            │  (Logged in) │
                            └──────────────┘


┌─────────────┐
│  Admin UI   │
│ (Protected) │
└──────┬──────┘
       │
       │ POST /api/teams
       │ Authorization: Bearer {accessToken}
       │
       ▼
┌─────────────┐
│  Middleware │
│ - Verify JWT│
│ - Check exp │
└──────┬──────┘
       │
       ├── Valid? YES ───▶ Controller ───▶ Success
       │
       └── Expired? ─────────────────────┐
                                         │
                                         │ POST /api/auth/refresh
                                         │ { refreshToken }
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Verify      │
                                  │  refresh     │
                                  │  token in DB │
                                  └──────┬───────┘
                                         │
                                         │ Generate new accessToken
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Retry       │
                                  │  request     │
                                  └──────────────┘
```

---

## 📦 Estrutura de Diretórios (Back-End)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma/TypeORM config
│   │   ├── aws.ts              # S3 client setup
│   │   └── auth.ts             # JWT secrets
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── error.middleware.ts # Error handler
│   │   └── upload.middleware.ts# Multer config
│   │
│   ├── routes/
│   │   ├── teams.routes.ts
│   │   ├── players.routes.ts
│   │   ├── groups.routes.ts
│   │   ├── statistics.routes.ts
│   │   └── auth.routes.ts
│   │
│   ├── controllers/
│   │   ├── teams.controller.ts
│   │   ├── players.controller.ts
│   │   ├── statistics.controller.ts
│   │   └── auth.controller.ts
│   │
│   ├── services/
│   │   ├── team.service.ts
│   │   ├── player.service.ts
│   │   ├── statistics.service.ts
│   │   ├── s3.service.ts
│   │   └── auth.service.ts
│   │
│   ├── repositories/
│   │   ├── team.repository.ts
│   │   ├── player.repository.ts
│   │   ├── group.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── models/          # Prisma/TypeORM models
│   │   └── schema.prisma
│   │
│   ├── dto/             # Data Transfer Objects
│   │   ├── create-team.dto.ts
│   │   ├── update-team.dto.ts
│   │   ├── create-player.dto.ts
│   │   └── login.dto.ts
│   │
│   ├── validators/      # Zod schemas
│   │   ├── team.validator.ts
│   │   ├── player.validator.ts
│   │   └── auth.validator.ts
│   │
│   ├── types/
│   │   └── index.ts     # TypeScript types
│   │
│   ├── utils/
│   │   ├── slug.util.ts
│   │   └── statistics.util.ts
│   │
│   └── server.ts        # Express app setup
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts          # Migration from mock data
│
├── scripts/
│   └── migrate-data.ts  # Script to import mock data
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Deploy Sugerido

### Opção 1: Serverless (AWS Lambda)

```
┌─────────────┐
│   Vercel    │  Front-End (Next.js)
└─────────────┘
       │
       │ API calls
       │
       ▼
┌─────────────┐
│ API Gateway │  REST API
└──────┬──────┘
       │
       ▼
┌─────────────┐
│AWS Lambda   │  Back-End Functions
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ RDS      │   │ S3 Bucket│   │CloudFront│
│PostgreSQL│   │  Images  │   │   CDN    │
└──────────┘   └──────────┘   └──────────┘
```

### Opção 2: Container (Docker)

```
┌─────────────┐
│   Vercel    │  Front-End (Next.js)
└─────────────┘
       │
       │ API calls
       │
       ▼
┌─────────────┐
│ ECS/Fargate │  Docker Container
│  (Node.js)  │  Back-End
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ RDS      │   │ S3 Bucket│   │CloudFront│
│PostgreSQL│   │  Images  │   │   CDN    │
└──────────┘   └──────────┘   └──────────┘
```

---

## 📊 Métricas de Dados

### Estimativas

- **48 seleções** (Teams)
- **12 grupos** (Groups)
- **~1000 jogadores** (Players)
  - 48 teams × 18 album = 864 album players
  - 48 teams × 26 called_up = 1248 called_up players
  - Considerando overlaps: ~1000 registros únicos
- **1-5 admins** (Users)

### Storage

- **Database**: ~500KB (dados textuais)
- **S3 Images**: ~10MB (48 badges × 200KB cada)
- **Total**: <15MB

### Performance

- **Queries complexas**: <100ms (com índices)
- **Upload S3**: 1-3s (com CloudFront)
- **API Response**: <200ms (média)

---

## 🔄 Migration Path (Mock → Database)

```
Current:                    Target:
data/teams/                 PostgreSQL + S3
├── types.ts           →    schema.prisma
├── constants.ts       →    DB seed (groups, colors)
├── team-data.ts       →    DB seed (teams, players)
└── utils.ts           →    services/statistics.service.ts

public/teams-badges/     →    AWS S3 bucket
├── bra.png            →    s3://bucket/teams-badges/bra.png
├── arg.png            →    s3://bucket/teams-badges/arg.png
└── ...                →    ...
```

**Script de migração**: `scripts/migrate-data.ts`

- Lê dados de `team-data.ts`
- Insere no PostgreSQL
- Faz upload de imagens para S3
- Atualiza `badge_url` com CloudFront URL

---

## 🎯 Próximos Passos

1. ✅ **Spec completa** (BACKEND_SPEC.md)
2. ⏭️ Setup PostgreSQL (local ou RDS)
3. ⏭️ Criar schema Prisma
4. ⏭️ Implementar repositories
5. ⏭️ Implementar services
6. ⏭️ Criar controllers + routes
7. ⏭️ Setup AWS S3 + IAM
8. ⏭️ Implementar auth (JWT)
9. ⏭️ Script de migração (seed)
10. ⏭️ Testes (Jest)
11. ⏭️ Deploy (Lambda ou ECS)
12. ⏭️ Conectar front-end com API
