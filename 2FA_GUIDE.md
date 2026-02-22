# Sistema de Autenticação em Duas Etapas (2FA) - StudyHub

## Visão Geral

O StudyHub agora possui um sistema robusto de autenticação em duas etapas (2FA) por email. Quando um usuário se registra ou faz login, ele recebe um código de verificação de 6 dígitos que deve ser inserido para acessar a plataforma.

## Como Funciona

### 1. **Registro (Sign Up)**
```
usuário preenche nome, email e senha
        ↓
sistema cria conta e gera código 2FA
        ↓
sistema envia código para email
        ↓
tela de verificação 2FA aparece
        ↓
usuário insere código
        ↓
sistema valida código
        ↓
✓ login bem-sucedido
```

### 2. **Login**
```
usuário insere nome e senha
        ↓
credenciais validadas
        ↓
código 2FA gerado e enviado para email
        ↓
tela de verificação 2FA aparece
        ↓
usuário insere código
        ↓
sistema valida código
        ↓
✓ login bem-sucedido
```

## Interface Gráfica

### Tela de Verificação 2FA
- Input para digitar 6 dígitos
- Botão "Verificar"
- Botão "Cancelar" (volta para login)
- Link "Reenviar Código"

### Validações
- ✓ Código deve ter exatamente 6 dígitos
- ✓ Código expira em 10 minutos
- ✓ Múltiplas tentativas permitidas
- ✓ Mensagens de erro claras

## API REST Endpoints

### `POST /api/register`
Registra novo usuário e ativa 2FA

**Request:**
```json
{
  "name": "usuario123",
  "email": "user@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Usuário registrado. Verifique seu email para o código de confirmação.",
  "userId": 1,
  "requiresTwoFA": true,
  "email": "user@email.com"
}
```

---

### `POST /api/login`
Autentica usuário e solicita 2FA

**Request:**
```json
{
  "name": "usuario123",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "usuario123",
  "email": "user@email.com",
  "requiresTwoFA": true,
  "message": "Código de verificação enviado para seu email"
}
```

---

### `POST /api/verify-2fa`
Verifica código 2FA e conclui autenticação

**Request:**
```json
{
  "userId": 1,
  "code": "123456"
}
```

**Response (200 - Sucesso):**
```json
{
  "id": 1,
  "name": "usuario123",
  "email": "user@email.com",
  "level": 1,
  "xp": 0,
  "totalXp": 0,
  "isAdmin": 0,
  "message": "Verificação bem-sucedida!"
}
```

**Response (400 - Código Expirado):**
```json
{
  "error": "Código expirado. Faça login novamente."
}
```

**Response (401 - Código Inválido):**
```json
{
  "error": "Código de verificação inválido"
}
```

---

## Banco de Dados

### Campos Na Tabela `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  totalXp INTEGER DEFAULT 0,
  isAdmin INTEGER DEFAULT 0,
  twoFaCode TEXT,           -- novo: código atual
  twoFaExpire DATETIME,     -- novo: vencimento do código
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Segurança

### Código 2FA
- ✓ 6 dígitos aleatórios (100000-999999)
- ✓ Vencimento em 10 minutos
- ✓ Limpeza automática após verificação
- ✓ Uma tentativa por código gerado

### Email
- ✓ Enviado via Gmail utilizando nodemailer
- ✓ Email from: `fvjytewun@gmail.com`
- ✓ Template HTML profissional
- ✓ Fallback em caso de erro (modo desenvolvimento)

### Sessão
- ✓ Armazenada em `localStorage`
- ✓ Dados completos do usuário inclusos
- ✓ Pode fazer logout a qualquer momento

## Testando Localmente

### Modo Demonstração
Durante o desenvolvimento, os códigos 2FA aparecem no console do servidor:

```
[2FA] Código para usuario123 (user@email.com): 517294
```

Para testar sem configurar email do Gmail:
1. Copie o código do console
2. Cole na tela de verificação
3. Pressione "Verificar"

### Modo Produção
Para usar email real do Gmail:

1. **Gerar App Password:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Mail" e "Windows Computer"
   - Copie a senha gerada

2. **Configurar variável de ambiente:**
   ```powershell
   $env:GMAIL_PASSWORD = "seu_app_password"
   npm start
   ```

   Ou crie arquivo `.env`:
   ```
   GMAIL_PASSWORD=seu_app_password
   ```

## Fluxo de Teste Completo

```
npm start
# servidor rodando em http://localhost:3000

# Abrir navegador
http://localhost:3000

# ABA "REGISTRAR"
Nome: usuario_teste
Email: teste@example.com
Senha: senha123
Clicar "Registrar"

# Código aparece no console do servidor
# [2FA] Código para usuario_teste (teste@example.com): 123456

# Copiar código na tela de verificação
Código: 123456
Clicar "Verificar"

# ✓ Login bem-sucedido!
```

## Funcionalidades Extras

### Reenviar Código
Clique em "Reenviar Código" para solicitar um novo código:
- Novo código é gerado
- Novo email é enviado
- Contador é resetado

### Cancelar Verificação
Clique "Cancelar" para voltar ao login e tentar novamente

### Expiração Automática
- Código válido por 10 minutos
- Mensagem de erro clara se expirar
- Necessário fazer novo login

## Integração com Frontend

### JavaScript Side (app.js)
```javascript
// Estado para usuário pendente 2FA
let pendingUser = null;

// Mostrar tela de 2FA após login/registro
showTwoFAScreen();

// Verificar código ao enviar formulário
app.post('/api/verify-2fa', { userId, code })

// Após sucesso, completar login
currentUser = data;
localStorage.setItem('currentUser', JSON.stringify(currentUser));
showMainScreen();
```

## Estrutura das Telas

```
┌─────────────────────────────┐
│      StudyHub 2FA Login      │
│                              │
│  Verificação em Duas Etapas  │
│  Insira código para seu email│
│                              │
│  [000000             ]       │
│   Digite os 6 dígitos        │
│                              │
│  [Verificar]  [Cancelar]     │
│                              │
│  Não recebeu o código?       │
│  [Reenviar Código]           │
└─────────────────────────────┘
```

## Troubleshooting

### "Código expirado"
- Clique "Reenviar Código"
- Copie o novo código do console
- Insira o novo código

### "Código inválido"
- Verifique se digitou corretamente
- Copie do console (sem espaços)
- Tente novamente

### Email não chega
- Modo debug mostra código no console do servidor
- Em produção, verificar App Password gmail
- Verificar pasta de Spam/Lixo eletrônico

### Código não aparece no console
- Reinicie o servidor: `npm start`
- Verifique se nodemailer está instalado: `npm install nodemailer`
- Procure por `[2FA]` no output

## Próximas Melhorias

- [ ] SMS 2FA como alternativa
- [ ] Autenticador TOTP (Google Authenticator)
- [ ] Recuperação de conta via backup codes
- [ ] 2FA obrigatória para admins
- [ ] Configuração de 2FA no perfil do usuário
- [ ] Histórico de tentativas de login
- [ ] IP whitelist

---

**Última atualização:** Fevereiro de 2026
**Desenvolvedor:** GitHub Copilot
**Status:** Produção ✓
