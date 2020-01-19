select player.id as 'jugadorId', player.nombre, player.apellido, player.foto, player.bestmove, player.fechainicio, player.posicion,
IFNULL(TW.ganados,0) as 'ganados', IFNULL(TL.perdidos,0) as 'perdidos',IFNULL(TE.empatados,0) as 'empatados',
(IFNULL(TW.ganados,0)+IFNULL(TL.perdidos,0)+IFNULL(TE.empatados,0)) as 'partidosTotales', 
TW.ganados/(IFNULL(TW.ganados,0)+IFNULL(TL.perdidos,0)+IFNULL(TE.empatados,0)) as 'eficiencia',
((IFNULL(TW.ganados,0)+IFNULL(TL.perdidos,0)+IFNULL(TE.empatados,0))/partidostotalestorneo.totalpartidos) as 'asistencia', 

table1.PA, table1.PAC, table1.eficienciaAlltime, table1.asistenciaAlltime, tablemomentum.momentum,tablemomentum.totalpartidos as 'totalpartidosmomentum' 

from player 

left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'ganados' from player join jugadorresultado on player.id = jugadorresultado.jugador_id join partidotorneo on partidotorneo.partido_id = jugadorresultado.partido_id where jugadorresultado.resultado = 1 and partidotorneo.torneo_id = " + torneoId + "  group by player.id, jugadorresultado.resultado) as TW on player.id = TW.id 

left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'perdidos' from player join jugadorresultado on player.id = jugadorresultado.jugador_id join partidotorneo on partidotorneo.partido_id = jugadorresultado.partido_id where jugadorresultado.resultado = 0 and partidotorneo.torneo_id = " + torneoId + "  group by player.id, jugadorresultado.resultado) as TL on player.id = TL.id 

left outer join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'empatados' from player join jugadorresultado on player.id = jugadorresultado.jugador_id join partidotorneo on partidotorneo.partido_id = jugadorresultado.partido_id where jugadorresultado.resultado = 2 and partidotorneo.torneo_id = " + torneoId + "  group by player.id, jugadorresultado.resultado) as TE on player.id = TE.id 


join jugadortorneo on jugadortorneo.jugador_id = player.id 
join torneos on jugadortorneo.torneo_id = torneos.id 
join (select count(*) as 'totalpartidos' from partidotorneo where torneo_id = " + torneoId + ") as partidostotalestorneo 

join (select jugadorresultado.jugador_id, count(jugadorresultado.resultado) as 'totalpartidos',
	SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END) as 'totalganados',
    SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END) as 'totalperdidos',
    SUM(CASE WHEN jugadorresultado.resultado=2 THEN 1 ELSE 0 END) as 'totalempatados',
    SUM(CASE WHEN (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntosfavor',
    SUM(CASE WHEN (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntoscontra',
    (SUM(CASE WHEN (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) - SUM(CASE WHEN (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)) as 'diferencia',
    ((SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END))-(SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)))*2 +((SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END)-SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END))*10) as 'momentum' 
    from player 
    left outer join jugadorresultado on player.id = jugadorresultado.jugador_id 
    join (select * from partidos order by id desc limit 6) as tPartidos on tPartidos.id = jugadorresultado.partido_id group by player.id) 
	as tablemomentum on tablemomentum.jugador_id = player.id 

join (select player.id as 'idplayer',
		((SUM(case when (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'PA',
		((SUM(case when (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'PAC',
		IFNULL(TW.ganadosalltime,0) as 'ganadosalltime',
        IFNULL(TL.perdidosalltime,0) as 'perdidosalltime',
        IFNULL(TE.empatadosAlltime,0) as 'empatadosalltime',
        IFNULL(TW.ganadosalltime,0)/(IFNULL(TW.ganadosalltime,0)+IFNULL(TL.perdidosalltime,0)+IFNULL(TE.empatadosAlltime,0)) as 'eficienciaAlltime',
		((IFNULL(TW.ganadosalltime,0)+IFNULL(TL.perdidosalltime,0)+IFNULL(TE.empatadosAlltime,0))/(partidostotalestodos.total)) as 'asistenciaAllTime' 
	from player 
    join jugadorresultado on player.id = jugadorresultado.jugador_id 
    join partidos on jugadorresultado.partido_id = partidos.id 
    join (select count(id) as 'total' from partidos) as partidostotalestodos
    
    left outer join (select player.id, jugadorresultado.resultado, IFNULL(count(jugadorresultado.resultado),0) as 'ganadosAlltime' from player 
			join jugadorresultado on player.id = jugadorresultado.jugador_id 
            where jugadorresultado.resultado = 1 group by player.id, jugadorresultado.resultado) as TW on player.id = TW.id
    left outer join (select player.id, jugadorresultado.resultado, IFNULL(count(jugadorresultado.resultado),0) as 'perdidosAlltime' from player 
		join jugadorresultado on player.id = jugadorresultado.jugador_id 
        where jugadorresultado.resultado = 0 group by player.id, jugadorresultado.resultado) as TL on player.id = TL.id
	left outer join (select player.id, jugadorresultado.resultado, IFNULL(count(jugadorresultado.resultado),0)  as 'empatadosAlltime' from player 
		join jugadorresultado on player.id = jugadorresultado.jugador_id 
        where jugadorresultado.resultado = 2 group by player.id, jugadorresultado.resultado) as TE on player.id = TE.id
        
    join (select player.id, 
		((SUM(case when (jugadorresultado.resultado = 0 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntosfavorporpartido' 
        from player 
        join jugadorresultado on player.id = jugadorresultado.jugador_id 
        join partidos on jugadorresultado.partido_id = partidos.id 
        group by player.id) as TPF on player.id = TPF.id  
        
    join (select player.id, ((SUM(case when (jugadorresultado.resultado = 1 or jugadorresultado.resultado = 2) then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(			jugadorresultado.resultado))) as 'puntoscontraporpartido' 
			from player 
            join jugadorresultado on player.id = jugadorresultado.jugador_id 
            join partidos on jugadorresultado.partido_id = partidos.id group by player.id) 
            as TPC on player.id = TPC.id 
			group by player.id)
as table1 on player.id = table1.idplayer 

where torneos.id= " + torneoId + " group by player.id order by eficiencia desc;