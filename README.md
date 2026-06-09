<div align="center">
  <img src="https://dvcammctw5or7.cloudfront.net/team-badges/stickerlab-new.png" alt="StickerLab" width="200" />
    
  **Analyze your sticker collection with precision!**
  
  A modern full-stack application to track and analyze football sticker album collections, comparing album players with real team call-ups.
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)](https://www.postgresql.org/)
</div>

---

## 📸 Screenshots

<div align="center">

### Overall Statistics & Groups

![Overall Statistics](docs/screenshots/screenshots1.png)

![Groups Grid](docs/screenshots/screenshots2.png)

### Rankings

<table>
  <tr>
    <td><img src="docs/screenshots/screenshots4.png" alt="Accuracy Ranking" /></td>
    <td><img src="docs/screenshots/screenshots5.png" alt="Clubs Ranking" /></td>
  </tr>
  <tr>
    <td align="center"><em>StickerLab Accuracy Ranking</em></td>
    <td align="center"><em>Clubs Ranking</em></td>
  </tr>
</table>

### Team Detail

![Team Detail](docs/screenshots/screenshots6.png)

![Team Players](docs/screenshots/screenshots7.png)

### Mobile

<img src="docs/screenshots/sreenshots8.png" alt="Mobile View" width="360" />

</div>

---

## ✨ Features

- 📊 **Overall Statistics** - View comprehensive stats across all teams
- 🏆 **Team Rankings** - See which teams have the best Panini accuracy
- 👥 **Group Organization** - Teams organized by their respective groups
- 🎯 **Accuracy Tracking** - Track Panini album accuracy vs. real call-ups
- 🎨 **Modern UI** - Beautiful, responsive design with dark/light theme support
- ⚡ **Real-time Updates** - Dynamic data fetching with React Query

## 🎯 How It Works

StickerLab compares players featured in sticker albums with those actually called up for teams, providing:

- **✅ In Album & Called Up** - Players correctly included in the album
- **📖 Only in Album** - Players in the album but not called up
- **❌ Called Up Without Sticker** - Players called up but missing from the album

## 🚀 Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Charts**: [Recharts](https://recharts.org/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/) (HTTP nativo)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL 17](https://www.postgresql.org/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Storage**: AWS S3 (team badges)
- **API Docs**: Swagger/OpenAPI
- **Architecture**: Clean Architecture (Domain-Driven Design)

### Package Manager

- [pnpm](https://pnpm.io/)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18+ installed
- **pnpm** installed (`npm install -g pnpm`)
- **PostgreSQL 17** (or use Docker)
- **Docker** (optional, for PostgreSQL container)

## 🛠️ Getting Started

### Backend Setup

#### 1. Clone the repositories

```bash
git clone https://github.com/your-username/stickerlab-server.git
git clone https://github.com/your-username/stickerlab-web.git
```

#### 2. Install dependencies

```bash
cd stickerlab-server
pnpm install
```

#### 3. Set up PostgreSQL database

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
```

This will start a PostgreSQL 17 container on port 5432.

**Option B: Using local PostgreSQL**

Create a database named `stickerlabdb` in your PostgreSQL instance.

#### 4. Configure environment variables

Create a `.env` file in the `stickerlab-server` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stickerlabdb"
PORT=3001
NODE_ENV=development

# AWS S3 Configuration (for badge uploads)
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### 5. Run database migrations

```bash
pnpm prisma migrate dev
```

#### 6. Seed the database (optional)

```bash
pnpm prisma db seed
```

#### 7. Start the API server

```bash
pnpm dev
```

The API will be running at **http://localhost:3001**

**API Documentation**: Access Swagger UI at **http://localhost:3001/api/docs**

---

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd ../stickerlab-web
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

### Backend

```bash
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio (database GUI)
pnpm prisma:seed      # Seed the database
```

### Frontend

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🏗️ Project Structure

### Backend

```
stickerlab-server/
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seeding script
│   └── migrations/       # Migration history
├── src/
│   ├── domain/           # Business entities and interfaces
│   │   ├── entities/     # Team, Player, Group entities
│   │   └── repositories/ # Repository interfaces
│   ├── application/      # Use cases (business logic)
│   │   └── use-cases/    # CRUD operations and statistics
│   ├── infrastructure/   # External concerns
│   │   ├── database/     # Prisma client & repositories
│   │   ├── http/         # HTTP server, routes, controllers
│   │   └── storage/      # S3 service for badge uploads
│   └── shared/           # Shared utilities and errors
├── docker-compose.yml    # PostgreSQL container setup
└── package.json
```

### Frontend

```
stickerlab-web/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── home/            # Home page components
│   ├── shared/          # Reusable shared components
│   └── ui/              # UI component library (Radix)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and constants
├── services/            # API service layer
├── styles/              # Global styles
└── public/              # Static assets
```

## 📡 API Endpoints

The backend exposes the following REST API endpoints:

### Groups

- `GET /api/groups` - Get all groups with teams and statistics
- `GET /api/groups/:id` - Get a specific group by ID
- `POST /api/groups` - Create a new group
- `PUT /api/groups/:id` - Update a group
- `DELETE /api/groups/:id` - Delete a group

### Teams

- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team with players
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `POST /api/teams/:id/badge` - Upload team badge to S3

### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get a specific player
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

### Statistics

- `GET /api/statistics/overall` - Get overall statistics across all teams
- `GET /api/statistics/ranking` - Get team ranking by Panini accuracy

Full API documentation available at: **http://localhost:3001/api/docs**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by the StickerLab team
  <br />
  <br />
  <strong>Mattheus Adhonnay</strong> - Software Developer
</div>
