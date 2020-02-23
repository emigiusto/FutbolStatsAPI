var con = require('../dba/conexionbd');

function traerPlayers(req, res) {
    var sql = "SELECT jugadorresultado.jugador_id, jugador.nombre,jugador.altura,jugador.mejorjugada, jugador.frase, jugador.fechanacimiento,jugador.lugarnacimiento,jugador.apellido, jugador.alias, jugador.foto, jugador.fechainicio,jugador.posicion, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales,  ((SUM(jugadorresultado.golesjugador))/(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as golesjugadorporpartido,((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador)))+((SUM(jugadorresultado.golesjugador)*(tablaoffpowerfactor.valor))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA', ((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC', ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/ (totalpartidosalltime.totalpartidos)) as asistenciaalltime, ((SUM(if(jugadorresultado.resultado = 1, 1, 0)))/(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) AS eficienciaalltime, ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) * 3 ) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0))) as puntosporpartido from jugadorresultado join jugador on jugadorresultado.jugador_id = jugador.id join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id join torneos on partidotorneo.torneo_id = torneos.id right outer join (SELECT valor from tablafactores where nombre = 'offpowerfactor') as tablaoffpowerfactor on 1 = 1 left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id where torneos.tipotorneo = 'Geofobal') as totalpartidosalltime on 1=1 where torneos.tipotorneo = 'Geofobal' group by jugadorresultado.jugador_id order by alias asc"

    con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        res.send(JSON.stringify(resultado));
    });
}


function infoTablaPosiciones(req, res) {
    var torneoId = req.params.id;
    var sql = "SELECT jugador.id, jugador.nombre, jugador.apellido, jugador.alias,jugador.mejorjugada, jugador.frase,jugador.foto, jugador.fechainicio, tablatorneo.ganados, tablatorneo.perdidos, tablatorneo.empatados, tablatorneo.totales, (tablatorneo.ganados * 3 + tablatorneo.empatados) as 'puntos', ((tablatorneo.ganados * 3 + tablatorneo.empatados)/tablatorneo.totales) as 'puntosporpartido', tablatorneo.golesjugador as 'golesjugadortorneo', (tablatorneo.golesjugador/tablatorneo.totales) as 'golesjugadorporpartido', (tablatorneo.ganados/tablatorneo.totales) as 'eficienciaganados', (tablatorneo.totales/totalpartidostorneo.totalpartidos) as 'asistenciatorneo', tablaalltime.asistenciaalltime as 'asistenciaalltime', tablaalltime.PA as 'PA', tablaalltime.PAC as 'PAC' from jugador join jugadortorneo on jugador.id = jugadortorneo.jugador_id left outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id where partidotorneo.torneo_id = "+ torneoId +" group by jugadorresultado.jugador_id) as tablatorneo on tablatorneo.jugador_id = jugador.id right outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales, ((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador)))+((SUM(jugadorresultado.golesjugador)*(tablaoffpowerfactor.valor))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA', ((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC', ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/ (totalpartidosalltime.totalpartidos)) as 'asistenciaalltime' from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id join torneos on partidotorneo.torneo_id = torneos.id right outer join (SELECT valor from tablafactores where nombre = 'offpowerfactor') as tablaoffpowerfactor on 1 = 1 left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id where torneos.tipotorneo = (select tipotorneo from torneos where id = "+ torneoId +")) as totalpartidosalltime on 1=1 where torneos.tipotorneo = (select tipotorneo from torneos where id = "+ torneoId +") group by jugadorresultado.jugador_id) as tablaalltime on tablaalltime.jugador_id = jugador.id left outer join (SELECT count(*) as totalpartidos from partidotorneo where torneo_id = "+ torneoId +") as totalpartidostorneo on 1=1 where jugadortorneo.torneo_id = "+ torneoId +" order by puntosporpartido desc, puntos desc, ganados desc,golesjugadorporpartido desc"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        res.send(JSON.stringify(resultado));
    });
}

function traerMatchup(req, res) {
    var p1id = req.query.p1;
    var p2id = req.query.p2; 
    var sql = "SELECT jugadorresultado.resultado, jugadorresultado.jugador_id, jugadorresultado.partido_id, jugador.nombre, jugador.apellido, jugador.foto, partidos.golesganador, partidos.golesperdedor, partidos.fecha FROM jugadorresultado JOIN jugador ON jugadorresultado.jugador_id = jugador.id JOIN partidos ON jugadorresultado.partido_id = partidos.id WHERE (jugador_id = "+p1id+" OR jugador_id = "+p2id+") AND jugadorresultado.partido_id IN (SELECT jugadorresultado.partido_id FROM jugadorresultado JOIN partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id JOIN torneos on partidotorneo.torneo_id = torneos.id WHERE jugador_id = "+p1id+" OR jugador_id = "+p2id+" AND torneos.tipotorneo = 'Geofobal' GROUP BY jugadorresultado.partido_id HAVING COUNT(jugadorresultado.partido_id) = 2) ORDER BY jugadorresultado.partido_id DESC , jugador_id"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'matchup': resultado
        };

        res.send(JSON.stringify(response));
    });
}

function traerRachaPlayer(req, res) {
    var jugadorId = req.params.jugadorId;
    var sql =  "select partidos.fecha, jugadorresultado.resultado from partidos join jugadorresultado on partidos.id = jugadorresultado.partido_id join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id JOIN torneos on partidotorneo.torneo_id = torneos.id WHERE jugadorresultado.jugador_id = " + jugadorId + " AND torneos.tipotorneo = 'Geofobal' order by jugadorresultado.partido_id desc"
    console.log(jugadorId)
    
    con.query(sql, function(error, results, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        if (results.length>0){
            var rachaPlayer = getRachaFromList(results)
        } else {
            var rachaPlayer = 0
        }
        let response = {
            'racha': rachaPlayer,
            'jugadorId': jugadorId,
        };

        res.send(JSON.stringify(response));
    });
}

//ULTIMOS 20 PARTIDOS DE UN JUGADOR - PAGINA JUGADOR
function ultimos20Jugador(req, res) {
    var jugador = req.params.jugadorId;

    var sql = "select jugador.id as 'jugadorId', jugador.nombre,jugador.apellido, (select IF(jugadorresultado.resultado=1, 'G', IF(jugadorresultado.resultado=0, 'P', 'E'))) as 'resultado', jugadorresultado.partido_id as 'partidoId', partidos.fecha, (select IF(jugadorresultado.resultado=1, partidos.golesganador, partidos.golesperdedor)) as 'golesConvertidos', (select IF(jugadorresultado.resultado=1, partidos.golesperdedor, partidos.golesganador)) as 'golesRecibidos', jugadorresultado.golesjugador as 'golesindividuales' from jugadorresultado join jugador on jugadorresultado.jugador_id = jugador.id join partidos on jugadorresultado.partido_id = partidos.id where jugador.id ="+ jugador +" order by jugadorresultado.partido_id desc limit 20;"
    con.query(sql, function(error, results, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        let response = {
            'ultimos20': results,
        };

        res.send(JSON.stringify(response));
    });
    
}

//TRAE LA LISTA DE TODOS LOS TORNEOS DE TIPO X
function traerTorneos(req, res) {
    var tipotorneo = req.params.tipoTorneo;
    var sql = "select * from torneos where tipotorneo =" + tipotorneo
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'torneos': resultado
        };

        res.send(JSON.stringify(response));
    });
}



module.exports = {
    infoTablaPosiciones:infoTablaPosiciones,
    traerPlayers:traerPlayers,
    traerMatchup: traerMatchup,
    traerRachaPlayer:traerRachaPlayer,
    ultimos20Jugador: ultimos20Jugador,
    traerTorneos: traerTorneos
};



// INTERNAS

    //RACHA X
    function getRachaFromList(lista) {
        //CASO EXCEPCION: JUGÓ UN SOLO PARTIDO
        if(lista.length == 1){
            if(lista[0].resultado == 0){
                return 0;
            }
            if(lista[0].resultado == 1){
                return 0;
            } else { //Es empate (2)
                return 0
            }
        }   
        //ARRANCÓ GANANDO
        if (lista[0].resultado === 1) {
            var counterRacha = 0;
            for (let a = 0; a < lista.length; a++) {
                if (lista[a].resultado === 1) {
                    counterRacha = counterRacha + 1;
                } else {
                    if (counterRacha==1){
                        return 0
                    } else {
                        return counterRacha;
                    }
                }
            }
        }
        //ARRANCÓ PERDIENDO
        if (lista[0].resultado === 0) {
            var counterRacha = 0;
            for (let a = 0; a < lista.length; a++) {
                if (lista[a].resultado === 0) {
                    counterRacha = counterRacha - 1;
                } else {
                    if (counterRacha==-1){
                        return 0
                    } else {
                        return counterRacha;
                    }
                }
            }
        }
        //ARRANCÓ EMPATANDO
        if (lista[0].resultado == 2) {
            return 0
        }

    }