z# 🚀 GUIA DE INSTALAÇÃO - StudyHub

## Pré-requisitos

### 1. Instalar Node.js

**Windows:**
1. Acesse https://nodejs.org/
2. Baixe a versão **LTS** (recomendado)
3. Execute o instalador (.msi)
4. Siga os passos do instalador (aceite todos os padrões)
5. Reinicie o computador se solicitado

**Verificar se foi instalado corretamente:**
Abra o PowerShell ou Prompt de Comando e digite:
```powershell
node --version
npm --version
```

Você deve ver algo como:
```
v18.x.x
9.x.x
```

## Passos para Executar

### 1. Abra o Terminal (PowerShell ou CMD)

### 2. Navegue até a pasta do projeto
```powershell
cd "C:\Users\lr080\Desktop\Estudos"
```

### 3. Instale as dependências
```powershell
npm install
```

Isso pode levar de 1-5 minutos. Você verá muitas linhas sendo processadas. **Não feche o terminal!**

### 4. Inicie o servidor
```powershell
npm start
```

Você verá uma mensagem dizendo:
```
Servidor rodando em http://localhost:3000
```

### 5. Abra o navegador
- Acesse: http://localhost:3000
- Crie uma conta ou faça login
- Comece a estudar! 🎓

## 🎯 Primeiro Acesso

1. **Registre-se:**
   - Usuário: `seu_usuario`
   - Email: `seu@email.com`
   - Senha: `sua_senha`

2. **Clique em "Registrar"**

3. **Pronto!** Você agora tem acesso à plataforma

## 📝 Dicas

- Para parar o servidor: Pressione `Ctrl + C` no terminal
- Para reiniciar: Execute `npm start` novamente
- Todos os dados são salvos no banco de dados

## ❌ Se Não Funcionar

### "npm não é reconhecido"
- Node.js pode não estar instalado corretamente
- Tente reiniciar o computador após instalar Node.js

### Porta 3000 já está em uso
- Feche outros programas que usam essa porta
- Ou modifique a porta em `server.js` linha 8

### Erro ao instalar dependências
```powershell
npm install --force
```

## 📚 Estrutura do Projeto

```
Estudos/
├── package.json       # Dependências
├── server.js          # Servidor (backend)
├── README.md          # Documentação
├── INSTALL.md         # Este arquivo
├── .gitignore
├── .vscode/
│   └── tasks.json     # Tarefas do VS Code
└── public/
    ├── index.html     # Interface web
    ├── app.js         # Lógica JavaScript
    └── styles.css     # Estilos
```

## 🔧 Personalização

Você pode editar:
- **Cores**: `public/styles.css` (variáveis CSS no início)
- **Exercícios**: `server.js` (seção de dados padrão)
- **Níveis**: `server.js` (tabela de níveis)
- **Interface**: `public/index.html` e `public/app.js`

## 💡 Próximos Passos

1. Crie mais exercícios editando `server.js`
2. Personalize as cores em `styles.css`
3. Convide amigos a usar a plataforma
4. Compete no ranking! 🏆

---

**Precisa de ajuda?** Verifique o console do navegador (F12) para mensagens de erro.

**Bom estudo! 📖**
