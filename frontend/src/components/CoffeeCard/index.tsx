import {
  Container,
  CoffeeImg,
  Tags,
  Title,
  Description,
  Control,
  Price,
  Order,
} from './styles'

import { ShoppingCart, Heart, Minus, Plus } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'

interface Coffee {
  id: string
  name: string
  description: string
  tags: { name: string }[] // ✅ CORRETO
  price: number
  imageUrl: string
  quantity: number
  favorite: boolean
}

interface CoffeeCardProps {
  coffee: Coffee
  incrementQuantity: (id: string) => void
  decrementQuantity: (id: string) => void
  handleFavoriteCoffee: (id: string) => void
  handleAddToCart: (coffee: Coffee) => void // ✅ nova função
}

export function CoffeeCard({
  coffee,
  incrementQuantity,
  decrementQuantity,
  handleFavoriteCoffee,
  handleAddToCart, // ✅ adiciona nas props
}: CoffeeCardProps) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    console.log('[Coffee Image URL]', coffee.name, coffee.imageUrl)
  }, [coffee])

  return (
    <Container>
      <CoffeeImg
        src={
          imageError || !coffee.imageUrl
            ? '/images/fallback.png'
            : coffee.imageUrl.trim()
        }
        alt={coffee.name}
        onError={() => {
          console.warn(`Erro ao carregar imagem de ${coffee.name}`)
          setImageError(true)
        }}
      />

      <Tags>
        {(coffee.tags as any[]).map((tag) =>
          typeof tag === 'string' ? (
            <span key={tag}>{tag}</span>
          ) : (
            <span key={tag.name}>{tag.name}</span>
          )
        )}
      </Tags>

      <Title>{coffee.name}</Title>
      <Description>{coffee.description}</Description>

      <Control>
        <Price>
          <span>R$</span>
          <span>{Number(coffee.price).toFixed(2)}</span>
        </Price>

        <Order $itemAdded={coffee.quantity > 0}>
          <button onClick={() => decrementQuantity(coffee.id)}>
            <Minus size={14} />
          </button>
          <span>{coffee.quantity}</span>
          <button onClick={() => incrementQuantity(coffee.id)}>
            <Plus size={14} />
          </button>

          <button title="Favoritar" onClick={() => handleFavoriteCoffee(coffee.id)}>
            <Heart weight={coffee.favorite ? 'fill' : 'regular'} />
          </button>

          <button
            title="Adicionar ao carrinho"
            onClick={() => handleAddToCart(coffee)} // ✅ adiciona ao carrinho
          >
            <ShoppingCart weight="fill" />
          </button>
        </Order>
      </Control>
    </Container>
  )
}
