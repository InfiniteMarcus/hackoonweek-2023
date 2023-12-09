# Hackathon - HackoonWeek 2023

## Ideia do projeto
Este projeto, criado durante as duas horas de Hackathon do [HackoonSpace](https://hackoonspace.com) durante o evento **HackoonWeek 2023** representa um bot para a plataforma **Discord** que armazena, busca, insere e deleta senhas, como um programa gerenciador de senhas.

Cada usuário pode salvar senhas diferentes para cada servidor em que o bot está instalado.

Por ser uma prova de conceito, todas as senhas estão armazenadas em memória e são perdidas após o encerramento da execução do programa.

## Como instalar
- Baixe o projeto
- Instale os pacotes do NPM (por exemplo, usando o comando `npm install`)
- Crie um arquivo `.env` para configurar as variáveis de ambiente (veja o arquivo `.env.example` para ter uma referência)

## Variáveis de ambiente
- `BOT_TOKEN`: Token do seu bot, que pode ser gerado pelo [Dashboard de desenvolvedores do Discord](https://discord.com/developers/applications)
- `BOT_ID`: ID do seu bot, que pode ser copiado no [Dashboard de desenvolvedores do Discord](https://discord.com/developers/applications)
- `ENCRYPTION_SECRET`:  Segredo de encriptação para as senhas (considerando o **algoritmo AES 256**, precisa ter 32 bytes)

## Como executar
- Use o comando `npm build` para compilar o código em Typescript para Javascript
- Use o comando `npm start` para executar o código
- Abra o aplicativo do Discord e utilize os comandos em algum servidor em que o bot esteja instalado

## Autores
- Marcus Natrielli - @MarcusNatrielli