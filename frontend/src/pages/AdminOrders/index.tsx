import { useEffect, useState } from 'react';
import { api } from '../../server/api';

interface Coffee {
  name: string;
  imageUrl: string;
  price: number;
}

interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  coffee: Coffee;
}

interface Order {
  id: string;
  paymentMethod: string;
  createdAt: string;
  cart: {
    userId: string | null;
    status: string;
    statusPayment: string;
    dataTimeCompleted: string | null;
    items: CartItem[];
  };
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📦 Pedidos Recebidos</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <h2>Pedido: {order.id}</h2>
            <p>
              <strong>Pagamento:</strong> {order.paymentMethod}
              <br />
              <strong>Status Carrinho:</strong> {order.cart.status}
              <br />
              <strong>Status Pagamento:</strong> {order.cart.statusPayment}
            </p>
            <h3>Itens:</h3>
            <ul>
              {order.cart.items.map((item) => (
                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                  <img
                    src={item.coffee.imageUrl}
                    alt={item.coffee.name}
                    width="40"
                    style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                  />
                  {item.coffee.name} — {item.quantity}x (
                  R$ {item.unitPrice.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
