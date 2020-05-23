var express = require('express');
var router = express.Router();
var database = require('../database/index');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let dados = database.executeQuery("select * from itens_orcamento");
    console.log(dados);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }

});

router.post('/', async function (req, res, next) {
  try {

    let { servico, quantidade, valor, } = req.body;

    let sql = 'insert into itens_orcamento(servico,quantidade,valor) values(?,?,?)';


    let params = [servico, quantidade, valor];

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
