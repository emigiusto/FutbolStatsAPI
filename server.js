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
app.get('/',function (req, res) {
  res.send('Welcome to Geofobal Stats');
});
/*
app.get('/matchup',controller.traerMatchup);
app.get('/torneos',controller.traerTorneos);
app.get('/torneosPorId',controller.traerTorneoPorId);
app.get('/partidosPorId',controller.traerPartidosPorId);
app.get('/jugadorPuntos',controller.traerPuntosJugador);
app.get('/ganadosPerdidos',controller.traerGanadosPerdidos);

app.get('/playerporId',controller.traerPlayerporId);
app.get('/rachaPlayer',controller.traerRachaPlayer);
app.get('/duos',controller.traerduo);
app.get('/ultimos20',controller.ultimos20Jugador);
app.get('/resultadostorneoplayer',controller.resultadostorneosplayer);
app.get('/mejorypeorracha',controller.mejorypeorracha);
app.get('/awardsporplayer',controller.awardsporplayer);
app.get('/awardsporanio',controller.awardsporanio);*/

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = process.env.PORT || 8081;


app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

