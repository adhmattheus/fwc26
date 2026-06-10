import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StickerLab API",
      version: "1.0.0",
      description:
        "StickerLab API — comparison between Panini album and actual call-ups",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthTokens: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
        Group: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "C" },
            displayOrder: { type: "integer", example: 3 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Brasil" },
            slug: { type: "string", example: "brasil" },
            fifaCode: { type: "string", example: "BRA" },
            badgeUrl: {
              type: "string",
              nullable: true,
              example: "https://cdn.cloudfront.net/teams-badges/bra.png",
            },
            colorPrimary: { type: "string", example: "#009739" },
            colorSecondary: { type: "string", example: "#FEDD00" },
            groupId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Player: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Alisson" },
            canonicalName: { type: "string", example: "Alisson" },
            albumCode: { type: "string", nullable: true, example: "BRA-2" },
            inAlbum: { type: "boolean", example: true },
            calledUp: { type: "boolean", example: true },
            teamId: { type: "string", format: "uuid" },
            clubId: { type: "string", format: "uuid", nullable: true },
            club: { $ref: "#/components/schemas/Club", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Club: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Real Madrid" },
            slug: { type: "string", example: "real-madrid" },
            countryCode: { type: "string", example: "ESP" },
            badgeUrl: {
              type: "string",
              nullable: true,
              example:
                "https://cdn.cloudfront.net/clubs-badges/real-madrid.png",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ClubRanking: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Real Madrid" },
            slug: { type: "string", example: "real-madrid" },
            countryCode: { type: "string", example: "ESP" },
            badgeUrl: {
              type: "string",
              nullable: true,
              example:
                "https://cdn.cloudfront.net/clubs-badges/real-madrid.png",
            },
            playerCount: { type: "integer", example: 15 },
            percentage: { type: "number", example: 1.2 },
          },
        },
        Statistics: {
          type: "object",
          properties: {
            paniniAccuracyRate: { type: "number", example: 72.22 },
            errorRate: { type: "number", example: 27.78 },
            mostRepresentedClub: {
              type: "object",
              nullable: true,
              properties: {
                club: { type: "string", example: "Real Madrid" },
                playerCount: { type: "integer", example: 3 },
                totalPlayers: { type: "integer", example: 26 },
                percentage: { type: "number", example: 11.54 },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Team not found" },
          },
        },
      },
    },
    paths: {
      "/auth/login": {
        post: {
          summary: "Login",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email", example: "admin@stickerlab.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful — returns access and refresh tokens",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthTokens" },
                },
              },
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/refresh": {
        post: {
          summary: "Refresh access token",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refreshToken"],
                  properties: {
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "New access and refresh tokens",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthTokens" },
                },
              },
            },
            401: {
              description: "Invalid or expired refresh token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          summary: "Logout",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refreshToken"],
                  properties: {
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Logout realizado com sucesso" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/groups": {
        get: {
          summary: "List all groups",
          tags: ["Groups"],
          responses: {
            200: {
              description: "List of groups",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Group" },
                  },
                },
              },
            },
          },
        },
      },
      "/teams": {
        get: {
          summary: "List all teams",
          tags: ["Teams"],
          responses: {
            200: {
              description: "List of teams",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Team" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a team",
          tags: ["Teams"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "name",
                    "fifaCode",
                    "groupId",
                    "colorPrimary",
                    "colorSecondary",
                  ],
                  properties: {
                    name: { type: "string", example: "Argentina" },
                    fifaCode: { type: "string", example: "ARG" },
                    groupId: { type: "string", format: "uuid" },
                    colorPrimary: { type: "string", example: "#75AADB" },
                    colorSecondary: { type: "string", example: "#FFFFFF" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Team created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
          },
        },
      },
      "/teams/{id}": {
        get: {
          summary: "Get team by ID",
          tags: ["Teams"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                example: "550e8400-e29b-41d4-a716-446655440000",
              },
            },
          ],
          responses: {
            200: {
              description: "Team with players and statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      team: { $ref: "#/components/schemas/Team" },
                      players: {
                        type: "object",
                        properties: {
                          album: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Player" },
                          },
                          calledUp: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Player" },
                          },
                        },
                      },
                      comparison: {
                        type: "object",
                        properties: {
                          inAlbumAndCalledUp: {
                            type: "object",
                            properties: {
                              total: { type: "integer" },
                              players: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Player" },
                              },
                            },
                          },
                          onlyInAlbum: {
                            type: "object",
                            properties: {
                              total: { type: "integer" },
                              players: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Player" },
                              },
                            },
                          },
                          calledUpWithoutSticker: {
                            type: "object",
                            properties: {
                              total: { type: "integer" },
                              players: {
                                type: "array",
                                items: { $ref: "#/components/schemas/Player" },
                              },
                            },
                          },
                        },
                      },
                      statistics: { $ref: "#/components/schemas/Statistics" },
                    },
                  },
                },
              },
            },
            404: {
              description: "Team not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        put: {
          summary: "Update team",
          tags: ["Teams"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                example: "550e8400-e29b-41d4-a716-446655440000",
              },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    fifaCode: { type: "string" },
                    groupId: { type: "string", format: "uuid" },
                    colorPrimary: { type: "string" },
                    colorSecondary: { type: "string" },
                    badgeUrl: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Team updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete team",
          tags: ["Teams"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                example: "550e8400-e29b-41d4-a716-446655440000",
              },
            },
          ],
          responses: {
            200: {
              description: "Team deleted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Team deleted successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/teams/{id}/upload-badge": {
        post: {
          summary: "Upload team badge",
          tags: ["Teams"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Team ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description: "PNG file of the team badge",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Badge updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            404: {
              description: "Team not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            400: {
              description: "Invalid file",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/players": {
        get: {
          summary: "List players by team",
          tags: ["Players"],
          parameters: [
            {
              name: "team_id",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "List of players",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Player" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create player",
          security: [{ bearerAuth: [] }],
          description:
            "Creates a player. `clubId` is optional — if omitted, use `PATCH /players/{id}/club` to assign a club afterwards.",
          tags: ["Players"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "name",
                    "canonicalName",
                    "inAlbum",
                    "calledUp",
                    "teamId",
                  ],
                  properties: {
                    name: { type: "string", example: "Alisson" },
                    canonicalName: { type: "string", example: "Alisson" },
                    albumCode: {
                      type: "string",
                      nullable: true,
                      example: "BRA-2",
                    },
                    inAlbum: { type: "boolean", example: true },
                    calledUp: { type: "boolean", example: true },
                    teamId: { type: "string", format: "uuid" },
                    clubId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                      description: "Optional — assign a club at creation time",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Player created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
          },
        },
      },
      "/players/{id}": {
        put: {
          summary: "Update player",
          security: [{ bearerAuth: [] }],
          description:
            "Updates player fields. `clubId` can also be set here or via `PATCH /players/{id}/club`.",
          tags: ["Players"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    canonicalName: { type: "string" },
                    albumCode: { type: "string", nullable: true },
                    inAlbum: { type: "boolean" },
                    calledUp: { type: "boolean" },
                    clubId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                      description: "Optional — assign or remove a club",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Player updated. Response includes the current club relation.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            404: {
              description: "Player not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete player",
          tags: ["Players"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Player deleted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Player deleted successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/players/{id}/club": {
        patch: {
          summary: "Assign a club to a player",
          tags: ["Players"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Player ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["clubId"],
                  properties: {
                    clubId: {
                      type: "string",
                      format: "uuid",
                      example: "550e8400-e29b-41d4-a716-446655440000",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Player with updated club",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            400: {
              description: "clubId is required",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Player or Club not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/statistics/overall": {
        get: {
          summary: "Overall statistics",
          tags: ["Statistics"],
          responses: {
            200: {
              description: "Overall statistics of all teams",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalTeams: { type: "integer", example: 12 },
                      totalAlbumPlayers: { type: "integer", example: 216 },
                      totalCalledUpPlayers: { type: "integer", example: 312 },
                      totalInAlbumAndCalledUp: {
                        type: "integer",
                        example: 156,
                      },
                      totalOnlyInAlbum: { type: "integer", example: 60 },
                      totalCalledUpWithoutSticker: {
                        type: "integer",
                        example: 156,
                      },
                      paniniAccuracyRate: { type: "number", example: 72.22 },
                      errorRate: { type: "number", example: 27.78 },
                      mostRepresentedClub: {
                        type: "object",
                        nullable: true,
                        properties: {
                          club: { type: "string", example: "Real Madrid CF" },
                          percentage: { type: "number", example: 21.5 },
                          playerCount: { type: "integer", example: 120 },
                          totalPlayers: { type: "integer", example: 1248 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/statistics/ranking": {
        get: {
          summary: "Teams ranking",
          tags: ["Statistics"],
          responses: {
            200: {
              description: "Teams ranking by Panini accuracy rate",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        rank: { type: "integer", example: 1 },
                        team: { $ref: "#/components/schemas/Team" },
                        statistics: { $ref: "#/components/schemas/Statistics" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/clubs": {
        get: {
          summary: "List all clubs",
          tags: ["Clubs"],
          responses: {
            200: {
              description: "List of all clubs with total count",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer", example: 120 },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Club" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/clubs/ranking": {
        get: {
          summary: "Clubs ranking by called-up players with sticker",
          tags: ["Clubs"],
          responses: {
            200: {
              description: "Clubs ranking by players who are called-up AND have a sticker in the album. Ordered by playerCount desc, then alphabetically.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ClubRanking" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
