//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var controller = require('./controlador/controlador')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


//app.get('/players',controller.traerPlayers);
app.get('/posiciones/:id',controller.infoTablaPosiciones);
app.get('/players',controller.traerPlayers);
app.get('/matchup',controller.traerMatchup);
app.get('/torneos/:tipoTorneo',controller.traerTorneos);
app.get('/racha/:jugadorId',controller.traerRachaPlayer);
app.get('/ultimos20/:jugadorId',controller.ultimos20Jugador);
app.get('/',function (req, res) {
  res.send('Welcome to Geofobal Stats');
});

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = process.env.PORT || 8081;


app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

