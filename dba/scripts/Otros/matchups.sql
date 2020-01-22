SELECT 
    jugadorresultado.resultado,
    jugadorresultado.jugador_id,
    jugadorresultado.partido_id,
    jugador.nombre,
    jugador.apellido,
    jugador.foto,
    partidos.golesganador,
    partidos.golesperdedor
FROM
    jugadorresultado
        JOIN
    jugador ON jugadorresultado.jugador_id = jugador.id
        JOIN
    partidos ON jugadorresultado.partido_id = partidos.id
WHERE
    (jugador_id = 5 OR jugador_id = 6)
        AND jugadorresultado.partido_id IN (SELECT 
            partido_id
        FROM
            jugadorresultado
        WHERE
            jugador_id = 5 OR jugador_id = 6
        GROUP BY partido_id
        HAVING COUNT(partido_id) = 2)
ORDER BY partido_id DESC , jugador_id