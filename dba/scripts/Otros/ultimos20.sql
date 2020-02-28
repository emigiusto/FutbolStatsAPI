select jugador.id as 'jugadorId', jugador.nombre,jugador.apellido, 
(select IF(jugadorresultado.resultado=1, 'G', IF(jugadorresultado.resultado=0, 'P', 'E'))) as 'resultado', 
jugadorresultado.partido_id as 'partidoId', 
partidos.fecha, (select IF(jugadorresultado.resultado=1, partidos.golesganador, partidos.golesperdedor)) as 'golesConvertidos', 
(select IF(jugadorresultado.resultado=1, partidos.golesperdedor, partidos.golesganador)) as 'golesRecibidos', 
jugadorresultado.golesjugador as 'golesindividuales' 

from jugadorresultado 

join jugador on jugadorresultado.jugador_id = jugador.id 
join partidos on jugadorresultado.partido_id = partidos.id 
join partidotorneo on partidos.id = partidotorneo.partido_id join torneos on partidotorneo.torneo_id = torneos.id
where jugador.id =54 and torneos.tipotorneo = 'Geofobal'
order by jugadorresultado.partido_id desc limit 20;