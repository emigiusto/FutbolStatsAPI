use `heroku_de86678f01af14e`;

DROP TABLE IF EXISTS `jugador`;
CREATE TABLE `jugador` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL,
  `apellido` varchar(70) NOT NULL,
  `alias` varchar(200),
  `foto` varchar(200),
  `mejorjugada` varchar(200),
  `fechainicio` DATE,
	`frase` varchar(200),
	`posicion` varchar(200),
  `altura` DECIMAL(3, 2),
  `fechanacimiento` DATE,
  `lugarnacimiento` varchar(200),
    PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `partidos`;
CREATE TABLE `partidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `golesganador` int(20),
  `golesperdedor` int(20),
  `observaciones` varchar(200),
  `jugadoresporequipo` int(20),
    PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `jugadorresultado`;
CREATE TABLE `jugadorresultado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `partido_id` int(11) NOT NULL,
  `resultado` SmallInt NOT NULL,
  `golesjugador` int(11) NOT NULL,
    PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `torneos`;
CREATE TABLE `torneos` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE,
  `estado` varchar(70) NOT NULL,
  `campeon` int(11),
  `tipotorneo` varchar(200),
    PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `partidotorneo`;
CREATE TABLE `partidotorneo` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`torneo_id` int(11) NOT NULL,
  `partido_id` int(11) NOT NULL,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `jugadortorneo`;
CREATE TABLE `jugadortorneo` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`torneo_id` int(11) NOT NULL,
  `jugador_id` int(11) NOT NULL,
    PRIMARY KEY (`id`)
);