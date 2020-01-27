set @p1 = 4;
set @p2 = 18;
SELECT 
    jugadorresultado.resultado,
    jugadorresultado.jugador_id,
    jugadorresultado.partido_id,
    jugador.nombre,
    jugador.apellido,
    jugador.foto,
    partidos.golesganador,
    partidos.golesperdedor,
    partidos.fecha
FROM
    jugadorresultado
        JOIN
    jugador ON jugadorresultado.jugador_id = jugador.id
        JOIN
    partidos ON jugadorresultado.partido_id = partidos.id
WHERE
    (jugador_id = @p1 OR jugador_id = 54)
        AND jugadorresultado.partido_id IN (SELECT 
            jugadorresultado.partido_id
        FROM
            jugadorresultado
		JOIN partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
        JOIN torneos on partidotorneo.torneo_id = torneos.id
        WHERE
            jugador_id = @p1 OR jugador_id = 54
			AND torneos.tipotorneo = 'Geofobal'
        GROUP BY jugadorresultado.partido_id
        HAVING COUNT(jugadorresultado.partido_id) = 2)
ORDER BY jugadorresultado.partido_id DESC , jugador_id