// ============ EXEMPLOS DE COMO ADICIONAR MAIS EXERCÍCIOS ============

// Para adicionar mais exercícios, edite a array 'exercises' em server.js
// Copie um dos exemplos abaixo e adicione à lista

// EXEMPLO 1: Exercício Fácil sobre HTML
{
  title: "Semântica HTML",
  description: "Aprenda sobre tags semânticas em HTML",
  difficulty: "Fácil",
  category: "HTML",
  xp: 10,
  question: "Qual tag é usada para agrupar conteúdo relacionado?",
  correct: "<section>",
  options: '["<section>", "<div>", "<span>", "<article>"]'
}

// EXEMPLO 2: Exercício Médio sobre CSS
{
  title: "Flexbox Basics",
  description: "Entenda como usar Flexbox em CSS",
  difficulty: "Médio",
  category: "CSS",
  xp: 25,
  question: "Qual propriedade centraliza itens em um flexbox?",
  correct: "justify-content: center;",
  options: '["justify-content: center;", "align: center;", "center-items: true;", "flex-center: true;"]'
}

// EXEMPLO 3: Exercício Médio sobre JavaScript
{
  title: "Arrow Functions",
  description: "Aprenda sobre arrow functions",
  difficulty: "Médio",
  category: "JavaScript",
  xp: 25,
  question: "Qual é a sintaxe correta de uma arrow function?",
  correct: "const fn = (x) => x * 2",
  options: '["const fn = (x) => x * 2", "const fn = function(x) { return x * 2; }", "const fn = (x) -> x * 2", "const fn = [x] => x * 2"]'
}

// EXEMPLO 4: Exercício Difícil sobre Banco de Dados
{
  title: "SQL Joins",
  description: "Entenda como usar JOINS em SQL",
  difficulty: "Difícil",
  category: "Banco de Dados",
  xp: 999999999,
  question: "Qual JOIN retorna apenas registros que existem em ambas as tabelas?",
  correct: "INNER JOIN",
  options: '["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]'
}

// EXEMPLO 5: Exercício sobre React (nova categoria)
{
  title: "React Hooks",
  description: "Aprenda sobre hooks em React",
  difficulty: "Difícil",
  category: "React",
  xp: 50,
  question: "Qual hook é usado para gerenciar estado em componentes funcionais?",
  correct: "useState",
  options: '["useState", "useEffect", "useRef", "useContext"]'
}

// EXEMPLO 6: Exercício sobre TypeScript (nova categoria)
{
  title: "TypeScript Types",
  description: "Entenda tipos em TypeScript",
  difficulty: "Médio",
  category: "TypeScript",
  xp: 25,
  question: "Como declarar um tipo de variável em TypeScript?",
  correct: "const nome: string = 'João';",
  options: '["const nome: string = \\"João\\";", "const nome<string> = \\"João\\";", "const nome = string \\"João\\";", "const nome => string = \\"João\\";"]'
}

// ============ PASSOS PARA ADICIONAR ============
/*
1. Abra o arquivo: server.js

2. Localize a seção: "// Inserir exercícios padrão"
   (procure por: db.all('SELECT COUNT(*) as count FROM exercises')

3. Dentro da condição if (rows[0].count === 0) {
   Localize a array 'exercises' e adicione um novo objeto

4. Exemplo de adição:

   const exercises = [
     { título: "O que é HTML?", ... }, // existente
     { título: "CSS Basics", ... },     // existente
     // NOVO EXERCÍCIO AQUI:
     {
       title: "Seu título",
       description: "Descrição curta",
       difficulty: "Fácil", // Fácil, Médio, Difícil
       category: "HTML",    // Categoria do exercício
       xp: 10,              // XP que vale
       question: "A pergunta aqui?",
       correct: "Resposta correta",
       options: '["Opção 1", "Opção 2", "Resposta correta", "Opção 4"]'
     }
   ];

5. Salve o arquivo

6. Reinicie o servidor (npm start)

7. Acesse http://localhost:3000
   O novo exercício aparecerá na seção de exercícios!
*/

// ============ DICAS IMPORTANTES ============

/*
NÍVEIS DE DIFICULDADE:
- "Fácil"   : Exercícios básicos, até 15 XP
- "Médio"   : Exercícios intermediários, 20-30 XP  
- "Difícil" : Exercícios avançados, 40-60 XP

CATEGORIAS SUGERIDAS:
- HTML
- CSS
- JavaScript
- React
- Node.js
- Banco de Dados
- TypeScript
- Python
- Java
- C++

ESTRUTURA DA RESPOSTA:
- A resposta correta deve ser EXATAMENTE uma das opções
- As opções devem estar em formato JSON (com aspas duplas escapadas)
- Exemplo: '["Opção 1", "Opção 2", "Opção 3", "Opção 4"]'

XP RECOMENDADO:
- Fácil: 10-15 XP
- Médio: 20-30 XP
- Difícil: 40-60 XP

BOAS PRÁTICAS:
1. Faça perguntas claras e diretas
2. Uma única resposta correta
3. Opções plausíveis mas diferentes
4. Evite pegadinhas ou ambiguidades
5. Organize por categoria
6. Comece com fácil → médio → difícil
*/

// ============ VERIFICAR SE FUNCIONOU ============
/*
Após adicionar um exercício:

1. Reinicie o servidor (Ctrl+C e depois npm start)

2. Abra http://localhost:3000

3. Você deve ver o novo exercício na lista

4. Se não aparecer:
   - Verifique se o JSON das opções está correto
   - Confirme que a resposta correta é idêntica a uma das opções
   - Verifique o console do navegador (F12) para erros

5. Teste respondendo a pergunta!
*/
