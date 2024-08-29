-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ago 29, 2024 alle 18:11
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
-- Struttura della tabella `coda`
--

CREATE TABLE `coda` (
  `idUtente` int(11) NOT NULL,
  `idLibro` int(11) NOT NULL,
  `dataInserimento` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `coda`
--

INSERT INTO `coda` (`idUtente`, `idLibro`, `dataInserimento`) VALUES
(5, 9, '2024-08-27 15:04:46');

-- --------------------------------------------------------

--
-- Struttura della tabella `libro`
--

CREATE TABLE `libro` (
  `idLibro` int(10) UNSIGNED NOT NULL,
  `Titolo` varchar(40) NOT NULL,
  `Sottotitolo` varchar(50) DEFAULT NULL,
  `Autore` varchar(30) NOT NULL,
  `numCopie` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `trama` text NOT NULL,
  `immagine` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `libro`
--

INSERT INTO `libro` (`idLibro`, `Titolo`, `Sottotitolo`, `Autore`, `numCopie`, `trama`, `immagine`) VALUES
(1, 'Il Signore degli Anelli', NULL, 'J.R.R. Tolkien', 2, 'Al centro della vicenda c\'è l\'anello del potere che casualmente si trova nelle mani di un hobbit: Bilbo Baggins. L\'anello ha una caratteristica: se viene messo al dito rende invisibili rendendo il portatore in grado di percepire il mondo degli spiriti. Se utilizzato dal suo creatore (Sauron) o da un esperto di magia però, gli conferisce un potere senza limiti.', 'https://th.bing.com/th/id/R.25f5957f21b9e2c630f2bdf398f07707?rik=Kb1YHCjAdjGS8A&riu=http%3a%2f%2ffiles-castle.com.website.yandexcloud.net%2fbooks%2f25f5957f21b9e2c630f2bdf398f07707.jpg&ehk=%2frTuym%2bgH09hvbq6GHcO1%2b1FgT6%2fZePFozOgUVyOVIo%3d&risl=&pid=ImgRaw&r=0'),
(2, 'Farenheit 451', NULL, 'Ray Bradbury', 3, 'Il romanzo è ambientato in un futuro distopico dove i libri sono vietati e i “pompieri” hanno il compito di bruciarli. Guy Montag, il protagonista, è uno di questi pompieri. Vive una vita monotona e conformista fino a quando incontra Clarisse McClellan, una giovane donna che lo fa riflettere sulla sua esistenza e sulla società in cui vive. Clarisse è curiosa, ama la natura e le conversazioni profonde, caratteristiche che contrastano fortemente con la società superficiale e repressiva in cui vive Montag.', 'https://img.ibs.it/images/9788804487715_0_0_1833_75.jpg'),
(4, 'Guida galattica per gli autostoppisti', NULL, 'Douglas Adams', 41, 'Il protagonista del romanzo è Arthur Dent, che all’improvviso scopre che sono arrivate delle ruspe nel suo giardino per demolirlo e far posto all’autostrada.\r\nIn realtà dopo poco gli abitanti della terra scopriranno che essa dovrà essere demolita da una flotta di astronavi capitanata da Jeltz dell’Ente Galattico Viabilità Iperspazio. Arthur per fortuna riesce a mettersi in salvo grazie a Ford Perfect, un suo vecchio amico che si rivela essere un alieno e che riesce a portarlo via da quello scenario di distruzione facendolo salire su un’astronave demolitrice. Egli comincia così un viaggio alla scoperta di nuovi mondi avendo come guida soltanto un piccolo libro, proprio la guida galattica per autostoppisti.', 'https://img.ibs.it/images/9788804666851_0_0_1537_75.jpg'),
(6, 'Orgoglio e Pregiudizio', NULL, 'Jane Austen', 2, 'La storia segue la famiglia Bennet, concentrandosi su Elizabeth Bennet e il suo rapporto con Mr. Darcy. Esplora temi come l’orgoglio di classe e i pregiudizi personali, con l’ambientazione nella campagna inglese del tardo Settecento.', 'https://img.ibs.it/images/9788809763173_0_0_1446_75.jpg'),
(7, 'Lo Hobbit', NULL, 'J. R. R. Tolkien', 4, 'Bilbo Baggins si unisce a una compagnia di nani guidata da Thorin Scudodiquercia e al mago Gandalf per recuperare il loro regno e tesoro rubati dal drago Smaug. Lungo il percorso, affrontano pericoli, creature magiche e scoprono il coraggio e la lealtà nascosti dentro di loro. Inizialmente, Bilbo rifiuta l’offerta di Gandalf di partire in questa avventura, ma poi decide di unirsi ai nani per recuperare un tesoro nascosto all’interno della Montagna Solitaria, protetto da Smaug. L’avventura si rivela più impegnativa e difficile di quanto avessero immaginato, con incontri con Trolls e altri pericoli lungo il tragitto.', 'https://img.libraccio.it/images/9788845927553_0_500_0_75.jpg'),
(9, 'Così Parlò Zarathustra', NULL, 'Friedrich Nietzche', 0, 'Pubblicata tra il 1883 e il 1885, questa opera è scritta come un poema epico e narra la storia di Zarathustra, un filosofo errante che lascia la sua montagna per condividere con il mondo la sua visione del superuomo e del trascendentalismo.\nZarathustra rappresenta l’ideale del superuomo e incoraggia gli individui a liberarsi dalle catene della conformità sociale, perseguendo la loro unica volontà di potenza. Il testo esplora anche il concetto dell’eterno ritorno, sostenendo che l’universo è destinato a ripetere ciclicamente ogni evento infinitamente.', 'https://www.ibs.it/images/9788832147445_0_536_0_75.jpg');

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazione`
--

CREATE TABLE `prenotazione` (
  `idUtente` int(11) NOT NULL,
  `idLibro` int(11) NOT NULL,
  `inizioPren` date NOT NULL,
  `finePren` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `prenotazione`
--

INSERT INTO `prenotazione` (`idUtente`, `idLibro`, `inizioPren`, `finePren`) VALUES
(1, 2, '2024-05-04', '2024-06-04'),
(1, 4, '2024-08-25', '2024-09-24'),
(1, 9, '2024-08-27', '2024-09-26'),
(2, 6, '2024-08-25', '2024-09-24'),
(3, 1, '2024-08-26', '2024-09-25');

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `idUtente` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(15) NOT NULL,
  `isLibr` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`idUtente`, `username`, `password`, `isLibr`) VALUES
(1, 'andreapertegato@gmail.com', 'admin1', 1),
(2, 'stefanosantoni@hotmail.com', 'admin2', 1),
(3, 'normaluser@libero.it', 'user1', 0),
(5, 'normalissimouser@libero.it', 'user2', 0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `coda`
--
ALTER TABLE `coda`
  ADD PRIMARY KEY (`idUtente`,`idLibro`);

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
  MODIFY `idLibro` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `idUtente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
