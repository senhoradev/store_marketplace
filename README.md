# MachoCar - Frontend

Este é o frontend do projeto MachoCar, uma aplicação de revenda de carros desenvolvida com React e Vite. O projeto implementa as telas de login e registro, permitindo tanto o cadastro de usuários comuns quanto de vendedores.

## Como Funciona

A aplicação foi estruturada focando na experiência do usuário, oferecendo formulários responsivos e integrados com uma API backend (via Node.js/Sequelize). As rotas principais incluem:

- **Login**: Autenticação de usuários existentes com suporte a tokens JWT.
- **Registro**: Criação de novas contas, incluindo a opção para o usuário se registrar como vendedor, que exibe condicionalmente campos adicionais (CPF, data de nascimento, telefone, endereço).

A interface utiliza CSS Grid para o layout, garantindo responsividade em diferentes dispositivos, e se comunica com o backend através de chamadas HTTP.

## Requisitos de Sistema

Para rodar este projeto, é necessário ter instalado no seu ambiente:

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes padrão do Node.js) ou pnpm

## Como Rodar o Projeto

### 1. Instalação das Dependências

Primeiro, navegue até a raiz do diretório do frontend no seu terminal e execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

Caso prefira utilizar o `pnpm`, execute:

```bash
pnpm install
```

### 2. Configuração do Ambiente

O projeto possui comunicação com uma API backend. Certifique-se de configurar as variáveis de ambiente necessárias. Você pode usar o arquivo `.env` localizado na pasta `src/` como referência (por exemplo, definindo a URL base da API).

### 3. Execução em Modo de Desenvolvimento

Após a instalação das dependências, inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

A aplicação ficará disponível e o terminal indicará a URL local. Geralmente será possível acessá-la abrindo o seguinte endereço no seu navegador:

- `http://localhost:5173`