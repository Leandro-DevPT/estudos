const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lr26122008@gmail.com',
    pass: process.env.GMAIL_PASSWORD || 'zzol cygp kfal dqua' // App Password do Gmail
  }
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./database.db');

// Initialize database
function initializeDatabase() {
  db.serialize(() => {
    // Tabela de usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      totalXp INTEGER DEFAULT 0,
      isAdmin INTEGER DEFAULT 0,
      twoFaCode TEXT,
      twoFaExpire DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de exercícios
    db.run(`CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      category TEXT NOT NULL,
      xpReward INTEGER NOT NULL,
      question TEXT NOT NULL,
      correctAnswer TEXT NOT NULL,
      options TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de progresso do usuário
    db.run(`CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      completed BOOLEAN DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      completedAt DATETIME,
      xpEarned INTEGER DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(exerciseId) REFERENCES exercises(id)
    )`);

    // Tabela de níveis
    db.run(`CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level INTEGER NOT NULL,
      xpRequired INTEGER NOT NULL,
      title TEXT NOT NULL
    )`);

    // Inserir dados padrão de níveis
    db.all('SELECT COUNT(*) as count FROM levels', (err, rows) => {
      if (rows[0].count === 0) {
        const levels = [
          { level: 1, xp: 0, title: 'Iniciante' },
          { level: 2, xp: 100, title: 'Aprendiz' },
          { level: 3, xp: 250, title: 'Estudante' },
          { level: 4, xp: 500, title: 'Dedicado' },
          { level: 5, xp: 1000, title: 'Expert' },
          { level: 6, xp: 1500, title: 'Mestre' },
          { level: 7, xp: 2000, title: 'Sábio' },
          { level: 8, xp: 3000, title: 'Lendário' },
          { level: 9, xp: 5000, title: 'Imortal' },
          { level: 10, xp: 10000, title: 'Deus do Conhecimento' }
        ];

        levels.forEach(l => {
          db.run(
            'INSERT INTO levels (level, xpRequired, title) VALUES (?, ?, ?)',
            [l.level, l.xp, l.title]
          );
        });
      }
    });

    // Inserir admin padrão se não existir
    db.all('SELECT COUNT(*) as count FROM users WHERE isAdmin = 1', (err, rows) => {
      if (rows[0].count === 0) {
        db.run(
          'INSERT OR IGNORE INTO users (name, email, password, isAdmin, level, totalXp) VALUES (?, ?, ?, ?, ?, ?)',
          ['Admin123', 'admin@studyhub.local', 'XzrEZf%tqZj,DG9g:xCmT)@GQ9Tgz^', 1, 10, 10000],
          (err) => {
            if (!err) console.log('Você NÃO pode fazer login como admin com email!!');
          }
        );
      }
    });

    // Inserir exercícios padrão
    db.all('SELECT COUNT(*) as count FROM exercises', (err, rows) => {
      if (rows[0].count === 0) {
        const exercises = [
          {
            title: 'O que é HTML?',
            description: 'Pergunta básica sobre HTML',
            difficulty: 'Fácil',
            category: 'HTML',
            xp: 10,
            question: 'O que significa HTML?',
            correct: 'HyperText Markup Language',
            options: '["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]'
          },
          {
            title: 'CSS Basics',
            description: 'Pergunta sobre CSS',
            difficulty: 'Fácil',
            category: 'CSS',
            xp: 10,
            question: 'CSS é usado para?',
            correct: 'Estilizar elementos HTML',
            options: '["Estilizar elementos HTML", "Programação de lógica", "Banco de dados", "Segurança web"]'
          },
          {
            title: 'JavaScript Variables',
            description: 'Pergunta sobre variáveis em JavaScript',
            difficulty: 'Médio',
            category: 'JavaScript',
            xp: 25,
            question: 'Qual é a forma correta de declarar uma variável em JavaScript?',
            correct: 'const nome = "João"',
            options: '["const nome = \\"João\\"", "declare nome = \\"João\\"", "variable nome = \\"João\\"", "set nome = \\"João\\""]'
          },
          {
            title: 'DOM Manipulation',
            description: 'Pergunta sobre manipulação do DOM',
            difficulty: 'Médio',
            category: 'JavaScript',
            xp: 25,
            question: 'Como selecionar um elemento com ID "main" em JavaScript?',
            correct: 'document.getElementById("main")',
            options: '["document.getElementById(\\"main\\")", "document.select(\\"main\\")", "document.query(\\"main\\")", "document.find(\\"main\\")"]'
          },
          {
            title: 'SQL Basics',
            description: 'Pergunta sobre SQL',
            difficulty: 'Médio',
            category: 'Banco de Dados',
            xp: 30,
            question: 'Qual comando é usado para recuperar dados de uma tabela?',
            correct: 'SELECT',
            options: '["SELECT", "RETRIEVE", "GET", "FETCH"]'
          },
          {
            title: 'Node.js Introduction',
            description: 'Pergunta sobre Node.js',
            difficulty: 'Difícil',
            category: 'Node.js',
            xp: 50,
            question: 'O que é Node.js?',
            correct: 'Um ambiente JavaScript para servidor',
            options: '["Um ambiente JavaScript para servidor", "Um banco de dados", "Um navegador web", "Uma linguagem de programação"]'
          },
          {
            title: 'Arrow Function',
            description: 'Sintaxe de arrow function',
            difficulty: 'Médio',
            category: 'JavaScript',
            xp: 20,
            question: 'Como declarar uma arrow function que retorna x?',
            correct: 'const f = () => x;',
            options: '["const f = () => x;","function f() => x;","let f = => x;","var f = () => {x};","const f = function => x;","f() -> x;","const f = () -> x;","const f => x;"]'
          },
          {
            title: 'O que é JSON?',
            description: 'Significado de JSON',
            difficulty: 'Fácil',
            category: 'JavaScript',
            xp: 10,
            question: 'O que significa JSON?',
            correct: 'JavaScript Object Notation',
            options: '["JavaScript Object Notation","Java Standard Output Network","Just Simple Object Notation","JavaScript Online Network","JavaScript Object Name","JavaScript Oriented Namespace","Joint Standard Object Notation","JavaScript Only Number"]'
          },
          {
            title: 'HTTP 404',
            description: 'Significado de HTTP 404',
            difficulty: 'Fácil',
            category: 'Web',
            xp: 10,
            question: 'O que indica o status HTTP 404?',
            correct: 'Recurso não encontrado',
            options: '["Recurso não encontrado","Erro interno do servidor","Acesso negado","Serviço não disponível","Redirecionamento permanente","Tempo de conexão esgotado","Erro de sintaxe","Recurso movido"]'
          },
          {
            title: 'Tag <a>',
            description: 'Finalidade da tag <a>',
            difficulty: 'Fácil',
            category: 'HTML',
            xp: 10,
            question: 'Para que serve a tag <a>?',
            correct: 'Criar links',
            options: '["Criar links","Definir cabeçalhos","Exibir imagens","Aplicar estilos","Executar scripts","Inserir tabelas","Formular dados","Adicionar vídeos"]'
          },
          {
            title: 'Selecionar classe em CSS',
            description: 'Uso de seletor de classe',
            difficulty: 'Fácil',
            category: 'CSS',
            xp: 10,
            question: 'Como selecionar elementos com classe "box" em CSS?',
            correct: '.box { }',
            options: '[".box { }","#box { }","box { }","*box { }","class.box { }","[box] { }",":box { }","box.class { }"]'
          },
          {
            title: 'Comando SQL para atualizar',
            description: 'Modificar dados em SQL',
            difficulty: 'Médio',
            category: 'Banco de Dados',
            xp: 25,
            question: 'Qual comando SQL muda dados existentes?',
            correct: 'UPDATE',
            options: '["UPDATE","MODIFY","CHANGE","ALTER","SET","REPLACE","EDIT","SAVE"]'
          },
          {
            title: 'Exportar em Node.js',
            description: 'Mecanismo de exportação',
            difficulty: 'Médio',
            category: 'Node.js',
            xp: 25,
            question: 'Como exportar uma função em Node.js?',
            correct: 'module.exports = minhaFuncao;',
            options: '["module.exports = minhaFuncao;","export minhaFuncao;","exports = minhaFuncao;","export default minhaFuncao;","module.export minhaFuncao;","require minhaFuncao;","module.exports.minhaFuncao;","module.exports = {minhaFuncao};"]'
          },
          {
            title: 'Null vs Undefined',
            description: 'Diferença entre valores em JS',
            difficulty: 'Médio',
            category: 'JavaScript',
            xp: 20,
            question: 'Qual desses representa ausência intencional de valor?',
            correct: 'null',
            options: '["null","undefined","NaN","0","false","","void","None"]'
          },
          {
            title: 'Método push em Arrays',
            description: 'Adicionar elementos',
            difficulty: 'Fácil',
            category: 'JavaScript',
            xp: 10,
            question: 'Qual método adiciona item ao final de um array?',
            correct: 'push()',
            options: '["push()","pop()","shift()","unshift()","concat()","append()","add()","insert()"]'
          },
          {
            title: 'Promise then()',
            description: 'Tratando promessas',
            difficulty: 'Médio',
            category: 'JavaScript',
            xp: 30,
            question: 'Qual método é chamado quando uma promise ocorre com sucesso?',
            correct: 'then()',
            options: '["then()","catch()","finally()","resolve()","success()","done()","next()","onSuccess()"]'
          },
          {
            title: 'REST API HTTP Methods',
            description: 'Métodos HTTP em APIs REST',
            difficulty: 'Médio',
            category: 'Web',
            xp: 25,
            question: 'Qual método HTTP é usado para obter dados sem modificar?',
            correct: 'GET',
            options: '["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS","TRACE"]'
          }
        ];

        exercises.forEach(ex => {
          db.run(
            `INSERT INTO exercises (title, description, difficulty, category, xpReward, question, correctAnswer, options)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ex.title, ex.description, ex.difficulty, ex.category, ex.xp, ex.question, ex.correct, ex.options]
          );
        });
      }
    });
  });
}

initializeDatabase();

// API Routes

// Registrar usuário
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Gerar código 2FA
  const twoFaCode = generateTwoFACode();
  const twoFaExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
  
  db.run(
    'INSERT INTO users (name, email, password, twoFaCode, twoFaExpire) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, twoFaCode, twoFaExpire],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
      
      // Enviar email com código 2FA
      sendTwoFAEmail(email, twoFaCode, name)
        .then((result) => {
          res.json({ 
            message: 'Usuário registrado. Verifique seu email para o código de confirmação.',
            userId: this.lastID,
            requiresTwoFA: true,
            email: email
          });
        })
        .catch((err) => {
          console.error('Erro ao enviar email:', err);
          // Mesmo com erro de email, continua o registro
          res.json({ 
            message: 'Usuário registrado. Verifique seu email para o código de confirmação.',
            userId: this.lastID,
            requiresTwoFA: true,
            email: email
          });
        });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE name = ? AND password = ?',
    [name, password],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Se é a primeira verificação (registro), enviar novo código
      if (!user.twoFaCode || new Date() > new Date(user.twoFaExpire)) {
        const twoFaCode = generateTwoFACode();
        const twoFaExpire = new Date(Date.now() + 10 * 60 * 1000);
        
        db.run(
          'UPDATE users SET twoFaCode = ?, twoFaExpire = ? WHERE id = ?',
          [twoFaCode, twoFaExpire, user.id]
        );
        
        // Enviar email
        sendTwoFAEmail(user.email, twoFaCode, user.name)
          .catch((err) => console.error('Erro ao enviar email 2FA:', err));
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        requiresTwoFA: true,
        message: 'Código de verificação enviado para seu email'
      });
    }
  );
});

// Verificar código 2FA
app.post('/api/verify-2fa', (req, res) => {
  const { userId, code } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar se o código expirou
      if (!user.twoFaCode || new Date() > new Date(user.twoFaExpire)) {
        return res.status(400).json({ error: 'Código expirado. Faça login novamente.' });
      }
      
      // Verificar se o código está correto
      if (user.twoFaCode !== code.toString()) {
        return res.status(401).json({ error: 'Código de verificação inválido' });
      }
      
      // Limpar código 2FA
      db.run(
        'UPDATE users SET twoFaCode = NULL, twoFaExpire = NULL WHERE id = ?',
        [userId]
      );
      
      // Retornar dados do usuário verificado
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalXp: user.totalXp,
        isAdmin: user.isAdmin,
        message: 'Verificação bem-sucedida!'
      });
    }
  );
});

// Obter perfil do usuário
app.get('/api/user/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT u.*, l.title as levelTitle 
     FROM users u 
     LEFT JOIN levels l ON u.level = l.level 
     WHERE u.id = ?`,
    [id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    }
  );
});

// Obter todos os exercícios
app.get('/api/exercises', (req, res) => {
  db.all('SELECT * FROM exercises ORDER BY difficulty', (err, exercises) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar exercícios' });
    }
    res.json(exercises);
  });
});

// Obter exercício específico
app.get('/api/exercises/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM exercises WHERE id = ?', [id], (err, exercise) => {
    if (err || !exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }
    res.json(exercise);
  });
});

// Submeter resposta de exercício
app.post('/api/submit-exercise', (req, res) => {
  const { userId, exerciseId, answer } = req.body;
  
  db.get('SELECT * FROM exercises WHERE id = ?', [exerciseId], (err, exercise) => {
    if (err || !exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    const isCorrect = answer === exercise.correctAnswer;

    if (isCorrect) {
      // calcular sequência de acertos anteriores
      db.all('SELECT xpEarned FROM progress WHERE userId = ? ORDER BY id DESC LIMIT 10', [userId], (err, rows) => {
        let streak = 0;
        for (const r of rows) {
          if (r.xpEarned > 0) streak++;
          else break;
        }
        let bonusPercent = 0;
        if (streak >= 3) {
          bonusPercent = (streak - 2) * 10; // 10% para sequência de 3, +10% por acerto extra
        }

        let xpEarned = exercise.xpReward;
        if (bonusPercent > 0) {
          xpEarned = Math.floor(xpEarned * (1 + bonusPercent / 100));
        }

        // Atualizar XP do usuário
        db.get('SELECT level, xp, totalXp FROM users WHERE id = ?', [userId], (err, user) => {
          const newTotalXp = user.totalXp + xpEarned;
          let newLevel = user.level;
          let newXp = user.xp + xpEarned;

          // Verificar se passou de nível
          db.get('SELECT xpRequired FROM levels WHERE level = ?', [newLevel + 1], (err, nextLevel) => {
            if (nextLevel && newXp >= nextLevel.xpRequired) {
              newLevel++;
              newXp = newXp - nextLevel.xpRequired;
            }

            db.run(
              'UPDATE users SET level = ?, xp = ?, totalXp = ? WHERE id = ?',
              [newLevel, newXp, newTotalXp, userId]
            );

            // Registrar progresso
            db.run(
              `INSERT INTO progress (userId, exerciseId, completed, xpEarned, completedAt)
               VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [userId, exerciseId, isCorrect, xpEarned]
            );

            res.json({
              correct: isCorrect,
              xpEarned,
              bonusPercent,
              streak,
              newLevel,
              newXp,
              newTotalXp,
              message: 'Resposta correta!'
            });
          });
        });
      });
    } else {
      // Registrar progresso mesmo com resposta errada
      db.run(
        `INSERT INTO progress (userId, exerciseId, xpEarned)
         VALUES (?, ?, 0)`,
        [userId, exerciseId]
      );

      res.json({
        correct: false,
        xpEarned: 0,
        message: 'Resposta incorreta. A resposta correta é: ' + exercise.correctAnswer
      });
    }
  });
});

// Obter progressos do usuário
app.get('/api/user/:id/progress', (req, res) => {
  const { id } = req.params;
  
  db.all(
    `SELECT p.*, e.title as exerciseTitle, e.category, e.difficulty
     FROM progress p
     JOIN exercises e ON p.exerciseId = e.id
     WHERE p.userId = ?
     ORDER BY p.completedAt DESC`,
    [id],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar progresso' });
      }
      res.json(progress);
    }
  );
});

// Obter ranking
app.get('/api/ranking', (req, res) => {
  db.all(
    `SELECT u.id, u.name, u.level, u.totalXp, l.title as levelTitle
     FROM users u
     LEFT JOIN levels l ON u.level = l.level
     ORDER BY u.totalXp DESC
     LIMIT 10`,
    (err, ranking) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar ranking' });
      }
      res.json(ranking);
    }
  );
});

// Obter estatísticas gerais
app.get('/api/stats/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT 
      COUNT(DISTINCT exerciseId) as completedExercises,
      SUM(CASE WHEN xpEarned > 0 THEN 1 ELSE 0 END) as correctAnswers,
      COUNT(*) as totalAttempts
     FROM progress
     WHERE userId = ? AND completed = 1`,
    [id],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
      }
      res.json(stats || { completedExercises: 0, correctAnswers: 0, totalAttempts: 0 });
    }
  );
});

// ============ ADMIN ROUTES ============

// Login admin
app.post('/api/admin/login', (req, res) => {
  const { name, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE name = ? AND password = ? AND isAdmin = 1',
    [name, password],
    (err, admin) => {
      if (err || !admin) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isAdmin: 1
      });
    }
  );
});

// Listar todos os usuários (admin only)
app.get('/api/admin/users', (req, res) => {
  db.all(
    `SELECT u.id, u.name, u.email, u.level, u.xp, u.totalXp, u.isAdmin, u.createdAt, l.title as levelTitle
     FROM users u
     LEFT JOIN levels l ON u.level = l.level
     ORDER BY u.totalXp DESC`,
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
      }
      res.json(users);
    }
  );
});

// Obter detalhes de um usuário (admin only)
app.get('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT u.*, l.title as levelTitle
     FROM users u
     LEFT JOIN levels l ON u.level = l.level
     WHERE u.id = ?`,
    [id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      db.all(
        `SELECT p.*, e.title as exerciseTitle, e.category, e.difficulty
         FROM progress p
         JOIN exercises e ON p.exerciseId = e.id
         WHERE p.userId = ?
         ORDER BY p.completedAt DESC`,
        [id],
        (err, progress) => {
          user.progress = progress || [];
          res.json(user);
        }
      );
    }
  );
});

// Atualizar usuário (admin only)
app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, level, xp, totalXp } = req.body;
  
  db.run(
    'UPDATE users SET name = ?, email = ?, level = ?, xp = ?, totalXp = ? WHERE id = ?',
    [name, email, level, xp, totalXp, id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Erro ao atualizar usuário' });
      }
      res.json({ success: true, message: 'Usuário atualizado com sucesso' });
    }
  );
});

// Deletar usuário (admin only)
app.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Erro ao deletar usuário' });
    }
    db.run('DELETE FROM progress WHERE userId = ?', [id]);
    res.json({ success: true, message: 'Usuário deletado com sucesso' });
  });
});

// Resetar progresso de um usuário (admin only)
app.post('/api/admin/users/:id/reset', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM progress WHERE userId = ?', [id], (err) => {
    if (err) {
      return res.status(400).json({ error: 'Erro ao resetar progresso' });
    }
    db.run(
      'UPDATE users SET level = 1, xp = 0, totalXp = 0 WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          return res.status(400).json({ error: 'Erro ao atualizar usuário' });
        }
        res.json({ success: true, message: 'Progresso resetado com sucesso' });
      }
    );
  });
});

// Promover usuário a admin
app.post('/api/admin/users/:id/promote', (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE users SET isAdmin = 1 WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao promover usuário' });
      }
      res.json({ success: true, message: 'Usuário promovido a admin com sucesso' });
    }
  );
});

// Remover admin de um usuário
app.post('/api/admin/users/:id/demote', (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE users SET isAdmin = 0 WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao remover privilégios de admin' });
      }
      res.json({ success: true, message: 'Privilégios de admin removidos com sucesso' });
    }
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
