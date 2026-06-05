# Microserviço Mongo - RotaCerta

## Alunos

- Ícaro Rayff de Souza
- Armando de Souza Stein

Microserviço responsável pelo domínio de rotas, paradas, aceite de rota, ocorrências e histórico de localização.

## Descrição da arquitetura

O serviço segue Clean Architecture com organização por feature. A feature `routes` é separada nas camadas:

- `domain`: entidades, contratos e regras de transição de status.
- `application`: use cases de criação, aceite, listagem, ocorrência, localização e conclusão de parada.
- `infrastructure`: adapters de persistência em memória e MongoDB Atlas.
- `api`: controllers HTTP documentados via Swagger.

Fluxo principal:

```txt
BFF -> Microserviço Mongo -> MongoDB Atlas
```

Por padrão, o serviço usa repositório em memória para facilitar a execução local. Para a entrega em nuvem, pode ser configurado para persistir em MongoDB Atlas.

## Tecnologias utilizadas

- Node.js
- TypeScript
- NestJS
- MongoDB / MongoDB Atlas
- Swagger / OpenAPI
- Vitest
- dotenv

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
PORT=3002
PERSISTENCE_DRIVER=memory
```

Para usar MongoDB Atlas:

```env
PORT=3002
PERSISTENCE_DRIVER=mongodb-atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/rotacerta
MONGODB_DATABASE=rotacerta
MONGODB_ROUTES_COLLECTION=routes
```

Inicie o serviço:

```bash
npm run dev
```

Endereços locais:

- API: `http://localhost:3002`
- Swagger: `http://localhost:3002/docs`
- Health check: `http://localhost:3002/health`

Para validar a conexão com MongoDB Atlas configurada no `.env`:

```bash
npm run testar:conexao
```

Endpoints principais:

- `POST /api/v1/routes`
- `GET /api/v1/routes`
- `GET /api/v1/routes/available`
- `POST /api/v1/routes/:id/accept`
- `POST /api/v1/routes/:id/location`
- `POST /api/v1/routes/:id/occurrences`
- `POST /api/v1/routes/:id/stops/:orderId/complete`
- `GET /health`

Para rodar os testes:

```bash
npm test
```
