select *
from partidos
join jugadorresultado on partidos.id = jugadorresultado.partido_id
join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
JOIN torneos on partidotorneo.torneo_id = torneos.id
WHERE jugadorresultado.jugador_id = 54 AND torneos.tipotorneo = 'Geofobal'
order by jugadorresultado.partido_id desc