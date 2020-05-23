var express = require('express');
var router = express.Router();
var database = require('../database/index');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let dados = database.executeQuery("select * from cliente");
    console.log(dados);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }

});

router.post('/', async function (req, res, next) {
  try {

    let { nome, telefone, email } = req.body;

    let sql = 'insert into cliente(nome,telefone,email) values(?,?,?)';

    let params = [nome, telefone, email];

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
