# Usamos a imagem Node.js v18 como base
FROM node:18

# Configuramos o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiamos os arquivos de dependências para o contêiner
COPY package*.json ./

# Instalamos as dependências do aplicativo Node.js
RUN npm install

# Copiamos todos os arquivos do projeto para o contêiner
COPY . .

# Aplicamos as migrações de banco de dados (se necessário)
RUN npx prisma migrate dev --name initial

# Construímos o aplicativo para produção
RUN npm run build

# Definimos o comando padrão para executar o aplicativo
CMD [ "node", "dist/main.js" ]
