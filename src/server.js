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

app.get("/", async (req, res) => { //Definindo uma rota GET na raiz do servidor para listar todos os usuários paginados
  try {

    const page = Number.parseInt(req.query.page ?? "1", 10); //Extraindo e convertendoo número da página a partir dos parâmetros de consulta da URL, com valor padrão 1 caso não seja fornecido
    const limit = Number.parseInt(req.query.limit ?? "10", 10); //Extraindo e convertendo o limite de resultados por página a partir dos parâmetros de consulta da URL, com valor padrão 10 caso não seja fornecido

    var ultimaPagina; //Inicializando a variável para armazenar o número da última página de resultados
    
    const [rowsCount] = await pool.query("SELECT COUNT(*) AS total FROM usuarios"); //Consultando o banco de dados para obter a quantidade total de usuários cadastrados
    const qntUsuarios = rowsCount[0].total; //Extraindo a quantidade total de usuários do resultado da consulta

    if (qntUsuarios !== 0){

      ultimaPagina = Math.ceil(qntUsuarios / limit); //Calculando o número da última página de resultados com base na quantidade total de usuários e no limite definido
      console.log(qntUsuarios, limit, ultimaPagina); //Exibindo no console a quantidade total de usuários, o limite definido e o número da última página de resultados
    }else{
      return res.status(404).json({ erro: "Nenhum usuário encontrado" });
    }

    var paginacao = { //Armazenando as informações de paginação em um objeto
      paginaAtual: page, //Armazenando o número da página atual
      ultimaPagina: ultimaPagina, //Armazenando o número da última página de resultados
      paginaAnterior: page > 1 ? page - 1 : null, //Armazenando o número da página anterior, se houver; caso contrário, será nulo
      proximaPagina: page < ultimaPagina ? parseInt(page) + 1 : null, //Armazenando o número da próxima página, se houver; caso contrário, será nulo
      totalUsuarios: qntUsuarios //Armazenando a quantidade total de usuários cadastrados
    }

    const [rows] = await pool.query("SELECT * FROM usuarios LIMIT ? OFFSET ?", [limit, (page * limit) - limit]); //Consultando o banco de dados para obter os usuários da página solicitada, limitando a quantidade de resultados e aplicando o deslocamento correto
    res.json({ users: rows, pagination: paginacao }); //Retornando a lista de usuários encontrados e as informações de paginação como resposta

  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
});

// 1. Exemplo de Query Params (Parâmetro de consulta na URL)
app.get("/usuarios", async (req, res) => { //Definindo uma rota GET para listar usuários com base no parâmetro de consulta "ativo" fornecido na URL
  try {
    const {ativo} = req.query; //Extraindo o parâmetro de consulta "ativo" da URL

    if (ativo) { //Verificando se o parâmetro "ativo" foi fornecido na URL
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE ativo = ?", [ativo]); //Consultando o banco de dados para obter apenas os usuários ativos
      res.json(rows); //Retornando a lista de usuários ativos como resposta
    }}
  catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
})

app.get("/usuarios/search", async (req, res) => { //Definindo uma rota GET para listar usuários com base nos parâmetros de consulta "nome" e/ou "email" fornecidos na URL
  try {
    const { nome, email } = req.query; //Extraindo os parâmetros de consulta "nome" e "email" da URL

    if (nome || email) { //Verificando se os parâmetros "nome" ou "email" foram fornecidos na URL
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE nome LIKE ? OR email LIKE ?", [`${nome}%`, `${email}%`]); //Consultando o banco de dados para obter apenas os usuários cujo nome contenha o valor fornecido ou cujo email contenha o valor fornecido
      res.json(rows); //Retornando a lista de usuários encontrados como resposta
    }
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
});

// 2. Exemplo de Route Params (Parâmetro na URL)
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