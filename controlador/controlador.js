var con = require('../dba/conexionbd');

function traerPlayers(req, res) {
    var sql = "select player.id, player.nombre, player.apellido, player.foto, player.bestmove, player.fechainicio, "
            + "SUM(case when jugadorresultado.resultado = 0 then partidos.puntosperdedor else partidos.puntosganador end) as 'puntosfavor', "
            + "SUM(case when jugadorresultado.resultado = 1 then partidos.puntosperdedor else partidos.puntosganador end) as 'puntoscontra', "
            + "(COUNT(jugadorresultado.resultado)+player.pg2018sincontar+player.pp2018sincontar) as 'partidosjugadosTotal', "
            + "((SUM(case when jugadorresultado.resultado = 0 then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntosfavorporpartido', "
            + "((SUM(case when jugadorresultado.resultado = 1 then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntoscontraporpartido', "
            + "(TW.ganadosalltime+player.pg2018sincontar) as 'ganadosalltime', (TL.perdidosalltime+player.pp2018sincontar) as 'perdidosalltime', "
            + "(((TW.ganadosalltime+player.pg2018sincontar)+(TL.perdidosalltime+player.pp2018sincontar))/(partidostotalestodos.total+18)) as 'asistencia',  "
            + "(TW.ganadosalltime+player.pg2018sincontar)/((TW.ganadosalltime+player.pg2018sincontar) +(TL.perdidosalltime+player.pp2018sincontar)) as 'eficiencia', "
            + "tablemomentum.momentum, tablemomentum.totalganadosmomentum as 'ganadosmomentum', tablemomentum.totalperdidosmomentum as 'perdidosmomentum', "
            + "tablemomentum.totalpartidosmomentum as 'totalmomentum', player.altura, player.fechanacimiento, player.lugarnacimiento, player.posicion "
            
            + "from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "join partidos on jugadorresultado.partido_id = partidos.id "
                //Momentum
                + "left outer join (select jugadorresultado.jugador_id, count(jugadorresultado.resultado) as 'totalpartidosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END) as 'totalganadosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END) as 'totalperdidosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntosfavor',"
                + "SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntoscontra',"
                + "(SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) - SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)) as 'diferencia',"
                + "((SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END))-(SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)))*2 "
                + "+((SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END)-SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END))*10) as 'momentum' "
                + "from player "
                + "left outer join jugadorresultado on player.id = jugadorresultado.jugador_id "
                + "join (select * from partidos order by id desc limit 6) as tPartidos on tPartidos.id = jugadorresultado.partido_id "
                + "group by player.id) as tablemomentum on tablemomentum.jugador_id = player.id "

            + "join (select count(id) as 'total' from partidos) as partidostotalestodos "
            + "join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'ganadosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "where jugadorresultado.resultado = 1 group by player.id, jugadorresultado.resultado) as TW on player.id = TW.id "
            + "join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'perdidosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "where jugadorresultado.resultado = 0 group by player.id, jugadorresultado.resultado) as TL on player.id = TL.id "
            + "group by player.id;"
    con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
            //recorro el resultado y obtengo puntos por partido a favor y en contra promedio
            var puntosfavorpartido = [];
            var puntoscontrapartido = [];

                for (let index = 0; index < resultado.length; index++) {
                    if (resultado[index].asistencia > 0.4){
                    puntosfavorpartido.push(resultado[index].puntosfavorporpartido);
                    puntoscontrapartido.push(resultado[index].puntoscontraporpartido);
                    }
                }
                   
                    //Calculo minimos y maximos para Of y Def Power
                    var minPF = Math.min.apply(null, puntosfavorpartido);
                    var maxPF = Math.max.apply(null, puntosfavorpartido);
                    var rangePF = maxPF - minPF
                    
                    var minPC = Math.min.apply(null, puntoscontrapartido);
                    var maxPC = Math.max.apply(null, puntoscontrapartido);
                    var rangePC = maxPC - minPC

                    //aplico a resultado los offpower y defpower + momentum
                for (let index = 0; index < resultado.length; index++) {
                    //Corrijo off y def power
                    if (resultado[index].asistencia < 0.4) {
                        resultado[index].offpower = "No Calculado"
                        resultado[index].defpower = "No Calculado"
                    } else {
                    resultado[index].offpower = ((resultado[index].puntosfavorporpartido-minPF)/rangePF)*10
                    resultado[index].defpower = -((resultado[index].puntoscontraporpartido-maxPC)/rangePC)*10
                    }
                    //Corrijo momentum
                    if (resultado[index].totalmomentum<4) {
                        resultado[index].momentum = "-";
                    }
                }

        let response = {
            'player': resultado
        };

        res.send(JSON.stringify(response));
    });
}


function infoTablaPosiciones(req, res) {
    var torneoId = req.params.id;
    var sql = "SELECT jugador.id, jugador.nombre, jugador.apellido, jugador.alias, jugador.foto, jugador.fechainicio, tablatorneo.ganados, tablatorneo.perdidos, tablatorneo.empatados, tablatorneo.totales, (tablatorneo.ganados * 3 + tablatorneo.empatados) as 'puntos', ((tablatorneo.ganados * 3 + tablatorneo.empatados)/tablatorneo.totales) as 'puntosporpartido', tablatorneo.golesjugador as 'golesjugadortorneo', (tablatorneo.golesjugador/tablatorneo.totales) as 'golesjugadorporpartido', (tablatorneo.ganados/tablatorneo.totales) as 'eficienciaganados', (tablatorneo.totales/totalpartidostorneo.totalpartidos) as 'asistenciatorneo', tablaalltime.asistenciaalltime as 'asistenciaalltime', tablaalltime.PA as 'PA', tablaalltime.PAC as 'PAC' from jugador join jugadortorneo on jugador.id = jugadortorneo.jugador_id left outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id where partidotorneo.torneo_id = "+ torneoId +" group by jugadorresultado.jugador_id) as tablatorneo on tablatorneo.jugador_id = jugador.id right outer join (SELECT jugadorresultado.jugador_id, SUM(jugadorresultado.golesjugador) as golesjugador, SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados, SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos, SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados, SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo, SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo, SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales, ((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA', ((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/ (SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC', ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/ (totalpartidosalltime.totalpartidos)) as 'asistenciaalltime' from jugadorresultado join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id join partidos on jugadorresultado.partido_id = partidos.id join torneos on partidotorneo.torneo_id = torneos.id left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id where torneos.tipotorneo = (select tipotorneo from torneos where id = "+torneoId+")) as totalpartidosalltime on 1=1 where torneos.tipotorneo = (select tipotorneo from torneos where id = "+torneoId+") group by jugadorresultado.jugador_id) as tablaalltime on tablaalltime.jugador_id = jugador.id left outer join (SELECT count(*) as totalpartidos from partidotorneo where torneo_id = "+ torneoId +") as totalpartidostorneo on 1=1 where jugadortorneo.torneo_id = "+ torneoId +" order by puntos desc, ganados desc, perdidos asc, puntosporpartido desc;"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        
        res.send(JSON.stringify(resultado));
    });
}


module.exports = {
    infoTablaPosiciones:infoTablaPosiciones
};