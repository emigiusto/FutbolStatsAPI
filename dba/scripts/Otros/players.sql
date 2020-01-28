SELECT 		jugadorresultado.jugador_id,
			jugador.nombre,
            jugador.apellido,
			jugador.alias,
			jugador.foto,
			jugador.fechainicio,
			SUM(jugadorresultado.golesjugador) as golesjugador,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
			SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
			SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
			SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
			SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales,
			((SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador)))+((SUM(jugadorresultado.golesjugador)*(tablaoffpowerfactor.valor))))/
				(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PA',
			((SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))))/
				(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) as 'PAC',
			((SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/
				(totalpartidosalltime.totalpartidos)) as asistenciaalltime,
			((SUM(if(jugadorresultado.resultado = 1, 1, 0)))/(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))) AS eficienciaalltime,
            ((SUM(if(jugadorresultado.resultado = 1, 1, 0)) * 3 ) + SUM(if(jugadorresultado.resultado = 2, 1, 0)))/(SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0))) as puntosporpartido
				from jugadorresultado
                join jugador on jugadorresultado.jugador_id = jugador.id
				join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
				join partidos on jugadorresultado.partido_id = partidos.id
				join torneos on partidotorneo.torneo_id = torneos.id 
                right outer join (SELECT valor from tablafactores where nombre = 'offpowerfactor') as tablaoffpowerfactor on 1 = 1
                left outer join (SELECT count(*) as totalpartidos from partidotorneo join torneos on partidotorneo.torneo_id = torneos.id  
						where torneos.tipotorneo = 'Geofobal') as totalpartidosalltime on 1=1
				where torneos.tipotorneo = 'Geofobal'
				group by jugadorresultado.jugador_id
                order by asistenciaalltime desc