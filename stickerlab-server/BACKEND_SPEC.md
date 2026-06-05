# Especificação Back-End - StickerLab

## ✅ STATUS DE IMPLEMENTAÇÃO

### Endpoints Implementados

- ✅ **Teams**: GET, POST, PUT, DELETE, Upload Badge
- ✅ **Players**: GET, POST, PUT, DELETE, PATCH (assign club)
- ✅ **Groups**: GET
- ✅ **Statistics**: GET overall, GET ranking
- ✅ **Clubs**: GET all, GET ranking
- ✅ **Swagger Documentation**: `/api/docs`

### Planejado (Não Implementado)

- ⏳ **Autenticação**: Login, JWT, Refresh Tokens
- ⏳ **Entidades Auth**: User, RefreshToken
- ⏳ **Middleware**: authMiddleware (JWT verification)

> **Nota**: A autenticação está documentada para implementação futura. Atualmente, todos os endpoints CRUD estão públicos.

---

## 📋 ESCOPO DO FRONT-END

### Telas Principais

#### 1. **Home Page** (`/`)

- **Header**: Badge StickerLab + título
- **Overall Statistics**: Card com 4 métricas agregadas
  - Panini Accuracy Rate (%)
  - Error Rate (%)
- **Legend**: 3 badges explicando categorias de jogadores
- **Groups Grid**: 12 grupos (A-L), cada um com 4 seleções
  - Cada card mostra: badge da seleção, nome, grupo, 3 badges com contadores
- **Ranking Table**: Tabela ordenada por precisão Panini
  - Colunas: Rank, Team (com badge), Accuracy, Coverage, Error Rate

#### 2. **Team Detail Page** (`/team/[id]`)

- **Hero Banner**: Gradient com cores da seleção
- **Back Button**: Voltar para home
- **Team Header**: Card com badge, nome, grupo
- **Team Statistics**: 4 cards com métricas individuais
  - Panini Accuracy Rate
  - Error Rate
- **Summary Cards**: 3 cards com contadores por categoria
- **Player Sections**: 3 seções de jogadores
  - ✅ In Album and Called Up (green)
  - ⚠️ Only in Album (amber/warning)
  - ❌ Called Up Without Sticker (red/error)

---

## 🗂️ ENTIDADES DO SISTEMA

### 1. **Team** (Seleção)

```json
{
  "id": "uuid",
  "name": "Brasil",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fifa_code": "BRA",
  "badge_url": "https://s3.amazonaws.com/bucket/teams-badges/bra.png",
  "group": "C",
  "color_primary": "#009739",
  "color_secondary": "#FEDD00",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Campos:**

- `id`: UUID (PK)
- `name`: String (único)
- `slug`: String (único, URL-friendly)
- `fifa_code`: String (3 letras, único)
- `badge_url`: String (URL S3)
- `group`: String (A-L)
- `color_primary`: String (hex color)
- `color_secondary`: String (hex color)
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

### 2. **Player** (Jogador)

```json
{
  "id": "uuid",
  "name": "Alisson",
  "canonical_name": "Alisson",
  "album_code": "BRA-2",
  "team_id": "uuid-brasil",
  "club_id": "uuid-liverpool",
  "club": {
    "id": "uuid-liverpool",
    "name": "Liverpool",
    "slug": "liverpool",
    "countryCode": "ENG",
    "badgeUrl": "https://cdn.cloudfront.net/clubs-badges/liverpool.png"
  },
  "in_album": true,
  "called_up": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Campos:**

- `id`: UUID (PK)
- `name`: String (nome completo)
- `canonical_name`: String (nome normalizado)
- `album_code`: String (nullable, código figurinha ex: "BRA-2")
- `team_id`: UUID (FK → Team)
- `club_id`: UUID (FK → Club, nullable)
- `in_album`: Boolean (está no álbum Panini?)
- `called_up`: Boolean (foi convocado?)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Índices:**

- `team_id` (para queries rápidas)
- `album_code` (único quando não null)

---

### 3. **Group** (Grupo)

```json
{
  "id": "uuid",
  "name": "C",
  "display_order": 3,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Campos:**

- `id`: UUID (PK)
- `name`: String (A-L, único)
- `display_order`: Integer (1-12)
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

### 4. **Club** (Clube)

```json
{
  "id": "uuid",
  "name": "Real Madrid",
  "slug": "real-madrid",
  "country_code": "ESP",
  "badge_url": "https://s3.amazonaws.com/bucket/clubs-badges/real-madrid.png",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Campos:**

- `id`: UUID (PK)
- `name`: String (único)
- `slug`: String (único, URL-friendly)
- `country_code`: String (3 letras, código do país do clube)
- `badge_url`: String (URL S3)
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

## 📊 RELACIONAMENTOS

```
Group (1) ──┬──< (4) Team
            │
Team (1) ───┴──< (26) Player ──> (1) Club (opcional)
```

### Relações:

1. **Group → Team**: Um grupo tem 4 seleções (1:N)
2. **Team → Player**: Uma seleção tem N jogadores (1:N)
3. **Club → Player**: Um clube tem N jogadores convocados (1:N opcional)

**Sem relacionamentos M:N** (jogador pertence a apenas 1 seleção)

---

## 🔧 AÇÕES (Endpoints API)

### **Teams**

| Método | Endpoint         | Descrição               |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/teams`     | Lista todas as seleções |
| GET    | `/api/teams/:id` | Busca seleção por ID    |
| POST   | `/api/teams`     | Cria nova seleção       |
| PUT    | `/api/teams/:id` | Atualiza seleção        |
| DELETE | `/api/teams/:id` | Remove seleção          |

**Response `/api/teams/:id`:**

```json
{
  "team": {
    "id": "uuid",
    "name": "Brasil",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fifa_code": "BRA",
    "badge_url": "https://...",
    "group": "C",
    "color_primary": "#009739",
    "color_secondary": "#FEDD00"
  },
  "players": {
    "album": [
      { "id": "uuid", "codigo": "BRA-2", "player": "Alisson", "canonical_name": "Alisson" }
    ],
    "called_up": [
      { "id": "uuid", "player": "Alisson", "canonical_name": "Alisson" }
    ]
  },
  "comparison": {
    "in_album_and_called_up": { "total": 13, "players": [...] },
    "only_in_album": { "total": 5, "players": [...] },
    "called_up_without_sticker": { "total": 13, "players": [...] }
  },
  "statistics": {
    "paniniAccuracyRate": 72.2,
    "errorRate": 27.8
  }
}
```

---

### **Players**

| Método | Endpoint                | Descrição                                     |
| ------ | ----------------------- | --------------------------------------------- |
| GET    | `/api/players`          | Lista todos os jogadores (com filtros)        |
| POST   | `/api/players`          | Cria novo jogador (`clubId` opcional)         |
| PUT    | `/api/players/:id`      | Atualiza jogador (inclui `clubId` opcional)   |
| DELETE | `/api/players/:id`      | Remove jogador                                |
| PATCH  | `/api/players/:id/club` | Associa um clube ao jogador (apenas `clubId`) |

**Query Params `/api/players`:**

- `team_id`: Filtra por seleção
- `in_album`: Filtra por jogadores no álbum
- `called_up`: Filtra por jogadores convocados

---

### **Groups**

| Método | Endpoint            | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/groups`       | Lista todos os grupos    |
| GET    | `/api/groups/:name` | Busca grupo com seleções |

**Response `/api/groups`:**

```json
[
  {
    "id": "uuid",
    "name": "C",
    "display_order": 3,
    "teams": [
      {
        "id": "uuid",
        "name": "Brasil",
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "badge_url": "...",
        "fifa_code": "BRA"
      },
      {
        "id": "uuid",
        "name": "Marrocos",
        "slug": "marrocos",
        "badge_url": "...",
        "fifa_code": "MAR"
      },
      {
        "id": "uuid",
        "name": "Haiti",
        "slug": "haiti",
        "badge_url": "...",
        "fifa_code": "HAI"
      },
      {
        "id": "uuid",
        "name": "Escócia",
        "slug": "scotland",
        "badge_url": "...",
        "fifa_code": "SCO"
      }
    ]
  }
]
```

---

### **Statistics**

| Método | Endpoint                  | Descrição                        |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/api/statistics/overall` | Estatísticas gerais              |
| GET    | `/api/statistics/ranking` | Ranking de seleções por precisão |

**Response `/api/statistics/overall`:**

```json
{
  "totalTeams": 12,
  "totalAlbumPlayers": 216,
  "totalCalledUpPlayers": 312,
  "totalInAlbumAndCalledUp": 156,
  "totalOnlyInAlbum": 60,
  "totalCalledUpWithoutSticker": 156,
  "paniniAccuracyRate": 72.2,
  "errorRate": 27.8
}
```

**Response `/api/statistics/ranking`:**

```json
[
  {
    "rank": 1,
    "team": {
      "id": "uuid",
      "name": "Brasil",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "badge_url": "...",
      "fifa_code": "BRA"
    },
    "statistics": {
      "paniniAccuracyRate": 72.2,
      "errorRate": 27.8
    }
  }
]
```

---

### **Clubs**

| Método | Endpoint             | Descrição                                  |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/api/clubs`         | Lista todos os clubes                      |
| GET    | `/api/clubs/ranking` | Ranking de clubes por número de convocados |

**Response `/api/clubs`:**

```json
{
  "total": 120,
  "data": [
    {
      "id": "uuid",
      "name": "Real Madrid",
      "slug": "real-madrid",
      "countryCode": "ESP",
      "badgeUrl": "https://cdn.cloudfront.net/clubs-badges/real-madrid.png",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Manchester City",
      "slug": "manchester-city",
      "countryCode": "ENG",
      "badgeUrl": "https://cdn.cloudfront.net/clubs-badges/man-city.png",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Response `/api/clubs/ranking`:**

```json
[
  {
    "id": "uuid",
    "name": "Real Madrid",
    "slug": "real-madrid",
    "countryCode": "ESP",
    "badgeUrl": "https://cdn.cloudfront.net/clubs-badges/real-madrid.png",
    "playerCount": 15,
    "percentage": 1.2
  },
  {
    "id": "uuid",
    "name": "Manchester City",
    "slug": "manchester-city",
    "countryCode": "ENG",
    "badgeUrl": "https://cdn.cloudfront.net/clubs-badges/man-city.png",
    "playerCount": 12,
    "percentage": 0.96
  }
]
```

**Cálculo:**

- `playerCount`: Total de jogadores convocados que jogam no clube
- `percentage`: (playerCount / 1248 total convocados) × 100
- Ordenado por `playerCount` (decrescente)

---

## 🔐 AUTENTICAÇÃO

### Recomendação: **JWT com Refresh Tokens**

#### Entidade **User** (Admin)

```json
{
  "id": "uuid",
  "email": "admin@stickerlab.com",
  "password_hash": "bcrypt_hash",
  "name": "Admin",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Endpoints de Auth

| Método | Endpoint            | Descrição                           |
| ------ | ------------------- | ----------------------------------- |
| POST   | `/api/auth/login`   | Login (retorna JWT + refresh token) |
| POST   | `/api/auth/refresh` | Renova access token                 |
| POST   | `/api/auth/logout`  | Logout (invalida refresh token)     |
| GET    | `/api/auth/me`      | Dados do usuário logado             |

#### Permissões

- **Público (sem auth)**:
  - GET `/api/teams`, `/api/teams/:id`
  - GET `/api/groups`
  - GET `/api/statistics/*`
  - GET `/api/players`

- **Admin (auth required)**:
  - POST/PUT/DELETE em `/api/teams`
  - POST/PUT/DELETE em `/api/players`
  - Upload de badges (S3)

---

## 📁 UPLOAD DE ARQUIVOS (AWS S3)

### Tipo de Arquivo

- **Imagens**: PNG (badges das seleções)
- **Tamanho**: Máximo 2MB
- **Formato**: PNG com fundo transparente

### Entidades com Arquivos

1. **Team**: `badge_url` (badge/badge da seleção)

### Estratégia de Storage

#### **S3 Bucket Structure**

```
stickerlab-album/
├── teams-badges/
│   ├── bra.png
│   ├── arg.png
│   ├── mex.png
│   └── ...
```

#### **Acesso**

- **Público**: URLs dos badges são públicas (CloudFront CDN)
- **Naming Convention**: `{fifa_code}.png` (lowercase)

#### **Endpoint de Upload**

```
POST /api/teams/:id/upload-badge
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Body:
{
  "file": <binary>
}

Response:
{
  "badge_url": "https://cdn.cloudfront.net/teams-badges/bra.png"
}
```

#### **Regras de Negócio**

1. Apenas admins podem fazer upload
2. Ao atualizar badge, **deletar imagem antiga do S3**
3. Validar:
   - Formato: apenas PNG
   - Tamanho: máximo 2MB
   - Dimensões: mínimo 256x256px

#### **Delete em Cascade**

- Ao deletar Team → deletar `badge_url` do S3

---

## ⚙️ REGRAS DE NEGÓCIO

### **Team (Seleção)**

1. ✅ `name` deve ser único
2. ✅ `slug` deve ser único e gerado automaticamente do name
3. ✅ `fifa_code` deve ter 3 caracteres e ser único
4. ✅ `group` deve estar entre A-L
5. ✅ Cores devem ser hexadecimais válidas (#RRGGBB)
6. ✅ Badge é obrigatório (validar URL S3)

### **Player (Jogador)**

1. ✅ `canonical_name` usado para match entre album e called_up
2. ✅ Se `in_album = true` → `album_code` obrigatório
3. ✅ Se `in_album = false` → `album_code` deve ser null
4. ✅ `album_code` único por seleção (não pode repetir)
5. ✅ Um jogador não pode ter `in_album = false` e `called_up = false` ao mesmo tempo

### **Statistics (Cálculos)**

Calculados dinamicamente via queries:

**Panini Accuracy Rate**:

```
(jogadores in_album AND called_up / total jogadores in_album) * 100
```

```
(jogadores in_album AND called_up / total jogadores called_up) * 100
```

```
(jogadores called_up AND NOT in_album / total jogadores called_up) * 100
```

**Error Rate**:

```
(jogadores in_album AND NOT called_up / total jogadores in_album) * 100
```

---

## 🗃️ SCHEMA SQL (PostgreSQL)

```sql
-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(1) UNIQUE NOT NULL CHECK (name ~ '^[A-L]$'),
  display_order INT UNIQUE NOT NULL CHECK (display_order BETWEEN 1 AND 12),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  fifa_code VARCHAR(3) UNIQUE NOT NULL,
  badge_url TEXT NOT NULL,
  group_name VARCHAR(1) NOT NULL REFERENCES groups(name) ON DELETE CASCADE,
  color_primary VARCHAR(7) NOT NULL CHECK (color_primary ~ '^#[0-9A-F]{6}$'),
  color_secondary VARCHAR(7) NOT NULL CHECK (color_secondary ~ '^#[0-9A-F]{6}$'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_group ON teams(group_name);
CREATE INDEX idx_teams_slug ON teams(slug);

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  canonical_name VARCHAR(200) NOT NULL,
  album_code VARCHAR(10),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  in_album BOOLEAN DEFAULT FALSE,
  called_up BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_album_code CHECK (
    (in_album = TRUE AND album_code IS NOT NULL) OR
    (in_album = FALSE AND album_code IS NULL)
  ),
  CONSTRAINT chk_player_status CHECK (in_album = TRUE OR called_up = TRUE),
  UNIQUE(team_id, album_code)
);

CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_in_album ON players(in_album);
CREATE INDEX idx_players_called_up ON players(called_up);

-- Users (Admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 🔍 QUERIES PRINCIPAIS

### 1. **Listar grupos com seleções**

```sql
SELECT
  g.id,
  g.name,
  g.display_order,
  json_agg(
    json_build_object(
      'id', t.id,
      'name', t.name,
      'slug', t.slug,
      'fifa_code', t.fifa_code,
      'badge_url', t.badge_url
    ) ORDER BY t.name
  ) as teams
FROM groups g
LEFT JOIN teams t ON g.name = t.group_name
GROUP BY g.id, g.name, g.display_order
ORDER BY g.display_order;
```

### 2. **Buscar seleção com estatísticas**

```sql
WITH team_data AS (
  SELECT
    t.*,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE) as album_count,
    COUNT(p.id) FILTER (WHERE p.called_up = TRUE) as called_up_count,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE AND p.called_up = TRUE) as both_count,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE AND p.called_up = FALSE) as only_album_count,
    COUNT(p.id) FILTER (WHERE p.in_album = FALSE AND p.called_up = TRUE) as only_called_up_count
  FROM teams t
  LEFT JOIN players p ON t.id = p.team_id
  WHERE t.slug = $1
  GROUP BY t.id
)
SELECT
  *,
  (both_count::FLOAT / NULLIF(album_count, 0)) * 100 as panini_accuracy_rate,
  (both_count::FLOAT / NULLIF(called_up_count, 0)) * 100 as squad_coverage,
  (only_called_up_count::FLOAT / NULLIF(called_up_count, 0)) * 100 as renewal_index,
  (only_album_count::FLOAT / NULLIF(album_count, 0)) * 100 as error_rate
FROM team_data;
```

### 3. **Ranking de seleções**

```sql
WITH team_stats AS (
  SELECT
    t.id,
    t.name,
    t.slug,
    t.badge_url,
    t.fifa_code,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE) as album_count,
    COUNT(p.id) FILTER (WHERE p.called_up = TRUE) as called_up_count,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE AND p.called_up = TRUE) as both_count,
    COUNT(p.id) FILTER (WHERE p.in_album = TRUE AND p.called_up = FALSE) as only_album_count,
    COUNT(p.id) FILTER (WHERE p.in_album = FALSE AND p.called_up = TRUE) as only_called_up_count
  FROM teams t
  LEFT JOIN players p ON t.id = p.team_id
  GROUP BY t.id
)
SELECT
  ROW_NUMBER() OVER (ORDER BY (both_count::FLOAT / NULLIF(album_count, 0)) DESC) as rank,
  *,
  (both_count::FLOAT / NULLIF(album_count, 0)) * 100 as panini_accuracy_rate,
  (both_count::FLOAT / NULLIF(called_up_count, 0)) * 100 as squad_coverage,
  (only_called_up_count::FLOAT / NULLIF(called_up_count, 0)) * 100 as renewal_index,
  (only_album_count::FLOAT / NULLIF(album_count, 0)) * 100 as error_rate
FROM team_stats
WHERE album_count > 0
ORDER BY panini_accuracy_rate DESC;
```

---

## 📦 STACK RECOMENDADA

### Back-End

- **Framework**: Node.js + Express.js (ou Fastify)
- **ORM**: Prisma ou TypeORM
- **Database**: PostgreSQL 15+
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Upload**: AWS SDK v3 (@aws-sdk/client-s3)
- **Validation**: Zod ou Yup
- **API Docs**: Swagger/OpenAPI

### Infraestrutura

- **Database**: AWS RDS PostgreSQL ou Supabase
- **Storage**: AWS S3 + CloudFront (CDN)
- **API**: AWS Lambda + API Gateway (ou EC2/ECS)
- **Env Variables**: AWS Secrets Manager ou .env

### Exemplo .env

```
DATABASE_URL=postgresql://user:pass@host:5432/stickerlab
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
AWS_REGION=us-east-1
AWS_S3_BUCKET=stickerlab-album
AWS_CLOUDFRONT_URL=https://d123.cloudfront.net
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

---

## 🚀 MIGRATION DATA (Seed)

Criar script para migrar dados atuais de `data/teams/team-data.ts` para PostgreSQL:

```typescript
// scripts/seed.ts
import { teams as mockTeams } from "../data/teams/team-data";
import { groups as mockGroups } from "../data/teams/constants";

async function seed() {
  // 1. Inserir grupos
  for (const group of mockGroups) {
    await db.groups.create({
      name: group.name,
      display_order: group.name.charCodeAt(0) - 64, // A=1, B=2, ...
    });
  }

  // 2. Inserir seleções
  for (const team of mockTeams) {
    const teamRecord = await db.teams.create({
      name: team.team,
      slug: getSlug(team.team),
      fifa_code: fifaCodes[team.team],
      badge_url: `https://cdn.cloudfront.net/teams-badges/${fifaCodes[team.team].toLowerCase()}.png`,
      group_name: groups.find((g) => g.teams.includes(team.team))?.name,
      color_primary: teamColors[team.team].primary,
      color_secondary: teamColors[team.team].secondary,
    });

    // 3. Inserir jogadores do álbum
    for (const player of team.album) {
      await db.players.create({
        name: player.player,
        canonical_name: player.canonical_name,
        album_code: player.codigo,
        team_id: teamRecord.id,
        in_album: true,
        called_up: team.called_up.some(
          (p) => p.canonical_name === player.canonical_name,
        ),
      });
    }

    // 4. Inserir jogadores convocados (sem figurinha)
    const calledUpWithoutSticker = team.called_up.filter(
      (cp) => !team.album.some((ap) => ap.canonical_name === cp.canonical_name),
    );

    for (const player of calledUpWithoutSticker) {
      await db.players.create({
        name: player.player,
        canonical_name: player.canonical_name,
        album_code: null,
        team_id: teamRecord.id,
        in_album: false,
        called_up: true,
      });
    }
  }
}
```

---

## 📝 RESUMO FINAL

### Entidades

1. ✅ **Group** (12 registros)
2. ✅ **Team** (48 registros)
3. ✅ **Player** (~1000 registros)
4. ✅ **User** (admin)
5. ✅ **RefreshToken** (auth)

### Endpoints Principais

- `/api/teams` (GET, POST, PUT, DELETE)
- `/api/teams/:id` (GET com estatísticas)
- `/api/players` (GET, POST, PUT, DELETE)
- `/api/players/:id/club` (PATCH — associa clube)
- `/api/groups` (GET)
- `/api/statistics/overall` (GET)
- `/api/statistics/ranking` (GET)
- `/api/clubs` (GET)
- `/api/clubs/ranking` (GET)
- `/api/auth/login|refresh|logout` (POST)
- `/api/teams/:id/upload-badge` (POST)

### Upload S3

- **Arquivo**: PNG (badges)
- **Bucket**: `stickerlab-album/teams-badges/`
- **Acesso**: Público via CloudFront
- **Delete**: Cascade quando deletar Team

### Autenticação

- JWT (15min) + Refresh Token (7 dias)
- Admin pode: POST/PUT/DELETE
- Público pode: GET (leitura)

### Cálculos Dinâmicos

- Computados via SQL agregações (não armazenados)
