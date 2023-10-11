const express = require("express");
const mysql = require("mysql")
var cors = require('cors')

const PORT = process.env.PORT || 3001;

const app = express();

app.options('*', cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "Hello from server!"
  });
});

app.post('/sortear', async (req, res) => {
  const members = req.body.members;
  const n = members.length;
  var sorteados = Array.from(Array(n).keys());
  var disponiveis = Array.from(Array(n).keys());
  var query = 'INSERT INTO participantes (Id, Nome, Email, Sorteado) VALUES ';

  for (let i = 0; i < n; i++) {
    var ldisp = disponiveis.length - 1;

    if (disponiveis.includes(i)) {
      ldisp--;
    }
    
    if (ldisp < 0) {
      disponiveis = [sorteados[0]];
      sorteados[0] = i;
      ldisp++;
    }

    const idx = Math.round(Math.random() * ldisp);
    const sorteado = disponiveis.filter(disp => disp != i)[idx];
    sorteados[i] = sorteado;
    disponiveis = disponiveis.filter(disp => disp != sorteado);
  }

  for (let i = 0; i < n; i++) {
    const member = members[i];

    if (i > 0) {
      query += ',';
    }

    query += '(' + (i + 1) + ', \'' + member.Nome + '\', \'' + member.Email + '\', ' + (sorteados[i] + 1) + ')';
  }

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'Santo14@5',
    database: 'amigosecreto'
  });

  connection.connect();
  await connection.query('DELETE FROM participantes');
  await connection.query(query);
  connection.end()

  res.status(201);
  res.json({
    message: "Finalizado"
  })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});