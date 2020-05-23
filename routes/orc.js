var express = require('express');
var router = express.Router();
var database = require('../database/index');

/* GET users listing. */

router.get('/', async function (req, res, next) {
  let sql = `select * from orc o inner join cliente c on o.id_cliente = c.id_cliente`;
  database.executeQuery(sql).then(r => {
    let dados = []
    r.forEach(el => {
      let dado = {
        cliente: {
          idCliente: el.id_cliente,
          nome: el.nome,
          email: el.email,
          telefone: el.telefone
        },
        dataOrcamento: el.data_de_orcamento,
        dataValidade: el.data_de_validade,
        cataoCredito: Boolean(el.cartao_credito[0]),
        cartaoDebito: Boolean(el.cartao_debito[0]),
        dinheiro: Boolean(el.dinheiro[0]),
        idOrcamento: el.id_orcamento
      };
      dados.push(dado);
    })

    console.log(dados);
    return res.status(200).json(dados);
  });

});
router.get('/:id', async function (req, res, next) {
  try {

    let sql = `select * from orc o inner join cliente c on o.id_cliente where o.id_orcamento = ${req.params.id} `;
    database.executeQuery(sql).then(r => {
      if (r.length > 0) {
        let dados = {
          cliente: {
            idCliente: r[0].id_cliente,
            nome: r[0].nome,
            email: r[0].email,
            telefone: r[0].telefone
          },
          dataOrcamento: r[0].data_de_orcamento,
          dataValidade: r[0].data_de_validade,
          cataoCredito: Boolean(r[0].cartao_credito[0]),
          cartaoDebito: Boolean(r[0].cartao_debito[0]),
          dinheiro: Boolean(r[0].dinheiro[0]),
          idOrcamento: r[0].id_orcamento
        };


        let sql = `select * from itens_orcamento where id_orcamento = ${req.params.id} `

        database.executeQuery(sql).then(rr => {
          dados["servicos"] = [];
          rr.forEach(el => {
            dados["servicos"].push({
              idItensOrcamento: el.id_itens_orcamento,
              servico: el.servico,
              quant: el.quantidade,
              valor: el.valor
            });
          });

          console.log(dados);
          return res.status(200).json(dados);


        });


      } else {
        return res.status(404).json({
          error: {
            message: "Orçamenrto não encontrado"
          }
        });
      }



    });

  } catch (error) {
    return res.status(500).json({
      error: {
        message: "Ocorreu um erro inesperado no sistema!",
        trace: error.stack
      }
    });
  }

});

router.post('/', async function (req, res, next) {
  try {

    let { data_de_validade, data_de_orcamento, servicos, cliente, pagamentos } = req.body;

    if (data_de_orcamento == undefined) {
      return res.status(404).json({
        error: {
          message: "Data de Orçamento não foi informada!"
        }
      })
    }

    if (data_de_validade == undefined) {
      return res.status(404).json({
        error: {
          message: "Data de Validade não foi informada!"
        }
      })
    }

    if (cliente == undefined) {
      return res.status(404).json({
        error: {
          message: "Cliente não foi informado!"
        }
      })
    }

    if (servicos == undefined || servicos.length == 0) {
      return res.status(404).json({
        error: {
          message: "Serviços não foram informados!"
        }
      })
    }

    if (pagamentos.cartao_credito == undefined && pagamentos.cartao_debito == undefined && pagamentos.dinheiro == undefined) {
      return res.status(404).json({
        error: {
          message: "Forma de Pagamento não foram informados!"
        }
      })
    }
    if (pagamentos.cartao_credito == false && pagamentos.cartao_debito == false && pagamentos.dinheiro == false) {
      return res.status(404).json({
        error: {
          message: "Deve informar ao menos uma Forma de Pagamento!"
        }
      })
    }



    let sql = `INSERT INTO cliente(nome,telefone,email) VALUES('${cliente.nome}','${cliente.telefone}','${cliente.email}');`;

    database.executeQuery(sql).
      catch(err => {
        throw err;
      }).then(r => {
        cliente.id = r.insertId;
        let sql = `insert into orc(data_de_validade,data_de_orcamento, id_cliente,cartao_credito,cartao_debito,dinheiro) values('${data_de_validade}','${data_de_orcamento}',${cliente.id},${(pagamentos.credito == true) ? 1 : 0},${(pagamentos.debito == true) ? 1 : 0},${(pagamentos.dinheiro == true) ? 1 : 0});`;
        database.executeQuery(sql).then(rr => {
          console.log(rr);
          servicos.forEach(element => {
            let sql = `insert into itens_orcamento(servico,quantidade, valor,id_orcamento) values('${element.servico}',${element.quant},${element.valor},${rr.insertId});`;
            database.executeQuery(sql).catch(err => {
              throw err;
            });

            return res.status(200).json({
              sucesso: true,
              id: rr.insertId
            });
          });

        }).catch(err => {
          throw err;
        });



      });
  } catch (error) {
    //next(error);
    return res.status(500).json({
      error: {
        message: "Ocorreu um erro inesperado no sistema!",
        trace: error.stack
      }
    });

  }

});
// 
module.exports = router;
