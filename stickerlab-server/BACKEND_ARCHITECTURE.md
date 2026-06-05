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
│ club_id      │ (FK → Club) NULLABLE
│ in_album     │ BOOLEAN
│ called_up    │ BOOLEAN
└──────┬───────┘
       │
       │ N:1 (opcional)
       │
       ▼
┌──────────────┐
│     Club     │
│──────────────│
│ id (PK)      │
│ name         │ UNIQUE
│ slug         │ UNIQUE
│ country_code │ CHAR(3)
│ badge_url    │ NULLABLE
└──────────────┘


┌──────────────┐
│     User*    │
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
│RefreshToken* │
│──────────────│
│ id (PK)      │
│ user_id      │ (FK → User)
│ token        │
│ expires_at   │
└──────────────┘
```

**Nota:** `*` indica entidades planejadas para autenticação (não implementadas ainda)

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
       │ GET /api/clubs/ranking
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

### 4. Admin - CRUD Operations (Implementados)

#### **Create Team**

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ POST /api/teams
       │ Content-Type: application/json
       │ {
       │   "name": "Argentina",
       │   "fifaCode": "ARG",
       │   "groupId": "uuid",
       │   "colorPrimary": "#75AADB",
       │   "colorSecondary": "#FFFFFF"
       │ }
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
│ Controller  │     │ INSERT team  │
└──────┬──────┘     └──────────────┘
       │
       │ Response: Team created (201)
       │
       ▼
┌─────────────┐
│  Admin UI   │
└─────────────┘
```

#### **Update Team**

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ PUT /api/teams/:id
       │ {
       │   "name": "Brasil",
       │   "colorPrimary": "#009739",
       │   ...
       │ }
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
│ Controller  │     │ UPDATE team  │
└──────┬──────┘     └──────────────┘
       │
       │ Response: Team updated (200)
       │
       ▼
┌─────────────┐
│  Admin UI   │
└─────────────┘
```

#### **Delete Team**

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ DELETE /api/teams/:id
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
│ Controller  │     │ DELETE team  │
└──────┬──────┘     │ + players    │
       │            └──────────────┘
       │
       │ Response: Team deleted (200)
       │
       ▼
┌─────────────┐
│  Admin UI   │
└─────────────┘
```

#### **Create/Update/Delete Player**

```
┌─────────────┐
│  Admin UI   │
└──────┬──────┘
       │
       │ POST   /api/players
       │ PUT    /api/players/:id
       │ DELETE /api/players/:id
       │ PATCH  /api/players/:id/club
       │
       │ Body (POST):
       │ {
       │   "name": "Alisson",
       │   "canonicalName": "Alisson",
       │   "albumCode": "BRA-2",
       │   "inAlbum": true,
       │   "calledUp": true,
       │   "teamId": "uuid",
       │   "clubId": "uuid"   (opcional)
       │ }
       │
       │ Body (PUT):
       │ {
       │   "name": "Alisson",
       │   "canonicalName": "Alisson",
       │   "albumCode": "BRA-2",
       │   "inAlbum": true,
       │   "calledUp": true,
       │   "clubId": "uuid"   (opcional)
       │ }
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  API Server │────▶│ PostgreSQL   │
│ Controller  │     │ players table│
└──────┬──────┘     └──────────────┘
       │
       │ Response: Player created/updated/deleted
       │
       ▼
┌─────────────┐
│  Admin UI   │
└─────────────┘
```

**GET /api/players** também está implementado com query params:

- `?team_id=uuid` - Filtra jogadores por time

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
│  │  Routes (Node.js HTTP)            │  │
│  │  - /api/teams                        │  │
│  │  - /api/players                      │  │
│  │  - /api/groups                       │  │
│  │  - /api/clubs                        │  │
│  │  - /api/statistics                   │  │
│  │  - /api/auth (planejado)             │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Middleware                          │  │
│  │  - authMiddleware (JWT, planejado)   │  │
│  │  - errorHandler                      │  │
│  │  - multiparty (file upload)          │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Controllers                         │  │
│  │  - TeamController                    │  │
│  │  - PlayerController                  │  │
│  │  - GroupController                   │  │
│  │  - ClubController                    │  │
│  │  - StatisticsController              │  │
│  │  - authController (planejado)        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Use Cases (business logic)          │  │
│  │  - GetAllTeamsUseCase                │  │
│  │  - GetTeamByIdUseCase                │  │
│  │  - GetAllPlayersUseCase              │  │
│  │  - UpdatePlayerClubUseCase           │  │
│  │  - GetAllClubsUseCase                │  │
│  │  - GetClubRankingUseCase             │  │
│  │  - GetOverallStatisticsUseCase       │  │
│  │  - UploadTeamBadgeUseCase (S3)       │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Repositories (Prisma ORM)           │  │
│  │  - TeamRepository                    │  │
│  │  - PlayerRepository                  │  │
│  │  - GroupRepository                   │  │
│  │  - ClubRepository                    │  │
│  │  - userRepository (planejado)        │  │
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
│ - clubs     │      │   ...       │
│ - users*    │      └──────┬──────┘
└─────────────┘             │
                            │
                            │ CDN
                            ▼
                     ┌──────────────┐
                     │ CloudFront   │
                     │ (Public CDN) │
                     └──────────────┘
```

**Nota:** `*` indica tabelas planejadas (não implementadas ainda)

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
