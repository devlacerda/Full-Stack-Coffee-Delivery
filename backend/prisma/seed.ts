import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const baseImageUrl = '/images/coffees/'

  const tagsData = [
    { name: 'tradicional' },
    { name: 'com leite' },
    { name: 'gelado' },
    { name: 'especial' },
    { name: 'alcoólico' },
    { name: 'descafeinado' },
  ]

  await Promise.all(
    tagsData.map((tag) =>
      prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: tag,
      }),
    ),
  )

  const coffeesData = [
    {
      name: 'Café Americano',
      description: 'Café expresso diluído, leve e saboroso.',
      price: 9.5,
      imageUrl: `${baseImageUrl}americano.png`,
      tagNames: ['tradicional'],
    },
    {
      name: 'Café Árabe',
      description: 'Com especiarias típicas, aromático e intenso.',
      price: 13.0,
      imageUrl: `${baseImageUrl}arabe.png`,
      tagNames: ['especial'],
    },
    {
      name: 'Café com Leite',
      description: 'A combinação perfeita entre café e leite.',
      price: 10.0,
      imageUrl: `${baseImageUrl}cafe-com-leite.png`,
      tagNames: ['com leite', 'tradicional'],
    },
    {
      name: 'Café Gelado',
      description: 'Refrescante e cheio de sabor, ideal para o calor.',
      price: 11.5,
      imageUrl: `${baseImageUrl}cafe-gelado.png`,
      tagNames: ['gelado'],
    },
    {
      name: 'Capuccino',
      description: 'Mistura cremosa de café, leite e espuma.',
      price: 12.0,
      imageUrl: `${baseImageUrl}capuccino.png`,
      tagNames: ['com leite', 'especial'],
    },
    {
      name: 'Chocolate Quente',
      description: 'Perfeito para quem prefere algo mais doce.',
      price: 12.5,
      imageUrl: `${baseImageUrl}chocolate-quente.png`,
      tagNames: ['especial'],
    },
    {
      name: 'Cubano',
      description: 'Café gelado com rum, creme e hortelã.',
      price: 14.5,
      imageUrl: `${baseImageUrl}cubano.png`,
      tagNames: ['alcoólico', 'gelado', 'especial'],
    },
    {
      name: 'Expresso Cremoso',
      description: 'Tradicional e encorpado, com crema perfeita.',
      price: 10.0,
      imageUrl: `${baseImageUrl}expresso-cremoso.png`,
      tagNames: ['tradicional'],
    },
    {
      name: 'Expresso',
      description: 'O clássico café feito sob pressão.',
      price: 9.0,
      imageUrl: `${baseImageUrl}expresso.png`,
      tagNames: ['tradicional'],
    },
    {
      name: 'Havaiano',
      description: 'Café com leite de coco e toque tropical.',
      price: 13.0,
      imageUrl: `${baseImageUrl}havaiano.png`,
      tagNames: ['especial'],
    },
    {
      name: 'Irlandês',
      description: 'Café com whisky irlandês e creme.',
      price: 15.0,
      imageUrl: `${baseImageUrl}irlandes.png`,
      tagNames: ['alcoólico', 'especial'],
    },
    {
      name: 'Latte',
      description: 'Dose suave de expresso com leite vaporizado.',
      price: 12.5,
      imageUrl: `${baseImageUrl}latte.png`,
      tagNames: ['com leite'],
    },
    {
      name: 'Macchiato',
      description: 'Expresso com uma mancha de leite.',
      price: 11.0,
      imageUrl: `${baseImageUrl}macchiato.png`,
      tagNames: ['tradicional', 'com leite'],
    },
    {
      name: 'Mocaccino',
      description: 'Café com leite e chocolate, doce e encorpado.',
      price: 13.5,
      imageUrl: `${baseImageUrl}mocaccino.png`,
      tagNames: ['com leite', 'especial'],
    },
  ]

  for (const coffee of coffeesData) {
    const createdCoffee = await prisma.coffee.create({
      data: {
        name: coffee.name,
        description: coffee.description,
        price: coffee.price,
        imageUrl: coffee.imageUrl,
        tags: {
          create: coffee.tagNames.map((tagName) => ({
            tag: { connect: { name: tagName } },
          })),
        },
      },
    })

    console.log(`☕ Café criado: ${createdCoffee.name}`)
  }

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
