# Use uma imagem Node.js como base
FROM node:14

# Configure o diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

RUN npm install @popperjs/core

# Instale as dependências
RUN npm update

# Copie o restante dos arquivos do aplicativo
COPY . .

# Construa o aplicativo React
RUN npm run build


# Expõe a porta 80 para conexões externas
EXPOSE 3000

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["npm", "start"]