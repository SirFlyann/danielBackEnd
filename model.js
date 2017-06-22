var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var core_use = require('cors');
var pg = require('pg');

var port = process.env.PORT || 8080;

app.use(core_use());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var connectionString = 'postgres://xuktzkcpahdhhw:27f2cf8b65bd55646cbab098091e4219bcf610f623b0358ad1a81d5d5fb46565@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d4kkdj9relvk9h';

//CRUD de Diário
app.get('/diarios/all', function (req, res) {
  pg.connect(connectionString, function(err,client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * from diario where status = 1;', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          console.log(result.rows);
          res.json(result.rows);
        });
  });
});

app.get('/diarios/:id', function (req, res) {
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * from diario where codigo = ' + id +';', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
});

app.post('/diarios/new', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('insert into diario values('
          + req.body.id + ',' 
          + req.body.id_usuario + ',' 
          + req.body.id_veiculo + ','
          + req.body.id_atividade  + ','
          + '\'' + req.body.hinicio + '\'' + ','
          + '\'' + req.body.hfim + '\'' + ','
          + '\'' + req.body.obs + '\'' + ','
          + req.body.status + ');', function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.setHeader('Access-Control-Allow-Origin','*');
      res.json('Inserido com sucesso!');
    });
  });
});

app.put('/diarios/update', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('update diario set '
          + 'id_usuario = ' + req.body.id_usuario + ', ' 
          + 'id_veiculo = ' + req.body.id_veiculo + ', '
          + 'id_atividade = ' + req.body.id_atividade  + ', '
          + 'hinicio = ' + '\'' + req.body.hinicio + '\'' + ', '
          + 'hfim = ' + '\'' + req.body.hfim + '\'' + ', '
          + 'obs = ' + '\'' + req.body.obs + '\'' + ', '
          + 'status = ' + req.body.status  +' where id = ' + req.body.id + ';', function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json('Atualizado com sucesso!');
        });
  });
});

app.delete('/diarios/remove/:codigo', function (req, res) {
  var codigo = req.params.codigo
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
    client.query('delete from diario where id = ' + req.body.id + ';', function(err, result) {
            done();
            if(err) {
              return console.error('error running query', err);
            }
            res.setHeader('Access-Control-Allow-Origin','*');
            res.json('Deletado com sucesso!');
          });
    });
});

//Dropdown
app.get('/dropdown', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
        'SELECT * FROM ( SELECT ID, DESCRICAO, ORDEM FROM ATIVIDADES WHERE ORDEM > 0 LIMIT 2) X UNION SELECT ID, DESCRICAO, ORDEM FROM ATIVIDADES WHERE ORDEM IS NULL ORDER BY ORDEM', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
})

// Dados da viagem
app.get('/viagem', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
        'SELECT A.DESCRICAO AS ATIVIDADE, D.HINICIO, D.HFIM, D.OBS FROM DIARIO D INNER JOIN ATIVIDADES A ON (A.ID = D.ID_ATIVIDADE) INNER JOIN VEICULO V ON (V.ID = D.ID_VEICULO) INNER JOIN USUARIO U ON (U.ID = D.ID_USUARIO);', 
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
})
app.listen(port)
