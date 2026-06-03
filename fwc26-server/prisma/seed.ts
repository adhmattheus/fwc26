import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Groups
  const groups = await Promise.all([
    prisma.group.upsert({
      where: { name: "A" },
      update: {},
      create: { name: "A", displayOrder: 1 },
    }),
    prisma.group.upsert({
      where: { name: "B" },
      update: {},
      create: { name: "B", displayOrder: 2 },
    }),
    prisma.group.upsert({
      where: { name: "C" },
      update: {},
      create: { name: "C", displayOrder: 3 },
    }),
    prisma.group.upsert({
      where: { name: "D" },
      update: {},
      create: { name: "D", displayOrder: 4 },
    }),
    prisma.group.upsert({
      where: { name: "E" },
      update: {},
      create: { name: "E", displayOrder: 5 },
    }),
    prisma.group.upsert({
      where: { name: "F" },
      update: {},
      create: { name: "F", displayOrder: 6 },
    }),
    prisma.group.upsert({
      where: { name: "G" },
      update: {},
      create: { name: "G", displayOrder: 7 },
    }),
    prisma.group.upsert({
      where: { name: "H" },
      update: {},
      create: { name: "H", displayOrder: 8 },
    }),
    prisma.group.upsert({
      where: { name: "I" },
      update: {},
      create: { name: "I", displayOrder: 9 },
    }),
    prisma.group.upsert({
      where: { name: "J" },
      update: {},
      create: { name: "J", displayOrder: 10 },
    }),
    prisma.group.upsert({
      where: { name: "K" },
      update: {},
      create: { name: "K", displayOrder: 11 },
    }),
    prisma.group.upsert({
      where: { name: "L" },
      update: {},
      create: { name: "L", displayOrder: 12 },
    }),
  ]);

  console.log(`✅ ${groups.length} groups created`);

  // Helper to find group by name
  const getGroup = (name: string) => groups.find((g) => g.name === name)!;

  // Teams with complete data
  const teams = [
    {
      name: "Brasil",
      slug: "brasil",
      fifaCode: "BRA",
      groupId: getGroup("C").id,
      colorPrimary: "#009739",
      colorSecondary: "#FEDD00",
    },
    {
      name: "Marrocos",
      slug: "marrocos",
      fifaCode: "MAR",
      groupId: getGroup("C").id,
      colorPrimary: "#C1272D",
      colorSecondary: "#006233",
    },
    {
      name: "Haiti",
      slug: "haiti",
      fifaCode: "HAI",
      groupId: getGroup("C").id,
      colorPrimary: "#00209F",
      colorSecondary: "#D21034",
    },
    {
      name: "Escócia",
      slug: "escocia",
      fifaCode: "SCO",
      groupId: getGroup("C").id,
      colorPrimary: "#003865",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "México",
      slug: "mexico",
      fifaCode: "MEX",
      groupId: getGroup("A").id,
      colorPrimary: "#006847",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "África do Sul",
      slug: "africa-do-sul",
      fifaCode: "RSA",
      groupId: getGroup("A").id,
      colorPrimary: "#007A4D",
      colorSecondary: "#FFB81C",
    },
    {
      name: "Coreia do Sul",
      slug: "coreia-do-sul",
      fifaCode: "KOR",
      groupId: getGroup("A").id,
      colorPrimary: "#C60C30",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Tchéquia",
      slug: "tchequia",
      fifaCode: "CZE",
      groupId: getGroup("A").id,
      colorPrimary: "#D7141A",
      colorSecondary: "#11457E",
    },
    {
      name: "Canadá",
      slug: "canada",
      fifaCode: "CAN",
      groupId: getGroup("B").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Bósnia e Herzegovina",
      slug: "bosnia-e-herzegovina",
      fifaCode: "BIH",
      groupId: getGroup("B").id,
      colorPrimary: "#002395",
      colorSecondary: "#FECB00",
    },
    {
      name: "Catar",
      slug: "catar",
      fifaCode: "QAT",
      groupId: getGroup("B").id,
      colorPrimary: "#8D1B3D",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Suíça",
      slug: "suica",
      fifaCode: "SUI",
      groupId: getGroup("B").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#FFFFFF",
    },
  ];

  // Teams without complete data
  const teamsBasic = [
    {
      name: "Argentina",
      slug: "argentina",
      fifaCode: "ARG",
      groupId: getGroup("D").id,
      colorPrimary: "#75AADB",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Estados Unidos",
      slug: "estados-unidos",
      fifaCode: "USA",
      groupId: getGroup("D").id,
      colorPrimary: "#002868",
      colorSecondary: "#BF0A30",
    },
    {
      name: "Equador",
      slug: "equador",
      fifaCode: "ECU",
      groupId: getGroup("D").id,
      colorPrimary: "#FFD100",
      colorSecondary: "#034EA2",
    },
    {
      name: "Bolívia",
      slug: "bolivia",
      fifaCode: "BOL",
      groupId: getGroup("D").id,
      colorPrimary: "#D52B1E",
      colorSecondary: "#F4C430",
    },
    {
      name: "Espanha",
      slug: "espanha",
      fifaCode: "ESP",
      groupId: getGroup("E").id,
      colorPrimary: "#AA151B",
      colorSecondary: "#F1BF00",
    },
    {
      name: "Alemanha",
      slug: "alemanha",
      fifaCode: "GER",
      groupId: getGroup("E").id,
      colorPrimary: "#000000",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Japão",
      slug: "japao",
      fifaCode: "JPN",
      groupId: getGroup("E").id,
      colorPrimary: "#BC002D",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Portugal",
      slug: "portugal",
      fifaCode: "POR",
      groupId: getGroup("E").id,
      colorPrimary: "#006600",
      colorSecondary: "#FF0000",
    },
    {
      name: "França",
      slug: "franca",
      fifaCode: "FRA",
      groupId: getGroup("F").id,
      colorPrimary: "#002395",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Inglaterra",
      slug: "inglaterra",
      fifaCode: "ENG",
      groupId: getGroup("F").id,
      colorPrimary: "#FFFFFF",
      colorSecondary: "#CF081F",
    },
    {
      name: "Holanda",
      slug: "holanda",
      fifaCode: "NED",
      groupId: getGroup("F").id,
      colorPrimary: "#FF6600",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Senegal",
      slug: "senegal",
      fifaCode: "SEN",
      groupId: getGroup("F").id,
      colorPrimary: "#00853F",
      colorSecondary: "#FDEF42",
    },
    {
      name: "Bélgica",
      slug: "belgica",
      fifaCode: "BEL",
      groupId: getGroup("G").id,
      colorPrimary: "#000000",
      colorSecondary: "#FF0000",
    },
    {
      name: "Croácia",
      slug: "croacia",
      fifaCode: "CRO",
      groupId: getGroup("G").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Uruguai",
      slug: "uruguai",
      fifaCode: "URU",
      groupId: getGroup("G").id,
      colorPrimary: "#75AADB",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Colômbia",
      slug: "colombia",
      fifaCode: "COL",
      groupId: getGroup("G").id,
      colorPrimary: "#FCD116",
      colorSecondary: "#003087",
    },
    {
      name: "Austrália",
      slug: "australia",
      fifaCode: "AUS",
      groupId: getGroup("H").id,
      colorPrimary: "#00843D",
      colorSecondary: "#FFD700",
    },
    {
      name: "Nova Zelândia",
      slug: "nova-zelandia",
      fifaCode: "NZL",
      groupId: getGroup("H").id,
      colorPrimary: "#000000",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Nigéria",
      slug: "nigeria",
      fifaCode: "NGA",
      groupId: getGroup("H").id,
      colorPrimary: "#008751",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Costa do Marfim",
      slug: "costa-do-marfim",
      fifaCode: "CIV",
      groupId: getGroup("H").id,
      colorPrimary: "#F77F00",
      colorSecondary: "#009A44",
    },
    {
      name: "Chile",
      slug: "chile",
      fifaCode: "CHI",
      groupId: getGroup("I").id,
      colorPrimary: "#D52B1E",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Peru",
      slug: "peru",
      fifaCode: "PER",
      groupId: getGroup("I").id,
      colorPrimary: "#D91023",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Venezuela",
      slug: "venezuela",
      fifaCode: "VEN",
      groupId: getGroup("I").id,
      colorPrimary: "#CF142B",
      colorSecondary: "#FFD700",
    },
    {
      name: "Paraguai",
      slug: "paraguai",
      fifaCode: "PAR",
      groupId: getGroup("I").id,
      colorPrimary: "#D52B1E",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Itália",
      slug: "italia",
      fifaCode: "ITA",
      groupId: getGroup("J").id,
      colorPrimary: "#003399",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Polônia",
      slug: "polonia",
      fifaCode: "POL",
      groupId: getGroup("J").id,
      colorPrimary: "#DC143C",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Turquia",
      slug: "turquia",
      fifaCode: "TUR",
      groupId: getGroup("J").id,
      colorPrimary: "#E30A17",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Gana",
      slug: "gana",
      fifaCode: "GHA",
      groupId: getGroup("J").id,
      colorPrimary: "#006B3F",
      colorSecondary: "#FCD116",
    },
    {
      name: "Irã",
      slug: "ira",
      fifaCode: "IRN",
      groupId: getGroup("K").id,
      colorPrimary: "#239F40",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Arábia Saudita",
      slug: "arabia-saudita",
      fifaCode: "KSA",
      groupId: getGroup("K").id,
      colorPrimary: "#006C35",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Egito",
      slug: "egito",
      fifaCode: "EGY",
      groupId: getGroup("K").id,
      colorPrimary: "#CE1126",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Camarões",
      slug: "camaroes",
      fifaCode: "CMR",
      groupId: getGroup("K").id,
      colorPrimary: "#007A5E",
      colorSecondary: "#CE1126",
    },
    {
      name: "Dinamarca",
      slug: "dinamarca",
      fifaCode: "DEN",
      groupId: getGroup("L").id,
      colorPrimary: "#C60C30",
      colorSecondary: "#FFFFFF",
    },
    {
      name: "Suécia",
      slug: "suecia",
      fifaCode: "SWE",
      groupId: getGroup("L").id,
      colorPrimary: "#006AA7",
      colorSecondary: "#FECC02",
    },
    {
      name: "Sérvia",
      slug: "servia",
      fifaCode: "SRB",
      groupId: getGroup("L").id,
      colorPrimary: "#C6363C",
      colorSecondary: "#0C4076",
    },
    {
      name: "Algeria",
      slug: "algeria",
      fifaCode: "ALG",
      groupId: getGroup("L").id,
      colorPrimary: "#006233",
      colorSecondary: "#FFFFFF",
    },
  ];

  const allTeams = [...teams, ...teamsBasic];

  for (const team of allTeams) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: {},
      create: { ...team, badgeUrl: null },
    });
  }

  console.log(`✅ ${allTeams.length} teams created`);
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
