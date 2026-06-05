# StickerLab: Quando a Paixão pelo Futebol Encontra Tecnologia e IA

> Como desenvolvi em dias um projeto full-stack que analisa a precisão da Panini nas convocações da Copa 2026, usando IA como ferramenta de aceleração

---

## Introdução

A Copa do Mundo de Futebol 2026 chegou, e com ela, a tradição que une milhões de pessoas ao redor do mundo: o álbum de figurinhas da Panini. Como entusiasta do futebol e apaixonado por colecionismo, sempre me intrigou uma questão específica: **qual a taxa de acerto da Panini ao escolher os jogadores para o álbum antes das convocações oficiais?**

Esta curiosidade aparentemente simples se tornou o ponto de partida para o **StickerLab** - um projeto full-stack que cruza dados oficiais da FIFA com as informações do álbum Panini, revelando estatísticas fascinantes sobre precisão, discrepâncias e padrões nas convocações.

---

## A Oportunidade: cruzando dados de forma inédita

Ao pesquisar, percebi algo curioso: dificilmente se encontra uma API disponível com essas informações completas e estruturadas. A FIFA disponibiliza a lista oficial das convocações após os anúncios, as imagens do álbum Panini existem publicamente, mas esse tipo de cruzamento de dados de forma acessível e pública é raro.

Era hora de transformar essa curiosidade em código.

---

## A Solução: StickerLab

O StickerLab nasceu da união entre meu entusiasmo pelo futebol, vontade de aprender novas tecnologias e curiosidade sobre como ferramentas modernas de IA podem acelerar o desenvolvimento.

### O Que o App Faz?

O StickerLab responde perguntas como:

- **Qual a taxa de acerto geral da Panini** na elaboração prévia do álbum?
- **Quantos jogadores do álbum foram efetivamente convocados?**
- **Quantos jogadores foram convocados mas não têm figurinha no álbum?**
- **Qual seleção tem a melhor taxa de acerto?**
- **Qual clube teve mais jogadores representados na Copa?**

Essas perguntas não são apenas curiosidades - elas refletem o mundo real do desenvolvimento de software. No dia a dia, enfrentamos o desafio de **identificar problemas relevantes, estruturar questões que realmente importam e entregar insights que agregam valor ao usuário final**. É assim que resolvemos problemas reais: entendendo profundamente o que o usuário precisa e como resolver o problema da forma mais eficiente.

Cada métrica oferece uma perspectiva diferente sobre a precisão do álbum e as escolhas dos técnicos das seleções.

---

## Arquitetura e Stack Tecnológica

O projeto foi construído seguindo princípios de Clean Architecture e boas práticas de desenvolvimento moderno:

### Backend

- **Runtime:** Node.js
- **Banco de Dados:** PostgreSQL 17
- **Containerização:** Docker
- **Cloud Storage:** AWS S3

### Frontend

- **Framework:** Next.js 16
- **UI Library:** Shadcn UI
- **Estilização:** Tailwind CSS 4
- **Componentes:** Radix UI
- **Data Fetching:** TanStack Query (React Query)
- **Gráficos:** Recharts

A escolha dessas tecnologias visou não apenas performance e escalabilidade, mas também a oportunidade de aprender frameworks e ferramentas de ponta.

---

## Extração e Processamento de Dados

Um dos maiores desafios do projeto foi obter e estruturar os dados de forma confiável:

### 1. Lista Oficial das Convocações

Extraída diretamente da **FIFA** (fonte oficial), garantindo precisão nas informações sobre os jogadores convocados por cada seleção.

### 2. Lista do Álbum Panini

Extraída **automaticamente** das imagens reais do álbum Panini. As informações foram tratadas, validadas e estruturadas em formato JSON para facilitar o cruzamento de dados.

### 3. Cruzamento e Análise

Desenvolvi do zero um **algoritmo** que:

- Compara as duas fontes de dados
- Calcula taxas de acerto por seleção
- Identifica discrepâncias (jogadores no álbum não convocados e vice-versa)
- Gera estatísticas em tempo real

---

## Desafios Técnicos e Aprendizados

Todo projeto tem seus obstáculos. Aqui estão os principais desafios que enfrentei e como os resolvi:

### Desafio 1: Extração de Dados das Imagens do Álbum

**O problema:** As imagens do álbum Panini não seguiam um padrão único de formatação. Nomes de jogadores, clubes e posições estavam em layouts diferentes dependendo da página.

**Como resolvi:** Desenvolvi um pipeline automatizado que processa as imagens, extrai o texto, valida as informações cruzando múltiplas fontes e estrutura tudo em JSON. O uso de IA aqui foi fundamental para lidar com variações e inconsistências.

**Aprendizado:** A importância de validação de dados em múltiplas etapas. Cerca de 15% dos dados iniciais precisaram de correção manual antes de automatizar completamente o processo.

### Desafio 2: Normalização de Nomes

**O problema:** "Cristiano Ronaldo" no álbum vs "C. Ronaldo" na FIFA vs "Ronaldo" em outras fontes. Como garantir que estamos falando do mesmo jogador?

**Como resolvi:** Criei um sistema de matching que considera não apenas o nome, mas também clube, nacionalidade e posição. Implementei um algoritmo de similaridade que identifica correspondências mesmo com variações de grafia.

**Aprendizado:** Dados do mundo real são bagunçados. Sempre. A normalização de dados é tão importante quanto a extração.

### Desafio 3: Performance na Comparação em Tempo Real

**O problema:** Comparar mais de 1000 jogadores com múltiplas listas, calcular estatísticas agregadas e gerar rankings em tempo real poderia ser lento.

**Como resolvi:** Implementei cache inteligente, otimizei queries do banco de dados e usei índices estratégicos no PostgreSQL. A análise completa agora leva menos de 2 segundos.

**Aprendizado:** Otimização prematura é ruim, mas planejar a arquitetura pensando em performance desde o início economiza muito refactoring depois.

### Desafio 4: Manter a Qualidade com IA

**O problema:** Ao usar IA para acelerar o desenvolvimento, como garantir que o código não se tornasse inconsistente ou de baixa qualidade?

**Como resolvi:** Estabeleci padrões claros desde o início, revisei cada sugestão da IA, fiz testes constantes e refatorei quando necessário. A IA acelerou, mas eu mantive o controle de qualidade.

**Aprendizado:** IA é uma ferramenta poderosa, mas o desenvolvedor continua sendo o responsável pela arquitetura e qualidade final. Não é "deixar a IA fazer tudo", é "usar a IA para fazer mais, melhor e mais rápido".

---

## O Papel da IA no Desenvolvimento

Este projeto teve um diferencial marcante: **foi desenvolvido inteiramente com o auxílio de ferramentas de IA**.

Desde a extração e estruturação dos dados, passando pela comparação das informações, criação das análises estatísticas, modelagem do banco de dados, desenvolvimento do backend e frontend, até a documentação completa - **cada etapa foi desenvolvida por mim com o suporte de agents de IA para otimizar o processo**.

### O Que Mais Me Impressionou?

Não foi apenas a **velocidade** (um projeto que levaria semanas ficou pronto em dias), mas principalmente a **qualidade**: informações precisas, código consistente e estável. Essa abordagem acelerou cada etapa mantendo qualidade técnica e concisão.

Foi minha forma de aprender novas tecnologias enquanto testava o quão eficiente e robusto pode ser o desenvolvimento moderno.

---

## O Propósito: Uma API Pública

Além de responder minha curiosidade pessoal, o StickerLab foi pensado para ser uma **API pública**, disponibilizando esses dados estruturados para qualquer pessoa ou projeto que queira usar.

Outros **entusiastas do futebol e desenvolvedores** terão acesso a boa parte desse trabalho, podendo criar suas próprias análises, dashboards, visualizações ou até novos projetos em cima dessa base de dados.

### Casos de Uso

- Análises estatísticas personalizadas
- Dashboards visuais
- Integrações com outros sistemas
- Estudos sobre padrões de convocação
- Comparações históricas (em futuras versões)

---

## Conclusão: O Futuro Já Chegou

Este projeto me fez perceber algo importante: **não estamos apenas surfando uma onda nova. O futuro já chegou, e precisamos nos reinventar a cada dia.**

A questão não é "vou ser substituído?", mas sim **"como posso usar essas ferramentas para entregar mais valor e me tornar mais relevante?"**.

O desenvolvedor moderno não é aquele que apenas escreve código, mas aquele que:

- **Resolve problemas reais** (mesmo que nascidos de curiosidades)
- **Aprende constantemente** novas tecnologias
- **Utiliza ferramentas** de forma inteligente para otimizar processos
- **Compartilha conhecimento** com a comunidade
- **Adapta-se rapidamente** às mudanças do mercado

Não tenho medo de ser substituído. Minha visão é que os **agents de IA são ferramentas que me ajudam a ser um profissional indispensável**. Quem dominar essas tecnologias hoje estará à frente amanhã.

Como profissional acredito que os melhores projetos nascem da interseção entre paixão pessoal e quando você resolve problemas que realmente te intrigam - mesmo que sejam "apenas" sobre figurinhas.

**Gostou deste artigo?**  
👍 Deixe um like | 💬 Comente suas impressões | 🔄 Compartilhe com desenvolvedores que amam futebol

---

_Artigo escrito em junho de 2026, durante a Copa do Mundo de Futebol._
