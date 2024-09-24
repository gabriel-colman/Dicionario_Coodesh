
# Dicionário Coodesh

## Descrição do Projeto
Este projeto consiste em um sistema de dicionário desenvolvido para o desafio Fullstack Challenge da Coodesh. Ele possui um frontend construído com Next.js e TailwindCSS, e um backend desenvolvido em Node.js com MongoDB para gerenciamento de palavras, usuários e autenticação.

## Estrutura do Projeto
A estrutura do projeto está organizada da seguinte forma:

### 1. Diretório `client`
- **.env**: Variáveis de ambiente para o frontend.
- **.eslintrc.json**: Configurações do ESLint para manter o padrão de código.
- **Dockerfile**: Configuração para containerização do frontend.
- **package.json** e **package-lock.json**: Gerenciamento de dependências do projeto.
- **next.config.mjs**: Configurações do Next.js.
- **tsconfig.json**: Configurações do TypeScript.
- **public**: Contém arquivos estáticos como imagens e ícones.
- **src/app**: Contém a estrutura principal da aplicação React.
  - **components**: Componentes reutilizáveis da aplicação, como menus, ícones, modais, etc.
  - **services**: Serviços de comunicação com o backend e autenticação.
  - **pages**: Páginas principais da aplicação como login, dashboard e registro.

### 2. Diretório `server`
- **.env**: Variáveis de ambiente para o backend.
- **Dockerfile**: Configuração para containerização do backend.
- **package.json** e **package-lock.json**: Gerenciamento de dependências do projeto.
- **server.ts**: Ponto de entrada principal do servidor.
- **middlewares**: Contém middlewares para autenticação e autorização.
- **models**: Modelos de dados do MongoDB para usuários e palavras.
- **routes**: Rotas da API, incluindo autenticação e gerenciamento de entradas.
- **scripts**: Scripts utilitários, como inicialização do banco de dados.
- **services**: Lógica de negócios e comunicação com a base de dados.

### 3. Diretório `img`
- **wireframe.png**: Contém a imagem do wireframe do layout do projeto.

## Funcionalidades do Projeto
- **Autenticação de Usuário**: Registre-se e faça login para acessar o dicionário.
- **Gerenciamento de Palavras**: Pesquise palavras, visualize definições e adicione aos favoritos.
- **Dashboard Personalizado**: Visualize palavras marcadas como favoritas e o histórico de pesquisa.
- **API RESTful**: Backend com endpoints para manipulação de usuários e entradas no dicionário.

## Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/gabriel-colman/Dicionario_Coodesh
```

### 2. Configuração do Backend
- Navegue até o diretório `server`.
- Crie um arquivo `.env` com as variáveis de ambiente necessárias (ver exemplo em `.env.example`).
- Execute o backend:
```bash
npm install
npm run start
```

### 3. Configuração do Frontend
- Navegue até o diretório `client`.
- Crie um arquivo `.env` com as variáveis de ambiente necessárias (ver exemplo em `.env.example`).
- Execute o frontend:
```bash
npm install
npm run dev
```

### 4. Usando Docker
- No diretório raiz do projeto, execute:
```bash
docker-compose up
```

### 5. Acessar a Aplicação
- O frontend estará disponível em `http://localhost:3000`.
- O backend estará disponível em `http://localhost:5000`.
