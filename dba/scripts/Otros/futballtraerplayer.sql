select player.id, player.nombre, player.apellido,player.alias, player.foto, player.fechainicio,
SUM(case when (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end) as 'puntosfavor', 
SUM(case when (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end) as 'puntoscontra',
COUNT(jugadorresultado.resultado) as 'partidosjugadosTotal', 
((SUM(case when (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntosfavorporpartido', 
((SUM(case when (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntoscontraporpartido', 
(TW.ganadosalltime) as 'ganadosalltime', 
(TL.perdidosalltime) as 'perdidosalltime', 
IFNULL((TE.empatadosAlltime), 0) as 'empatadosalltime', 
SUM(jugadorresultado.golesjugador) as 'golesindividuales',
(((TW.ganadosalltime)+(TL.perdidosalltime)+IFNULL((TE.empatadosAlltime), 0))/(partidostotalestodos.total)) as 'asistencia',  
(TW.ganadosalltime)/((TW.ganadosalltime) +(TL.perdidosalltime)+IFNULL((TE.empatadosAlltime), 0)) as 'eficiencia',
 tablemomentum.momentum, 
 tablemomentum.totalganadosmomentum as 'ganadosmomentum', 
 tablemomentum.totalperdidosmomentum as 'perdidosmomentum', 
 tablemomentum.totalpartidosmomentum as 'totalmomentum', 
 player.altura, player.fechanacimiento, 
 player.lugarnacimiento, 
 player.posicion 
 
 from player 
 join jugadorresultado on player.id = jugadorresultado.jugador_id 
 join partidos on jugadorresultado.partido_id = partidos.id 
 left outer join 
	(select jugadorresultado.jugador_id, count(jugadorresultado.resultado) as 'totalpartidosmomentum',SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END) as 		'totalganadosmomentum',SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END) as 'totalperdidosmomentum',SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntosfavor',SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntoscontra',(SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) - SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)) as 'diferencia',((SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END))-(SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)))*2 +((SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END)-SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END))*10) as 'momentum' from player left outer join jugadorresultado on player.id = jugadorresultado.jugador_id join (select * from partidos order by id desc limit 6) as tPartidos on tPartidos.id = jugadorresultado.partido_id group by player.id) as tablemomentum on tablemomentum.jugador_id = player.id 
    join (select count(id) as 'total' from partidos) as partidostotalestodos 
    left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'ganadosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id where jugadorresultado.resultado = 1 group by player.id, jugadorresultado.resultado) as TW on player.id = TW.id 
    left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'perdidosAlltime' 
			from player join jugadorresultado on player.id = jugadorresultado.jugador_id 
				where jugadorresultado.resultado = 0 group by player.id, jugadorresultado.resultado) as TL on player.id = TL.id
    left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'empatadosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id where jugadorresultado.resultado = 2 group by player.id, jugadorresultado.resultado) as TE on player.id = TE.id 
    group by player.id;