import express from "express"; //impotando o módulo express para usar suas funcionalidades de criação de servidor e rotas
import cors from "cors"; //importando o módulo cors para permitir requisições de diferentes origens (cross-origin requests)
import dotenv from "dotenv"; //importando o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env
import { pool } from "./db.js"; //importando a instância de conexão com o banco de dados MySQL a partir do arquivo db.js

dotenv.config(); //Carregando as variáveis de ambiente definidas no arquivo .env para que possam ser acessadas no código

const app = express(); //Criando uma instância do aplicativo Express para configurar o servidor e suas rotas
const PORT = process.env.PORT; //Definindo a porta em que o servidor irá escutar, obtida a partir das variáveis de ambiente

// Middlewares
app.use(cors()); //Habilitando o middleware CORS para permitir requisições de diferentes origens
app.use(express.json()); //Habilitando o middleware para interpretar requisições com corpo em formato JSON

// Rotas
app.post("/", async (req, res) => { //Definindo uma rota POST na raiz do servidor para criar um novo usuário
	try {
		const { nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo } = req.body; //Extraindo os dados do corpo da requisição para criar um novo usuário
		
		const [result] = await pool.query(
		  "INSERT INTO usuarios (nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		  [nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo]
		);
		
		res.status(201).json({ id: result.insertId, nome, email }); //Retornando uma resposta de sucesso com o ID do novo usuário criado e os dados fornecidos
	} catch (e) {
		res.status(500).json({ erro: "Falha ao criar usuário" });
	}
});

app.get("/", async (req, res) => { //Definindo uma rota GET na raiz do servidor para listar todos os usuários
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
});

app.get("/:id", async (req, res) => { //Definindo uma rota GET para obter um usuário específico pelo ID
  try {
    const { id } = req.params; //Extraindo o ID do usuário a partir dos parâmetros da rota
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar o usuário" });
  }
});

app.put("/:id", async (req, res) => { //Definindo uma rota PUT para atualizar um usuário específico pelo ID
  try {
    const { id } = req.params; //Extraindo o ID do usuário a partir dos parâmetros da rota
    const { nome, email } = req.body; //Extraindo os dados do corpo da requisição para atualizar o usuário

    const [result] = await pool.query(
      "UPDATE usuarios SET nome = COALESCE(?, nome), email = COALESCE(?, email) WHERE id = ?",
      [nome || null, email || null, id]
    );

    if (!result.affectedRows) { //Verificando se algum registro foi afetado pela atualização; se não, significa que o usuário não foi encontrado
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Atualizado com sucesso" }); //Retornando uma resposta de sucesso indicando que o usuário foi atualizado com sucesso
  } catch (e) {
    res.status(500).json({ erro: "Falha ao atualizar usuário" });
  }
});

app.delete("/:id", async (req, res) => { //Definindo uma rota DELETE para remover um usuário específico pelo ID
  try {
    const { id } = req.params; //Extraindo o ID do usuário a partir dos parâmetros da rota 

    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Deletado com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao deletar usuário" });
  }
});

app.listen(PORT, () => { //Iniciando o servidor na porta definida e exibindo uma mensagem no console indicando que o servidor está rodando
  console.log(`Servidor MySQL rodando em http://localhost:${PORT}`);
});