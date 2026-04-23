const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dbPath = isServerless
  ? path.join('/tmp', 'assistant.db')
  : path.join(__dirname, 'assistant.db');

const db = new sqlite3.Database(dbPath);

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        user_input TEXT NOT NULL,
        ai_output TEXT NOT NULL,
        intent TEXT,
        language TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

function saveInteraction({ endpoint, userInput, aiOutput, intent = null, language = null }) {
  const sql = `
    INSERT INTO interactions (endpoint, user_input, ai_output, intent, language)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [endpoint, userInput, aiOutput, intent, language], (error) => {
    if (error) {
      console.error('Erreur SQLite saveInteraction:', error.message);
    }
  });
}

module.exports = {
  db,
  initDatabase,
  saveInteraction
};
