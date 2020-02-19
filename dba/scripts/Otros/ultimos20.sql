select jugador.id as 'jugadorId',
jugador.nombre,jugador.apellido, 
(select IF(jugadorresultado.resultado=1, 'W', IF(jugadorresultado.resultado=0, 'L', 'E'))) as 'resultado',
jugadorresultado.partido_id as 'partidoId', 
partidos.fecha, 
(select IF(jugadorresultado.resultado=1, partidos.golesganador, partidos.golesperdedor)) as 'golesConvertidos',
(select IF(jugadorresultado.resultado=1, partidos.golesperdedor, partidos.golesganador)) as 'golesRecibidos',
jugadorresultado.golesjugador as 'golesindividuales'
from jugadorresultado 
join jugador on jugadorresultado.jugador_id = jugador.id 
join partidos on jugadorresultado.partido_id = partidos.id 

where jugador.id =54 

order by jugadorresultado.partido_id desc limit 20;
