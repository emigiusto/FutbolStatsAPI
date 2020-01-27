var con = require('../dba/conexionbd');

function traerPlayers(req, res) {
    var sql = "SELECT jugadorresultado.jugador_id, jugador.nombre, jugador.apellido, jugador.alias, jugador.foto, jugador.fechainicio, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales, ((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador)))+((SUM(jugadorresultado.golesjugador)*(tablaoffpowerfactor.valor))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA', ((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC', ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/ (totalpartidosalltime.totalpartidos)) as 'asistenciaalltime' from jugadorresultado join jugador on jugadorresultado.jugador_id = jugador.id join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id join torneos on partidotorneo.torneo_id = torneos.id right outer join (SELECT valor from tablafactores where nombre = 'offpowerfactor') as tablaoffpowerfactor on 1 = 1 left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id where torneos.tipotorneo = 'Geofobal') as totalpartidosalltime on 1=1 where torneos.tipotorneo = 'Geofobal' group by jugadorresultado.jugador_id order by asistenciaalltime desc"

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
    var sql = "SELECT jugador.id, jugador.nombre, jugador.apellido, jugador.alias, jugador.foto, jugador.fechainicio, tablatorneo.ganados, tablatorneo.perdidos, tablatorneo.empatados, tablatorneo.totales, (tablatorneo.ganados * 3 + tablatorneo.empatados) as 'puntos', ((tablatorneo.ganados * 3 + tablatorneo.empatados)/tablatorneo.totales) as 'puntosporpartido', tablatorneo.golesjugador as 'golesjugadortorneo', (tablatorneo.golesjugador/tablatorneo.totales) as 'golesjugadorporpartido', (tablatorneo.ganados/tablatorneo.totales) as 'eficienciaganados', (tablatorneo.totales/totalpartidostorneo.totalpartidos) as 'asistenciatorneo', tablaalltime.asistenciaalltime as 'asistenciaalltime', tablaalltime.PA as 'PA', tablaalltime.PAC as 'PAC' from jugador join jugadortorneo on jugador.id = jugadortorneo.jugador_id left outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id where partidotorneo.torneo_id = "+ torneoId +" group by jugadorresultado.jugador_id) as tablatorneo on tablatorneo.jugador_id = jugador.id right outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales, ((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador)))+((SUM(jugadorresultado.golesjugador)*(tablaoffpowerfactor.valor))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA', ((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC', ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/ (totalpartidosalltime.totalpartidos)) as 'asistenciaalltime' from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id join torneos on partidotorneo.torneo_id = torneos.id right outer join (SELECT valor from tablafactores where nombre = 'offpowerfactor') as tablaoffpowerfactor on 1 = 1 left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id where torneos.tipotorneo = (select tipotorneo from torneos where id = "+ torneoId +")) as totalpartidosalltime on 1=1 where torneos.tipotorneo = (select tipotorneo from torneos where id = "+ torneoId +") group by jugadorresultado.jugador_id) as tablaalltime on tablaalltime.jugador_id = jugador.id left outer join (SELECT count(*) as totalpartidos from partidotorneo where torneo_id = "+ torneoId +") as totalpartidostorneo on 1=1 where jugadortorneo.torneo_id = "+ torneoId +" order by puntos desc, ganados desc, perdidos asc, puntosporpartido desc"
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
    var sql = "SELECT jugadorresultado.resultado, jugadorresultado.jugador_id, jugadorresultado.partido_id, jugador.nombre, jugador.apellido, jugador.foto, partidos.golesganador, partidos.golesperdedor, partidos.fecha FROM jugadorresultado JOIN jugador ON jugadorresultado.jugador_id = jugador.id JOIN partidos ON jugadorresultado.partido_id = partidos.id WHERE (jugador_id = "+p1id+" OR jugador_id = "+p1id+") AND jugadorresultado.partido_id IN (SELECT jugadorresultado.partido_id FROM jugadorresultado JOIN partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id JOIN torneos on partidotorneo.torneo_id = torneos.id WHERE jugador_id = "+p1id+" OR jugador_id = "+p2id+" AND torneos.tipotorneo = 'Geofobal' GROUP BY jugadorresultado.partido_id HAVING COUNT(jugadorresultado.partido_id) = 2) ORDER BY jugadorresultado.partido_id DESC , jugador_id"
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


module.exports = {
    infoTablaPosiciones:infoTablaPosiciones,
    traerPlayers:traerPlayers,
    traerMatchup: traerMatchup
};