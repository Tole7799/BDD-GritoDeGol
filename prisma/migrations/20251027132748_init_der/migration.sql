/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Pais` (
    `id_pais` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_pais`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Liga` (
    `id_liga` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pais` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_liga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Temporada` (
    `id_temporada` INTEGER NOT NULL AUTO_INCREMENT,
    `id_liga` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,

    PRIMARY KEY (`id_temporada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fecha` (
    `id_fecha` INTEGER NOT NULL AUTO_INCREMENT,
    `id_temporada` INTEGER NOT NULL,
    `numero_fecha` INTEGER NOT NULL,

    PRIMARY KEY (`id_fecha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipo` (
    `id_equipo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_liga` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jugador` (
    `id_jugador` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `posicion` VARCHAR(30) NOT NULL,
    `fecha_nac` DATE NOT NULL,
    `dorsal` INTEGER NOT NULL,

    PRIMARY KEY (`id_jugador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partido` (
    `id_partido` INTEGER NOT NULL AUTO_INCREMENT,
    `id_fecha` INTEGER NOT NULL,
    `id_local` INTEGER NOT NULL,
    `id_visitante` INTEGER NOT NULL,
    `goles_local` INTEGER NOT NULL,
    `goles_visitante` INTEGER NOT NULL,
    `estadio` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id_partido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partido_Equipo` (
    `id_partido` INTEGER NOT NULL,
    `id_equipo` INTEGER NOT NULL,
    `es_local` BOOLEAN NOT NULL,
    `posesion` DECIMAL(5, 2) NULL,
    `tiros` INTEGER NULL,
    `tiros_arco` INTEGER NULL,
    `amarillas` INTEGER NULL,
    `rojas` INTEGER NULL,

    PRIMARY KEY (`id_partido`, `id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantel` (
    `id_equipo` INTEGER NOT NULL,
    `id_jugador` INTEGER NOT NULL,
    `id_temporada` INTEGER NOT NULL,
    `fecha_alta` DATE NULL,
    `fecha_baja` DATE NULL,

    PRIMARY KEY (`id_equipo`, `id_jugador`, `id_temporada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `rol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Liga` ADD CONSTRAINT `Liga_id_pais_fkey` FOREIGN KEY (`id_pais`) REFERENCES `Pais`(`id_pais`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Temporada` ADD CONSTRAINT `Temporada_id_liga_fkey` FOREIGN KEY (`id_liga`) REFERENCES `Liga`(`id_liga`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fecha` ADD CONSTRAINT `Fecha_id_temporada_fkey` FOREIGN KEY (`id_temporada`) REFERENCES `Temporada`(`id_temporada`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipo` ADD CONSTRAINT `Equipo_id_liga_fkey` FOREIGN KEY (`id_liga`) REFERENCES `Liga`(`id_liga`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partido` ADD CONSTRAINT `Partido_id_fecha_fkey` FOREIGN KEY (`id_fecha`) REFERENCES `Fecha`(`id_fecha`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partido` ADD CONSTRAINT `Partido_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `Equipo`(`id_equipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partido` ADD CONSTRAINT `Partido_id_visitante_fkey` FOREIGN KEY (`id_visitante`) REFERENCES `Equipo`(`id_equipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partido_Equipo` ADD CONSTRAINT `Partido_Equipo_id_partido_fkey` FOREIGN KEY (`id_partido`) REFERENCES `Partido`(`id_partido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partido_Equipo` ADD CONSTRAINT `Partido_Equipo_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `Equipo`(`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantel` ADD CONSTRAINT `Plantel_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `Equipo`(`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantel` ADD CONSTRAINT `Plantel_id_jugador_fkey` FOREIGN KEY (`id_jugador`) REFERENCES `Jugador`(`id_jugador`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantel` ADD CONSTRAINT `Plantel_id_temporada_fkey` FOREIGN KEY (`id_temporada`) REFERENCES `Temporada`(`id_temporada`) ON DELETE CASCADE ON UPDATE CASCADE;
