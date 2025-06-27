import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'
import { CoffeeCard } from '../../components/CoffeeCard'
import { CoffeeList, Heading, Hero, HeroContent, Info, Navbar } from './styles'
import { useEffect, useState } from 'react'
import { Radio } from '../../components/Form/Radio'
import { api } from '../../server/api'

interface Coffee {
  id: string
  name: string
  description: string
  tags: { name: string }[]
  price: number
  imageUrl: string
  quantity: number
  favorite: boolean
}

export function Home() {
  const theme = useTheme()
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    async function fetchCoffees() {
      try {
        const response = await api.get('/coffees')
        const favorites = JSON.parse(localStorage.getItem('favoriteCoffees') || '[]')

        const sortedCoffees = response.data
          .map((coffee: any) => ({
            ...coffee,
            tags: Array.isArray(coffee.tags) && typeof coffee.tags[0] === 'string'
              ? coffee.tags.map((tag: string) => ({ name: tag }))
              : coffee.tags,
            quantity: 0,
            favorite: favorites.includes(coffee.id),
          }))
          .sort((a: Coffee, b: Coffee) => a.name.localeCompare(b.name))

        setCoffees(sortedCoffees)
      } catch (error) {
        console.error('Erro ao carregar cafés', error)
      }
    }

    fetchCoffees()
  }, [])

  const filteredCoffees = selectedCategory
    ? coffees.filter((coffee) =>
      coffee.tags.some((tag) => tag.name === selectedCategory)
    )
    : coffees

  function incrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id
          ? { ...coffee, quantity: coffee.quantity + 1 }
          : coffee
      )
    )
  }

  function decrementQuantity(id: string) {
    setCoffees((prevState) =>
      prevState.map((coffee) =>
        coffee.id === id && coffee.quantity > 0
          ? { ...coffee, quantity: coffee.quantity - 1 }
          : coffee
      )
    )
  }

  function handleFavoriteCoffee(id: string) {
    setCoffees((prevState) => {
      const updated = prevState.map((coffee) =>
        coffee.id === id ? { ...coffee, favorite: !coffee.favorite } : coffee
      )

      const favorites = updated.filter((c) => c.favorite).map((c) => c.id)
      localStorage.setItem('favoriteCoffees', JSON.stringify(favorites))

      return updated
    })
  }

  async function handleAddToCart(coffee: Coffee) {
    try {
      const cartId = localStorage.getItem('cartId') ?? ''

      if (!cartId) {
        const response = await api.post('/cart')
        localStorage.setItem('cartId', response.data.id)
        await api.post(`/cart/${response.data.id}/items`, {
          coffeeId: coffee.id,
          quantity: coffee.quantity > 0 ? coffee.quantity : 1,
        })
      } else {
        await api.post(`/cart/${cartId}/items`, {
          coffeeId: coffee.id,
          quantity: coffee.quantity > 0 ? coffee.quantity : 1,
        })
      }

      console.log('☕ Café adicionado ao carrinho:', coffee.name)
    } catch (error) {
      console.error('Erro ao adicionar café ao carrinho:', error)
    }
  }

  return (
    <div>
      <Hero>
        <HeroContent>
          <div>
            <Heading>
              <h1>Encontre o café perfeito para qualquer hora do dia</h1>
              <span>
                Com o Coffee Delivery você recebe seu café onde estiver, a
                qualquer hora
              </span>
            </Heading>

            <Info>
              <div>
                <ShoppingCart
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['yellow-dark'] }}
                />
                <span>Compra simples e segura</span>
              </div>

              <div>
                <Package
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['base-text'] }}
                />
                <span>Embalagem mantém o café intacto</span>
              </div>

              <div>
                <Timer
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.yellow }}
                />
                <span>Entrega rápida e rastreada</span>
              </div>

              <div>
                <Coffee
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.purple }}
                />
                <span>O café chega fresquinho até você</span>
              </div>
            </Info>
          </div>

          <img src="/images/hero.svg" alt="Café do Coffee Delivery" />
        </HeroContent>

        <img src="/images/hero-bg.svg" id="hero-bg" alt="" />
      </Hero>

      <CoffeeList>
        <h2>Nossos cafés</h2>
        <Navbar>
          <Radio
            onClick={() =>
              setSelectedCategory((prev) =>
                prev === 'tradicional' ? '' : 'tradicional'
              )
            }
            isSelected={selectedCategory === 'tradicional'}
            value="tradicional"
          >
            <span>Tradicional</span>
          </Radio>

          <Radio
            onClick={() =>
              setSelectedCategory((prev) =>
                prev === 'especial' ? '' : 'especial'
              )
            }
            isSelected={selectedCategory === 'especial'}
            value="especial"
          >
            <span>Especial</span>
          </Radio>

          <Radio
            onClick={() =>
              setSelectedCategory((prev) =>
                prev === 'com leite' ? '' : 'com leite'
              )
            }
            isSelected={selectedCategory === 'com leite'}
            value="com leite"
          >
            <span>Com leite</span>
          </Radio>
        </Navbar>

        <div>
          {filteredCoffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              handleFavoriteCoffee={handleFavoriteCoffee}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </CoffeeList>
    </div>
  )
}
