# StickerLab Server — Documentação da Arquitetura Back-End

> Node.js • TypeScript • Prisma • PostgreSQL • AWS S3

---

## 1. Visão Geral

O StickerLab Server é uma API REST construída em Node.js puro (sem framework), seguindo os princípios da Clean Architecture e SOLID. O sistema compara jogadores do álbum Panini com os convocados reais das seleções na Copa do Mundo 2026, gerando estatísticas de acerto e erro.

**Stack utilizada:**

- Node.js 24 + TypeScript 6 — Runtime e tipagem
- Prisma 7 — ORM para acesso ao banco de dados
- PostgreSQL 16 — Banco de dados relacional (via Docker)
- AWS S3 + CloudFront — Armazenamento e CDN de imagens
- Swagger UI — Documentação interativa dos endpoints

---

## 2. Porta de Entrada do Servidor

A porta de entrada é o arquivo `server.ts`, localizado em:

```
src/infrastructure/http/server.ts
```

É ele quem:

- Cria o servidor HTTP nativo do Node.js
- Define a porta `3001` onde a API fica disponível
- Configura o CORS (restringe acesso às origens definidas em `ALLOWED_ORIGINS`)
- Recebe **todas** as requisições que chegam e passa para o router

> **Em termos simples:** o `server.ts` é como a recepção de um prédio. Toda pessoa (requisição) que chega passa primeiro pela recepção, que verifica se pode entrar (CORS) e direciona para o andar certo (router).

---

## 3. Fluxo de uma Requisição

Quando o front-end faz uma chamada para a API, por exemplo `GET /api/teams/550e8400-e29b-41d4-a716-446655440000`, ela percorre o seguinte caminho:

| Etapa | Arquivo                | O que faz                                                       |
| ----- | ---------------------- | --------------------------------------------------------------- |
| 1     | `server.ts`            | Recebe a requisição HTTP na porta 3001 e passa para o router    |
| 2     | `router.ts`            | Lê a URL (`/api/teams/...`) e direciona para `teamRoutes`       |
| 3     | `teamRoutes.ts`        | Identifica o método (GET) e o slug (brasil), chama o controller |
| 4     | `TeamController`       | Extrai os dados da requisição e chama o use case correto        |
| 5     | `GetTeamBySlugUseCase` | Executa a regra de negócio: busca time e calcula estatísticas   |
| 6     | `TeamRepository`       | Faz a query no PostgreSQL via Prisma e retorna os dados         |
| 7     | `Controller`           | Recebe os dados do use case e monta a resposta JSON             |
| 8     | Resposta               | Retorna o JSON com status 200 para o front-end                  |

---

## 4. Estrutura de Pastas

O projeto segue a Clean Architecture, dividida em 4 camadas principais:

```
src/
├── domain/                          # Camada 1 — O coração
│   ├── entities/                    # Estruturas de dados
│   │   ├── Group.ts
│   │   ├── Team.ts
│   │   ├── Player.ts
│   │   ├── Club.ts
│   │   ├── User.ts
│   │   └── RefreshToken.ts
│   └── repositories/                # Contratos (interfaces)
│       ├── IGroupRepository.ts
│       ├── ITeamRepository.ts
│       ├── IPlayerRepository.ts
│       ├── IClubRepository.ts
│       ├── IUserRepository.ts
│       ├── IRefreshTokenRepository.ts
│       └── IStorageService.ts
│
├── application/                     # Camada 2 — Os casos de uso
│   └── use-cases/
│       ├── GetAllGroupsUseCase.ts
│       ├── GetAllTeamsUseCase.ts
│       ├── GetTeamByIdUseCase.ts
│       ├── GetAllPlayersUseCase.ts
│       ├── GetOverallStatisticsUseCase.ts
│       ├── GetRankingUseCase.ts
│       ├── CreateTeamUseCase.ts
│       ├── UpdateTeamUseCase.ts
│       ├── DeleteTeamUseCase.ts
│       ├── CreatePlayerUseCase.ts
│       ├── UpdatePlayerUseCase.ts
│       ├── UpdatePlayerClubUseCase.ts
│       ├── DeletePlayerUseCase.ts
│       ├── GetAllClubsUseCase.ts
│       ├── GetClubRankingUseCase.ts
│       ├── UploadTeamBadgeUseCase.ts
│       ├── LoginUseCase.ts
│       ├── RefreshTokenUseCase.ts
│       └── LogoutUseCase.ts
│
├── infrastructure/                  # Camada 3 — O mundo real
│   ├── auth/
│   │   └── JwtService.ts            # Geração e validação de tokens JWT
│   ├── database/
│   │   ├── prismaClient.ts          # Instância única do Prisma (Singleton)
│   │   └── repositories/
│   │       ├── GroupRepository.ts
│   │       ├── TeamRepository.ts
│   │       ├── PlayerRepository.ts
│   │       ├── ClubRepository.ts
│   │       ├── UserRepository.ts
│   │       └── RefreshTokenRepository.ts
│   ├── storage/
│   │   └── S3Service.ts             # Upload no AWS S3
│   └── http/
│       ├── server.ts                # Servidor HTTP + CORS + security headers
│       ├── router.ts                # Distribuidor central de rotas
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── groupRoutes.ts
│       │   ├── teamRoutes.ts
│       │   ├── playerRoutes.ts
│       │   ├── clubRoutes.ts
│       │   └── statisticsRoutes.ts
│       ├── controllers/
│       │   ├── AuthController.ts
│       │   ├── GroupController.ts
│       │   ├── TeamController.ts
│       │   ├── PlayerController.ts
│       │   ├── ClubController.ts
│       │   └── StatisticsController.ts
│       ├── middlewares/
│       │   └── authMiddleware.ts    # Valida Bearer token nas rotas privadas
│       ├── helpers/
│       │   ├── httpResponse.ts      # Centraliza envio de respostas JSON
│       │   └── parseBody.ts         # Lê o body das requisições
│       └── docs/
│           └── swagger.ts           # Documentação Swagger / OpenAPI
│
└── shared/                          # Camada 4 — Compartilhado
    └── errors/
        └── AppError.ts              # Classe de erro padrão
```

### 4.1 Domain — O Coração

É a camada mais interna. Contém as regras de negócio puras, sem depender de nenhuma tecnologia externa. Se trocar o banco de dados ou o framework, essa camada não muda.

- **entities/** — As estruturas de dados: `Group`, `Team`, `Player`
- **repositories/** — Os contratos (interfaces) que definem _o que_ cada repositório precisa fazer, sem dizer _como_

### 4.2 Application — Os Casos de Uso

Aqui ficam as ações que o sistema pode executar. Cada use case tem uma única responsabilidade e não sabe nada sobre banco de dados, HTTP ou AWS — ele só conhece as interfaces do domínio.

### 4.3 Infrastructure — O Mundo Real

Aqui entram todas as tecnologias concretas. É o _"como"_ — enquanto as camadas internas são o _"o quê"_.

### 4.4 Shared — Compartilhado

Utilitários e classes que qualquer camada pode usar, como o `AppError`.

---

## 5. A Regra de Ouro da Arquitetura

As dependências sempre apontam para dentro:

```
HTTP (Controller)
    ↓
Application (Use Case)
    ↓
Domain (Interface do Repositório)
    ↓
Infrastructure (Repositório concreto com Prisma)
    ↓
PostgreSQL
```

O use case não sabe que é Prisma. O domínio não sabe que é PostgreSQL. Cada camada faz apenas o seu papel.

---

## 6. Fluxo de Upload de Badge (S3)

Quando um badge de seleção é enviado para a API:

```
POST /api/teams/:id/upload-badge
```

| Etapa                     | O que acontece                                                      |
| ------------------------- | ------------------------------------------------------------------- |
| 1. Front-end              | Envia o arquivo PNG via `multipart/form-data`                       |
| 2. TeamController         | Recebe o arquivo em memória usando `multiparty`                     |
| 3. UploadTeamBadgeUseCase | Verifica se o time existe, se já tem badge (deleta o antigo)        |
| 4. S3Service              | Faz upload do arquivo para o bucket `StickerLab-team-badges` na AWS |
| 5. CloudFront             | Serve a imagem via CDN com URL pública                              |
| 6. TeamRepository         | Salva a URL do CloudFront no campo `badge_url` da tabela `teams`    |
| 7. Resposta               | Retorna `{ badgeUrl, message }` com status 200                      |

**URL gerada:**

```
https://dvcammctw5or7.cloudfront.net/team-badges/bra.png
```

O front-end usa essa URL diretamente em tags `<img>` sem precisar saber nada sobre o S3.

---

## 7. Endpoints Disponíveis

> Legenda: 🌐 **Pública** — sem autenticação | 🔒 **Privada** — requer `Authorization: Bearer <accessToken>`

### Auth

| Acesso | Método | URL                  | Descrição                                         |
| ------ | ------ | -------------------- | ------------------------------------------------- |
| 🌐     | POST   | `/api/auth/login`    | Autentica usuário e retorna access + refresh token |
| 🌐     | POST   | `/api/auth/refresh`  | Troca o refresh token por novos tokens            |
| 🌐     | POST   | `/api/auth/logout`   | Invalida o refresh token                          |

### Groups

| Acesso | Método | URL           | Descrição                       |
| ------ | ------ | ------------- | ------------------------------- |
| 🌐     | GET    | `/api/groups` | Lista todos os grupos (A até L) |

### Teams

| Acesso | Método | URL                           | Descrição                                  |
| ------ | ------ | ----------------------------- | ------------------------------------------ |
| 🌐     | GET    | `/api/teams`                  | Lista todas as seleções                    |
| 🌐     | GET    | `/api/teams/:id`              | Busca seleção com jogadores e estatísticas |
| 🔒     | POST   | `/api/teams`                  | Cria uma nova seleção                      |
| 🔒     | PUT    | `/api/teams/:id`              | Atualiza dados de uma seleção              |
| 🔒     | DELETE | `/api/teams/:id`              | Remove uma seleção                         |
| 🔒     | POST   | `/api/teams/:id/upload-badge` | Faz upload do badge no S3                  |

### Players

| Acesso | Método | URL                        | Descrição                      |
| ------ | ------ | -------------------------- | ------------------------------ |
| 🌐     | GET    | `/api/players?team_id=:id` | Lista jogadores de uma seleção |
| 🔒     | POST   | `/api/players`             | Cria um novo jogador           |
| 🔒     | PUT    | `/api/players/:id`         | Atualiza dados de um jogador   |
| 🔒     | DELETE | `/api/players/:id`         | Remove um jogador              |
| 🔒     | PATCH  | `/api/players/:id/club`    | Associa um clube a um jogador  |

### Statistics

| Acesso | Método | URL                       | Descrição                                                          |
| ------ | ------ | ------------------------- | ------------------------------------------------------------------ |
| 🌐     | GET    | `/api/statistics/overall` | Estatísticas gerais de todas as seleções + clube mais representado |
| 🌐     | GET    | `/api/statistics/ranking` | Ranking de seleções por taxa de acerto Panini                      |

### Clubs

| Acesso | Método | URL                  | Descrição                                  |
| ------ | ------ | -------------------- | ------------------------------------------ |
| 🌐     | GET    | `/api/clubs`         | Lista todos os clubes                      |
| 🌐     | GET    | `/api/clubs/ranking` | Ranking de clubes por jogadores convocados |

### Docs

| Acesso | Método | URL              | Descrição                     |
| ------ | ------ | ---------------- | ----------------------------- |
| 🌐     | GET    | `/api/docs`      | Swagger UI interativo         |
| 🌐     | GET    | `/api/docs/json` | Especificação OpenAPI em JSON |

---

## 8. Como as Estatísticas são Calculadas

Para cada seleção, os jogadores são divididos em grupos e as métricas calculadas assim:

| Métrica                  | Fórmula                                                |
| ------------------------ | ------------------------------------------------------ |
| **Panini Accuracy Rate** | (no álbum E convocados) ÷ (total no álbum) × 100       |
| **Error Rate**           | (no álbum MAS não convocados) ÷ (total no álbum) × 100 |

**Estatísticas Gerais** (endpoint `/api/statistics/overall`):

- Incluem agregados de todas as seleções
- Campo `mostRepresentedClub`: identifica o clube com mais jogadores convocados globalmente, sua porcentagem e contagem total

**Estatísticas por Seleção** (endpoint `/api/teams/:id`):

- Campo `mostRepresentedClub` dentro de `statistics`: clube com mais jogadores **convocados e com figurinha** naquela seleção
- `playerCount`: jogadores desse clube nessa seleção; `totalPlayers`: total de convocados da seleção
- Pode ser `null` se não houver jogadores convocados com figurinha ainda

**Ranking de Clubes** (endpoint `/api/clubs/ranking`):

- Considera apenas jogadores **convocados e com figurinha no álbum**
- Em caso de empate no `playerCount`, ordenação alfabética pelo nome do clube

---

## 9. Infraestrutura AWS Configurada

| Serviço          | Detalhes                                                          |
| ---------------- | ----------------------------------------------------------------- |
| **S3 Bucket**    | `StickerLab-team-badges` (us-east-1) — armazena os arquivos PNG   |
| **CloudFront**   | `dvcammctw5or7.cloudfront.net` — CDN que serve as imagens         |
| **IAM User**     | `StickerLab-s3-user` — permissão `AmazonS3FullAccess`             |
| **Budget Alert** | `StickerLab-budget` — alerta de gasto zero para proteção da conta |

---

## 10. Variáveis de Ambiente (.env)

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/stickerlabdb"

# Docker Compose
POSTGRES_USER=stickerlab
POSTGRES_PASSWORD=sua-senha-aqui
POSTGRES_DB=stickerlabdb

# AWS S3
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nome-do-seu-bucket
CLOUDFRONT_URL=https://sua-distribuicao.cloudfront.net

# Servidor
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,https://seu-dominio.com

# JWT
JWT_SECRET=seu-jwt-secret-aqui
JWT_REFRESH_SECRET=seu-jwt-refresh-secret-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

> ⚠️ O arquivo `.env` nunca deve ser commitado no Git. Use o `.env.example` como base.

---

## 11. Comandos Úteis

```bash
# Subir o banco de dados
docker compose up -d

# Rodar o servidor em desenvolvimento
pnpm dev

# Rodar o seed (grupos e seleções)
npx prisma db seed

# Visualizar o banco no browser
npx prisma studio

# Resetar o banco
npx prisma migrate reset
```

---

## 12. Próximos Passos

- Inserir jogadores — via API ou script de seed completo
- Deploy — AWS Lambda ou ECS + RDS para produção

---

_StickerLab Server — Documentação gerada em Junho/2026_
