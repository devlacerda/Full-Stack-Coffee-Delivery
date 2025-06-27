import { Fragment, useEffect, useState } from 'react'
import {
  Bank,
  CreditCard,
  CurrencyDollar,
  Money,
  Trash,
} from '@phosphor-icons/react'

import {
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
  PaymentContainer,
  PaymentErrorMessage,
  PaymentHeading,
  PaymentOptions,
} from './styles'
import { Tags } from '../../components/CoffeeCard/styles'
import { QuantityInput } from '../../components/Form/QuantityInput'
import { Radio } from '../../components/Form/Radio'
import { api } from '../../server/api'

export interface Item {
  id: string
  quantity: number
}

export interface Order {
  id: number
  items: CoffeeInCart[]
}

interface CoffeeInCart {
  id: string
  title: string
  description: string
  tags: string[]
  price: number
  image: string
  quantity: number
  subTotal: number
}

type PaymentMethod = 'credit' | 'debit' | 'cash'

const DELIVERY_PRICE = 3.75

export function Cart() {
  const [coffeesInCart, setCoffeesInCart] = useState<CoffeeInCart[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')

  useEffect(() => {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) return

    async function fetchCart() {
      try {
        const response = await api.get(`/cart/${cartId}`)
        const items = response.data.items.map((item: any) => ({
          id: item.coffee.id,
          title: item.coffee.name,
          description: item.coffee.description,
          tags: item.coffee.tags.map((tag: any) => tag.name),
          price: item.coffee.price,
          image: item.coffee.imageUrl,
          quantity: item.quantity,
          subTotal: item.quantity * item.coffee.price,
        }))

        setCoffeesInCart(items)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
      }
    }

    fetchCart()
  }, [])

  const totalItemsPrice = coffeesInCart.reduce(
    (currencyValue, coffee) => currencyValue + coffee.price * coffee.quantity,
    0,
  )

  function handleItemIncrement(id: string) {
    setCoffeesInCart((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === id) {
          const coffeeQuantity = coffee.quantity + 1
          const subTotal = coffee.price * coffeeQuantity
          return {
            ...coffee,
            quantity: coffeeQuantity,
            subTotal,
          }
        }
        return coffee
      }),
    )
  }

  function handleItemDecrement(itemId: string) {
    setCoffeesInCart((prevState) =>
      prevState.map((coffee) => {
        if (coffee.id === itemId && coffee.quantity > 1) {
          const coffeeQuantity = coffee.quantity - 1
          const subTotal = coffee.price * coffeeQuantity
          return {
            ...coffee,
            quantity: coffeeQuantity,
            subTotal,
          }
        }
        return coffee
      }),
    )
  }

  async function handleItemRemove(itemId: string) {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) return

    try {
      await api.delete(`/cart/${cartId}/items/${itemId}`)
      setCoffeesInCart((prevState) =>
        prevState.filter((coffee) => coffee.id !== itemId),
      )
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error)
    }
  }

  async function handleConfirmOrder() {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) return alert('Carrinho não encontrado!')

    try {
      await api.post(`/orders`, {
        cartId,
        paymentMethod,
      })

      alert('Pedido confirmado com sucesso!')
      localStorage.removeItem('cartId')
      setCoffeesInCart([])
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err)
      alert('Erro ao finalizar pedido.')
    }
  }

  const paymentRates: Record<PaymentMethod, number> = {
    credit: 3.85,
    debit: 1.85,
    cash: 0,
  }

  const calculateTax = () => {
    const rate = paymentRates[paymentMethod]
    return (totalItemsPrice + DELIVERY_PRICE) * (rate / 100)
  }

  const calculateFinalAmount = () => {
    return totalItemsPrice + DELIVERY_PRICE + calculateTax()
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  return (
    <Container>
      <InfoContainer>
        <PaymentContainer>
          <PaymentHeading>
            <CurrencyDollar size={22} />
            <div>
              <span>Pagamento</span>
              <p>
                O pagamento é feito na entrega. Escolha a forma que deseja
                pagar
              </p>
            </div>
          </PaymentHeading>

          <PaymentOptions>
            <div>
              <Radio
                isSelected={paymentMethod === 'credit'}
                onClick={() => setPaymentMethod('credit')}
                value="credit"
              >
                <CreditCard size={16} />
                <span>Cartão de crédito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'debit'}
                onClick={() => setPaymentMethod('debit')}
                value="debit"
              >
                <Bank size={16} />
                <span>Cartão de débito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'cash'}
                onClick={() => setPaymentMethod('cash')}
                value="cash"
              >
                <Money size={16} />
                <span>Pix ou Dinheiro</span>
              </Radio>
            </div>

            {false && (
              <PaymentErrorMessage role="alert">
                <span>Selecione uma forma de pagamento</span>
              </PaymentErrorMessage>
            )}
          </PaymentOptions>
        </PaymentContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {coffeesInCart.map((coffee) => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />
                  <div>
                    <span>{coffee.title}</span>
                    <Tags>
                      {coffee.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>

                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() =>
                          handleItemIncrement(coffee.id)
                        }
                        decrementQuantity={() =>
                          handleItemDecrement(coffee.id)
                        }
                      />

                      <button onClick={() => handleItemRemove(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>

                <aside>R$ {coffee.subTotal?.toFixed(2)}</aside>
              </Coffee>
              <span />
            </Fragment>
          ))}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>{formatCurrency(totalItemsPrice)}</span>
            </div>

            <div>
              <span>Entrega</span>
              <span>{formatCurrency(DELIVERY_PRICE)}</span>
            </div>

            <div>
              <span>Taxa ({paymentRates[paymentMethod]}%)</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>

            <div>
              <span>Total</span>
              <span>{formatCurrency(calculateFinalAmount())}</span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="button" onClick={handleConfirmOrder}>
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
