# StudyHub - Plataforma Completa de Estudos

Uma plataforma web moderna e interativa para estudos com sistema de XP, níveis, exercícios e ranking.

## 🎯 Características

- **Sistema de Autenticação**: Registrar e fazer login
- **10 Níveis de Progressão**: De Iniciante a Deus do Conhecimento
- **Sistema de XP**: Ganhe experiência completando exercícios
- **6+ Exercícios**: Com diferentes níveis de dificuldade
- **Banco de Dados SQLite**: Armazenamento persistente de dados
- **Dashboard Intuitivo**: Visualize seu progresso
- **Ranking**: Veja como você se compara com outros usuários
- **Sistema de Categorias**: Exercícios organizados por categoria
- **Interface Responsiva**: Funciona em desktop e mobile

## 📋 Requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)

## 🚀 Instalação

1. **Clone ou extraia o projeto**
```bash
cd "c:\Users\lr080\Desktop\Estudos"
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📖 Como Usar

1. **Acesse o site** em `http://localhost:3000`
2. **Crie uma conta** ou faça login se já tiver uma
3. **Resolva exercícios** para ganhar XP
4. **Suba de nível** conforme acumula experiência
5. **Veja seu progresso** no dashboard
6. **Compete no ranking** com outros usuários

## 🎮 Sistema de Níveis e XP

| Nível | Título | XP Necessário |
|-------|--------|---------------|
| 1 | Iniciante | 0 |
| 2 | Aprendiz | 100 |
| 3 | Estudante | 250 |
| 4 | Dedicado | 500 |
| 5 | Expert | 1000 |
| 6 | Mestre | 1500 |
| 7 | Sábio | 2000 |
| 8 | Lendário | 3000 |
| 9 | Imortal | 5000 |
| 10 | Deus do Conhecimento | 10000 |

## 🎓 Categorias de Exercícios

- **HTML** - Estrutura web
- **CSS** - Estilização
- **JavaScript** - Programação web
- **Banco de Dados** - SQL e conceitos
- **Node.js** - Backend

## 📊 Funcionalidades

### Dashboard
- Visualize seu nível e XP total
- Acompanhe exercícios completados
- Veja atividades recentes
- Monitore seu progresso para o próximo nível

### Exercícios
- Filtro por dificuldade (Fácil, Médio, Difícil)
- Questões múltipla escolha
- Feedback imediato
- XP recompensado ao acertar

### Progresso
- Histórico de todas as tentativas
- Status de conclusão
- XP ganho por exercício
- Datas de conclusão

### Ranking
- Top 10 usuários por XP total
- Badges de medalha (ouro, prata, bronze)
- Visualização de níveis

### Perfil
- Informações pessoais
- Estatísticas gerais
- Data de cadastro
- XP total acumulado

## 🗄️ Estrutura do Banco de Dados

### Tabelas
- **users** - Dados de usuários
- **exercises** - Exercícios disponíveis
- **progress** - Progresso do usuário em exercícios
- **levels** - Definição de níveis e XP

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Banco de Dados**: SQLite3
- **Middlewares**: CORS, Body-Parser

## 📁 Estrutura do Projeto

```
estudos/
├── server.js           # Servidor Node.js e API
├── package.json        # Dependências do projeto
├── database.db         # Banco de dados SQLite (criado na primeira execução)
└── public/
    ├── index.html      # Interface principal
    ├── app.js          # Lógica JavaScript
    └── styles.css      # Estilos CSS
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Fazer login

### Exercícios
- `GET /api/exercises` - Listar todos os exercícios
- `GET /api/exercises/:id` - Obter exercício específico
- `POST /api/submit-exercise` - Enviar resposta do exercício

### Usuário
- `GET /api/user/:id` - Obter dados do usuário
- `GET /api/user/:id/progress` - Obter progresso do usuário
- `GET /api/stats/:id` - Obter estatísticas do usuário

### Ranking
- `GET /api/ranking` - Obter ranking dos top 10 usuários

## 💡 Como Adicionar Novos Exercícios

O sistema já inclui cerca de 16 perguntas, várias delas no formato de quiz com até 8 alternativas. Responder corretamente em sequência gera um **bônus de XP** (uma sequência de 3 acertos dá 10% de XP extra, 4 acertos 20%, e assim por diante).

1. Abra `server.js`
2. Localize a seção de "Inserir exercícios padrão"
3. Adicione um novo objeto à array `exercises`:

```javascript
{
  title: "Novo Exercício",
  description: "Descrição do exercício",
  difficulty: "Fácil", // Fácil, Médio, Difícil
  category: "HTML",
  xp: 10, // XP recompensado
  question: "A pergunta aqui?",
  correct: "Resposta correta",
  options: '["Opção 1", "Opção 2", "Resposta correta", "Opção 4"]'
}
```

4. Reinicie o servidor

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  /* ... outras cores */
}
```

### Exercícios
Modifique as definições de exercícios em `server.js`

### Níveis
Ajuste os níveis e XP necessário em `server.js` na seção de inicialização

## 📞 Suporte

Para reportar problemas ou sugestões, verifique:
1. Se o Node.js está instalado: `node --version`
2. Se as dependências estão instaladas: `npm install`
3. Se a porta 3000 está disponível
4. Verifique o console do navegador (F12) para erros JavaScript

## 📝 Licença

Projeto criado para fins educacionais.

## 🚀 Próximas Melhorias

- [ ] Adicionar mais exercícios
- [ ] Sistema de conquistas
- [ ] Aulas interativas
- [ ] Quiz em tempo real
- [ ] Sistema de chat/comunidade
- [ ] Modo escuro/claro
- [ ] Exportar certificado de conclusão
- [ ] Dashboard com gráficos de progresso

---

**Bom estudo! 🎓**
