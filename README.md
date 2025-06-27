# ☕ Coffee Delivery - Full Stack Application

Sistema completo de e-commerce para cafés artesanais, com funcionalidades modernas como listagem de produtos, carrinho de compras, finalização de pedidos e integração com banco de dados PostgreSQL. Desenvolvido com as melhores práticas de front-end e back-end.

---

## 🚀 Tecnologias Utilizadas

### Front-end
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled-components](https://styled-components.com/)
- [Axios](https://axios-http.com/)

### Back-end
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

---

## 🛠️ Funcionalidades

### ✅ Principais
- Listagem de cafés disponíveis via API
- Visualização dos detalhes (nome, descrição, preço, tags, imagem)
- Adição de itens ao carrinho com controle de quantidade
- Finalização de pedido com cálculo de frete e taxa
- Integração entre front-end e back-end

### ⚙️ Adicionais
- Favoritar cafés (persistência via `localStorage`)
- Carrinho persistente com `localStorage`
- Remoção de itens do carrinho
- Requisições otimizadas com Axios

---

## 📁 Estrutura de Diretórios

```
coffee-delivery/
├── backend/
│   ├── src/
│   │   ├── coffees/
│   │   ├── cart/
│   │   ├── order/
│   │   └── prisma/
│   └── prisma/schema.prisma
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── styles/
```

---

## 🧪 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/coffee-delivery.git
cd coffee-delivery
```

### 2. Instale as dependências

```bash
# Back-end
cd backend
npm install

# Front-end
cd ../frontend
npm install
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL e adicione as credenciais no arquivo `.env` do back-end:

```env
# backend/.env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/coffee_delivery
```

### 4. Execute as migrações do banco

```bash
cd backend
npx prisma migrate dev
```

### 5. Popule o banco com dados iniciais

```bash
npm run seed
```

### 6. Inicie o servidor back-end

```bash
npm run start:dev
```

### 7. Inicie o front-end

```bash
cd ../frontend
npm run dev
```

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT). 
Sinta-se à vontade para usar, estudar e adaptar conforme necessário.

---
