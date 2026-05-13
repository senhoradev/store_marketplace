# MachoCar - Frontend

Este é o frontend do projeto MachoCar, uma aplicação de revenda de carros desenvolvida com React e Vite. O projeto implementa as telas de login e registro, permitindo tanto o cadastro de usuários comuns quanto de vendedores.

## Como Funciona

A aplicação foi estruturada focando na experiência do usuário, oferecendo formulários responsivos e integrados com uma API backend. As rotas principais incluem:

- **Login**: Autenticação de usuários existentes com suporte a tokens JWT.
- **Registro**: Criação de novas contas, incluindo a opção para o usuário se registrar como vendedor, que exibe condicionalmente campos adicionais (CPF, data de nascimento, telefone, endereço).

A interface utiliza CSS Grid para o layout, garantindo responsividade em diferentes dispositivos, e se comunica com o backend através de chamadas HTTP.

## Requisitos de Sistema

Para rodar este projeto, é necessário ter instalado no seu ambiente:

- Node.js (versão 18 ou superior)
- npm ou pnpm
- Docker e Docker Compose (opcional)

## Como Rodar o Projeto Localmente

### 1. Instalação das Dependências

Navegue até a raiz do diretório e execute o comando abaixo:

```bash
npm install
```

### 2. Configuração do Ambiente

Certifique-se de configurar as variáveis de ambiente necessárias no arquivo `.env`. Você pode usar o arquivo `.env.example` como base.

### 3. Execução em Modo de Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em: `http://localhost:5173`

## Como Rodar com Docker

O projeto já conta com suporte ao Docker para facilitar o deploy e a execução em diferentes ambientes.

### Utilizando Docker Compose (Recomendado)

Para construir a imagem e iniciar o container automaticamente, execute:

```bash
docker-compose up -d --build
```

Isso iniciará o servidor Nginx servindo o build da aplicação na porta **5173**.

### Utilizando Dockerfile Manualmente

Caso deseje buildar a imagem sem o Compose:

1. Build da imagem:
```bash
docker build -t car-store-frontend .
```

2. Execução do container:
```bash
docker run -p 5173:80 car-store-frontend
```