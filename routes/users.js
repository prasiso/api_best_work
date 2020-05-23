var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var database = require('../database/index');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let dados = database.executeQuery("select * from usuario");
    console.log(dados);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }

});

router.post('/', async function (req, res, next) {
  try {

    let { nome, senha, email } = req.body;

    let sql = 'insert into usuario(nome,email,senha) values(?,?,?)';

    let senhaEncript = await bcrypt.hash(senha, 10);

    let params = [nome, email, senhaEncript];

    let dados = database.executeQuery(sql, params);
    console.log(dados);
    return res.status(200).json({
      sucesso: true
    });

  } catch (error) {
    next(error);
  }

});
// 
module.exports = router;
