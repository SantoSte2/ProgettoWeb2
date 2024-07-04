-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Lug 04, 2024 alle 18:52
-- Versione del server: 10.4.25-MariaDB
-- Versione PHP: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `biblio`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `libro`
--

CREATE TABLE `libro` (
  `idLibro` int(10) UNSIGNED NOT NULL,
  `Titolo` varchar(40) NOT NULL,
  `Sottotitolo` varchar(50) DEFAULT NULL,
  `Autore` varchar(30) NOT NULL,
  `numPagine` int(10) UNSIGNED NOT NULL,
  `numCopie` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `trama` text NOT NULL,
  `immagine` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `libro`
--

INSERT INTO `libro` (`idLibro`, `Titolo`, `Sottotitolo`, `Autore`, `numPagine`, `numCopie`, `trama`, `immagine`) VALUES
(1, 'Il Signore degli Anelli', NULL, 'J.R.R. Tolkien', 1364, 4, 'Al centro della vicenda c\'è l\'anello del potere che casualmente si trova nelle mani di un hobbit: Bilbo Baggins. L\'anello ha una caratteristica: se viene messo al dito rende invisibili rendendo il portatore in grado di percepire il mondo degli spiriti. Se utilizzato dal suo creatore (Sauron) o da un esperto di magia però, gli conferisce un potere senza limiti.', 'https://th.bing.com/th/id/R.25f5957f21b9e2c630f2bdf398f07707?rik=Kb1YHCjAdjGS8A&riu=http%3a%2f%2ffiles-castle.com.website.yandexcloud.net%2fbooks%2f25f5957f21b9e2c630f2bdf398f07707.jpg&ehk=%2frTuym%2bgH09hvbq6GHcO1%2b1FgT6%2fZePFozOgUVyOVIo%3d&risl=&pid=ImgRaw&r=0'),
(2, 'Farenheit 451', NULL, 'Ray Bradbury', 180, 2, 'Fahrenheit 451 è il libro più noto di Ray Bradbury. Si tratta di un libro di fantascienza distopica, ambientato in un mondo irreale in cui la lettura è proibita. In questa società ricreata da Bradbury tenere libri in casa è considerato un segno di sovversione: per questo esistono dei pompieri addetti non allo spegnimento, ma all’accensione di incendi presso le case dei “non allineati”.', 'https://img.ibs.it/images/9788804487715_0_0_1833_75.jpg'),
(3, 'Novencento', 'Un monologo', 'Alessandro Baricco', 64, 1, 'Novecento è un monologo teatrale di Alessandro Baricco, pubblicato nel 1994 da Feltrinelli. Il narratore è un trombettista che viene assunto sulla nave Virginian, dove incontra il protagonista: Danny Boodman T.D. Lemon Novecento, un pianista. Fra i due nasce un’amicizia sincera e profonda. Ventisette anni prima Novecento era stato abbandonato appena nato sul piano della prima classe del piroscafo Virginian, dove era stato trovato da un marinaio di colore, che l’aveva cresciuto come un figlio. Dopo la sua morte, Novecento aveva iniziato a suonare il piano, e non aveva più smesso.', 'https://th.bing.com/th/id/OIP.WIqHPjhUIUGUKsCFQf2bqgHaLZ?rs=1&pid=ImgDetMain'),
(4, 'Guida galattica per gli autostoppisti', NULL, 'Douglas Adams', 208, 42, 'Il protagonista del romanzo è Arthur Dent, che all’improvviso scopre che sono arrivate delle ruspe nel suo giardino per demolirlo e far posto all’autostrada.\r\nIn realtà dopo poco gli abitanti della terra scopriranno che essa dovrà essere demolita da una flotta di astronavi capitanata da Jeltz dell’Ente Galattico Viabilità Iperspazio. Arthur per fortuna riesce a mettersi in salvo grazie a Ford Perfect, un suo vecchio amico che si rivela essere un alieno e che riesce a portarlo via da quello scenario di distruzione facendolo salire su un’astronave demolitrice. Egli comincia così un viaggio alla scoperta di nuovi mondi avendo come guida soltanto un piccolo libro, proprio la guida galattica per autostoppisti.', 'https://img.ibs.it/images/9788804666851_0_0_1537_75.jpg');

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazione`
--

CREATE TABLE `prenotazione` (
  `idUtente` int(11) NOT NULL,
  `idLibro` int(11) NOT NULL,
  `durata` int(10) UNSIGNED NOT NULL DEFAULT 30,
  `inizioPren` date NOT NULL,
  `finePren` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `prenotazione`
--

INSERT INTO `prenotazione` (`idUtente`, `idLibro`, `durata`, `inizioPren`, `finePren`) VALUES
(1, 2, 30, '2024-05-04', '2024-06-04'),
(1, 4, 30, '2024-05-18', '2024-06-18'),
(2, 3, 30, '2024-05-17', '2024-06-17'),
(3, 1, 30, '2024-05-10', '2024-06-10');

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `idUtente` int(10) UNSIGNED NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL,
  `isLibr` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`idUtente`, `username`, `password`, `isLibr`) VALUES
(1, 'andreapertegato', 'admin1', 1),
(2, 'stefanosantoni', 'admin2', 1),
(3, 'normaluser', 'user1', 0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`idLibro`),
  ADD UNIQUE KEY `idLibro` (`idLibro`),
  ADD UNIQUE KEY `idLibro_2` (`idLibro`);

--
-- Indici per le tabelle `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD PRIMARY KEY (`idUtente`,`idLibro`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`idUtente`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `libro`
--
ALTER TABLE `libro`
  MODIFY `idLibro` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `idUtente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
