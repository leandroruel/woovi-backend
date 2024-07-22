FROM node:21-alpine

# Cria o diretório de trabalho no contêiner
WORKDIR /app

# Copia o código-fonte para o diretório de trabalho no contêiner
COPY package.json ./

COPY . .

# Instala as dependências
RUN 

# Expõe a porta 4000
EXPOSE 4000

# Set timezone
ENV TZ America/Sao_Paulo

# Comando de inicialização do aplicativo
CMD ["sh", "-c", "yarn install && yarn dev"]
