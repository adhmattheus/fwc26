import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CDN = "https://dvcammctw5or7.cloudfront.net/team-badges";

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

  const getGroup = (name: string) => groups.find((g) => g.name === name)!;

  const allTeams = [
    // GRUPO A
    {
      name: "México",
      slug: "mexico",
      fifaCode: "MEX",
      groupId: getGroup("A").id,
      colorPrimary: "#006847",
      colorSecondary: "#CE1126",
      badgeUrl: `${CDN}/mex.png`,
    },
    {
      name: "África do Sul",
      slug: "africa-do-sul",
      fifaCode: "RSA",
      groupId: getGroup("A").id,
      colorPrimary: "#007749",
      colorSecondary: "#FFB81C",
      badgeUrl: `${CDN}/rsa.png`,
    },
    {
      name: "Coreia do Sul",
      slug: "coreia-do-sul",
      fifaCode: "KOR",
      groupId: getGroup("A").id,
      colorPrimary: "#CD2E3A",
      colorSecondary: "#0047A0",
      badgeUrl: `${CDN}/kor.png`,
    },
    {
      name: "Tchéquia",
      slug: "tchequia",
      fifaCode: "CZE",
      groupId: getGroup("A").id,
      colorPrimary: "#D7141A",
      colorSecondary: "#11457E",
      badgeUrl: `${CDN}/cze.png`,
    },

    // GRUPO B
    {
      name: "Canadá",
      slug: "canada",
      fifaCode: "CAN",
      groupId: getGroup("B").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/can.png`,
    },
    {
      name: "Bósnia e Herzegovina",
      slug: "bosnia-e-herzegovina",
      fifaCode: "BIH",
      groupId: getGroup("B").id,
      colorPrimary: "#002395",
      colorSecondary: "#FECB00",
      badgeUrl: `${CDN}/bih.png`,
    },
    {
      name: "Catar",
      slug: "catar",
      fifaCode: "QAT",
      groupId: getGroup("B").id,
      colorPrimary: "#8D1B3D",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/qat.png`,
    },
    {
      name: "Suíça",
      slug: "suica",
      fifaCode: "SUI",
      groupId: getGroup("B").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/sui.png`,
    },

    // GRUPO C
    {
      name: "Brasil",
      slug: "brasil",
      fifaCode: "BRA",
      groupId: getGroup("C").id,
      colorPrimary: "#009739",
      colorSecondary: "#FEDD00",
      badgeUrl: `${CDN}/bra.png`,
    },
    {
      name: "Marrocos",
      slug: "marrocos",
      fifaCode: "MAR",
      groupId: getGroup("C").id,
      colorPrimary: "#C1272D",
      colorSecondary: "#006233",
      badgeUrl: `${CDN}/mar.png`,
    },
    {
      name: "Haiti",
      slug: "haiti",
      fifaCode: "HAI",
      groupId: getGroup("C").id,
      colorPrimary: "#00209F",
      colorSecondary: "#D21034",
      badgeUrl: `${CDN}/hai.png`,
    },
    {
      name: "Escócia",
      slug: "escocia",
      fifaCode: "SCO",
      groupId: getGroup("C").id,
      colorPrimary: "#005EB8",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/sco.png`,
    },

    // GRUPO D
    {
      name: "Estados Unidos",
      slug: "estados-unidos",
      fifaCode: "USA",
      groupId: getGroup("D").id,
      colorPrimary: "#002868",
      colorSecondary: "#BF0A30",
      badgeUrl: `${CDN}/usa.png`,
    },
    {
      name: "Paraguai",
      slug: "paraguai",
      fifaCode: "PAR",
      groupId: getGroup("D").id,
      colorPrimary: "#D52B1E",
      colorSecondary: "#0038A8",
      badgeUrl: `${CDN}/par.png`,
    },
    {
      name: "Austrália",
      slug: "australia",
      fifaCode: "AUS",
      groupId: getGroup("D").id,
      colorPrimary: "#00008B",
      colorSecondary: "#FFCD00",
      badgeUrl: `${CDN}/aus.png`,
    },
    {
      name: "Turquia",
      slug: "turquia",
      fifaCode: "TUR",
      groupId: getGroup("D").id,
      colorPrimary: "#E30A17",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/tur.png`,
    },

    // GRUPO E
    {
      name: "Alemanha",
      slug: "alemanha",
      fifaCode: "GER",
      groupId: getGroup("E").id,
      colorPrimary: "#000000",
      colorSecondary: "#DD0000",
      badgeUrl: `${CDN}/ger.png`,
    },
    {
      name: "Curaçau",
      slug: "curacao",
      fifaCode: "CUW",
      groupId: getGroup("E").id,
      colorPrimary: "#002B7F",
      colorSecondary: "#F9E814",
      badgeUrl: `${CDN}/cuw.png`,
    },
    {
      name: "Costa do Marfim",
      slug: "costa-do-marfim",
      fifaCode: "CIV",
      groupId: getGroup("E").id,
      colorPrimary: "#FF8200",
      colorSecondary: "#009A44",
      badgeUrl: `${CDN}/civ.png`,
    },
    {
      name: "Equador",
      slug: "equador",
      fifaCode: "ECU",
      groupId: getGroup("E").id,
      colorPrimary: "#FFD100",
      colorSecondary: "#034EA2",
      badgeUrl: `${CDN}/ecu.png`,
    },

    // GRUPO F
    {
      name: "Holanda",
      slug: "holanda",
      fifaCode: "NED",
      groupId: getGroup("F").id,
      colorPrimary: "#FF6B00",
      colorSecondary: "#21468B",
      badgeUrl: `${CDN}/ned.png`,
    },
    {
      name: "Japão",
      slug: "japao",
      fifaCode: "JPN",
      groupId: getGroup("F").id,
      colorPrimary: "#BC002D",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/jpn.png`,
    },
    {
      name: "Suécia",
      slug: "suecia",
      fifaCode: "SWE",
      groupId: getGroup("F").id,
      colorPrimary: "#006AA7",
      colorSecondary: "#FECC00",
      badgeUrl: `${CDN}/swe.png`,
    },
    {
      name: "Tunísia",
      slug: "tunisia",
      fifaCode: "TUN",
      groupId: getGroup("F").id,
      colorPrimary: "#E70013",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/tun.png`,
    },

    // GRUPO G
    {
      name: "Bélgica",
      slug: "belgica",
      fifaCode: "BEL",
      groupId: getGroup("G").id,
      colorPrimary: "#000000",
      colorSecondary: "#FDDA24",
      badgeUrl: `${CDN}/bel.png`,
    },
    {
      name: "Egito",
      slug: "egito",
      fifaCode: "EGY",
      groupId: getGroup("G").id,
      colorPrimary: "#C8102E",
      colorSecondary: "#000000",
      badgeUrl: `${CDN}/egy.png`,
    },
    {
      name: "Irã",
      slug: "ira",
      fifaCode: "IRN",
      groupId: getGroup("G").id,
      colorPrimary: "#239F40",
      colorSecondary: "#DA0000",
      badgeUrl: `${CDN}/irn.png`,
    },
    {
      name: "Nova Zelândia",
      slug: "nova-zelandia",
      fifaCode: "NZL",
      groupId: getGroup("G").id,
      colorPrimary: "#000000",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/nzl.png`,
    },

    // GRUPO H
    {
      name: "Espanha",
      slug: "espanha",
      fifaCode: "ESP",
      groupId: getGroup("H").id,
      colorPrimary: "#AA151B",
      colorSecondary: "#F1BF00",
      badgeUrl: `${CDN}/esp.png`,
    },
    {
      name: "Cabo Verde",
      slug: "cabo-verde",
      fifaCode: "CPV",
      groupId: getGroup("H").id,
      colorPrimary: "#003893",
      colorSecondary: "#CF2027",
      badgeUrl: `${CDN}/cpv.png`,
    },
    {
      name: "Arábia Saudita",
      slug: "arabia-saudita",
      fifaCode: "KSA",
      groupId: getGroup("H").id,
      colorPrimary: "#006C35",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/ksa.png`,
    },
    {
      name: "Uruguai",
      slug: "uruguai",
      fifaCode: "URU",
      groupId: getGroup("H").id,
      colorPrimary: "#0038A8",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/uru.png`,
    },

    // GRUPO I
    {
      name: "França",
      slug: "franca",
      fifaCode: "FRA",
      groupId: getGroup("I").id,
      colorPrimary: "#002395",
      colorSecondary: "#ED2939",
      badgeUrl: `${CDN}/fra.png`,
    },
    {
      name: "Senegal",
      slug: "senegal",
      fifaCode: "SEN",
      groupId: getGroup("I").id,
      colorPrimary: "#00853F",
      colorSecondary: "#FDEF42",
      badgeUrl: `${CDN}/sen.png`,
    },
    {
      name: "Iraque",
      slug: "iraque",
      fifaCode: "IRQ",
      groupId: getGroup("I").id,
      colorPrimary: "#007A3D",
      colorSecondary: "#CE1126",
      badgeUrl: `${CDN}/irq.png`,
    },
    {
      name: "Noruega",
      slug: "noruega",
      fifaCode: "NOR",
      groupId: getGroup("I").id,
      colorPrimary: "#EF2B2D",
      colorSecondary: "#002868",
      badgeUrl: `${CDN}/nor.png`,
    },

    // GRUPO J
    {
      name: "Argentina",
      slug: "argentina",
      fifaCode: "ARG",
      groupId: getGroup("J").id,
      colorPrimary: "#75AADB",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/arg.png`,
    },
    {
      name: "Argélia",
      slug: "argelia",
      fifaCode: "ALG",
      groupId: getGroup("J").id,
      colorPrimary: "#006233",
      colorSecondary: "#D21034",
      badgeUrl: `${CDN}/alg.png`,
    },
    {
      name: "Áustria",
      slug: "austria",
      fifaCode: "AUT",
      groupId: getGroup("J").id,
      colorPrimary: "#ED2939",
      colorSecondary: "#FFFFFF",
      badgeUrl: `${CDN}/aut.png`,
    },
    {
      name: "Jordânia",
      slug: "jordania",
      fifaCode: "JOR",
      groupId: getGroup("J").id,
      colorPrimary: "#007A3D",
      colorSecondary: "#000000",
      badgeUrl: `${CDN}/jor.png`,
    },

    // GRUPO K
    {
      name: "Portugal",
      slug: "portugal",
      fifaCode: "POR",
      groupId: getGroup("K").id,
      colorPrimary: "#006600",
      colorSecondary: "#FF0000",
      badgeUrl: `${CDN}/por.png`,
    },
    {
      name: "RD Congo",
      slug: "rd-congo",
      fifaCode: "COD",
      groupId: getGroup("K").id,
      colorPrimary: "#007FFF",
      colorSecondary: "#F7D618",
      badgeUrl: `${CDN}/cod.png`,
    },
    {
      name: "Uzbequistão",
      slug: "uzbequistao",
      fifaCode: "UZB",
      groupId: getGroup("K").id,
      colorPrimary: "#1EB53A",
      colorSecondary: "#0099B5",
      badgeUrl: `${CDN}/uzb.png`,
    },
    {
      name: "Colômbia",
      slug: "colombia",
      fifaCode: "COL",
      groupId: getGroup("K").id,
      colorPrimary: "#FCD116",
      colorSecondary: "#003893",
      badgeUrl: `${CDN}/col.png`,
    },

    // GRUPO L
    {
      name: "Inglaterra",
      slug: "inglaterra",
      fifaCode: "ENG",
      groupId: getGroup("L").id,
      colorPrimary: "#FFFFFF",
      colorSecondary: "#CF081F",
      badgeUrl: `${CDN}/eng.png`,
    },
    {
      name: "Croácia",
      slug: "croacia",
      fifaCode: "CRO",
      groupId: getGroup("L").id,
      colorPrimary: "#FF0000",
      colorSecondary: "#0000FF",
      badgeUrl: `${CDN}/cro.png`,
    },
    {
      name: "Gana",
      slug: "gana",
      fifaCode: "GHA",
      groupId: getGroup("L").id,
      colorPrimary: "#006B3F",
      colorSecondary: "#FCD116",
      badgeUrl: `${CDN}/gha.png`,
    },
    {
      name: "Panamá",
      slug: "panama",
      fifaCode: "PAN",
      groupId: getGroup("L").id,
      colorPrimary: "#005293",
      colorSecondary: "#DA121A",
      badgeUrl: `${CDN}/pan.png`,
    },
  ];

  for (const team of allTeams) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: {
        name: team.name,
        fifaCode: team.fifaCode,
        groupId: team.groupId,
        colorPrimary: team.colorPrimary,
        colorSecondary: team.colorSecondary,
        badgeUrl: team.badgeUrl,
      },
      create: team,
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
