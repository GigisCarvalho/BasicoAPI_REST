import mysql from "mysql2/promise"; // Importando o módulo mysql2/promise para criar uma conexão com o banco de dados MySQL usando Promises
import dotenv from "dotenv"; // Importando o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env

dotenv.config(); // Carregando as variáveis de ambiente definidas no arquivo .env para que possam ser acessadas no código

export const pool = mysql.createPool({ // Criando uma instância de pool de conexões com o banco de dados MySQL usando as variáveis de ambiente carregadas
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});