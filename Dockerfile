FROM node:21-alpine

# Cria o diretório de trabalho no contêiner
WORKDIR /app

# Copia o código-fonte para o diretório de trabalho no contêiner
COPY . .

# Instala as dependências
RUN npm install -g npm && npm install

# Expõe a porta 4000
EXPOSE 4000

# Comando de inicialização do aplicativo
CMD ["npm", "run", "dev"]
