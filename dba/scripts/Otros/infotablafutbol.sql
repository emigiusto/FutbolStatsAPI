SET @torneoid = 3;
SELECT 
    jugador.id,
    jugador.nombre,
    jugador.apellido,
    jugador.alias,
    jugador.foto,
    jugador.fechainicio,
    tablatorneo.ganados,
    tablatorneo.perdidos,
    tablatorneo.empatados,
    tablatorneo.totales,
    (tablatorneo.ganados * 3 + tablatorneo.empatados) as 'puntos',
    ((tablatorneo.ganados * 3 + tablatorneo.empatados)/tablatorneo.totales) as 'puntosporpartido',
    tablatorneo.golesjugador as 'golesjugadortorneo',
    (tablatorneo.golesjugador/tablatorneo.totales) as 'golesjugadorporpartido',
    (tablatorneo.ganados/tablatorneo.totales) as 'eficienciaganados',
    (tablatorneo.totales/totalpartidostorneo.totalpartidos) as 'asistenciatorneo',
    tablaalltime.asistenciaalltime as 'asistenciaalltime',
    tablaalltime.PA as 'PA',
    tablaalltime.PAC as 'PAC'
    
from jugador
join jugadortorneo on jugador.id = jugadortorneo.jugador_id
left outer join 
	(SELECT jugadorresultado.jugador_id, 
			SUM(jugadorresultado.golesjugador) as golesjugador,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
			SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
			SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
			SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
			SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales
				from jugadorresultado
				join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
				join partidos on jugadorresultado.partido_id = partidos.id
				where partidotorneo.torneo_id = @torneoid
				group by jugadorresultado.jugador_id) as tablatorneo on tablatorneo.jugador_id = jugador.id
                
right outer join 
	(SELECT jugadorresultado.jugador_id, 
			SUM(jugadorresultado.golesjugador) as golesjugador,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
			SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
			SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
			SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
			SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales,
			((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))))/
				(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA',
			((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/
				(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC',
			((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/
				(totalpartidosalltime.totalpartidos)) as 'asistenciaalltime'
				from jugadorresultado
				join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
				join partidos on jugadorresultado.partido_id = partidos.id
				join torneos on partidotorneo.torneo_id = torneos.id 
                left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id  
						where torneos.tipotorneo = (select tipotorneo from torneos where id = @torneoid)) as totalpartidosalltime on 1=1
				where torneos.tipotorneo = (select tipotorneo from torneos where id = @torneoid) 
				group by jugadorresultado.jugador_id) as tablaalltime on tablaalltime.jugador_id = jugador.id
                
left outer join
	(SELECT count(*) as totalpartidos 
    from partidotorneo where torneo_id = @torneoid) as totalpartidostorneo on 1=1
where jugadortorneo.torneo_id = @torneoid
order by puntos desc, ganados desc, perdidos asc, puntosporpartido desc





