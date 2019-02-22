/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.5.40 : Database - netvis
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`netvis` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `netvis`;


/*Table structure for table `user` */
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `option` varchar(1023) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */
-- insert into `user`(`option`) values ("");

/*Table structure for table `edge` */
DROP TABLE IF EXISTS `edge`;
CREATE TABLE `edge` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `src` int(20) NOT NULL,
  `target` int(20) NOT NULL,
  `option` varchar(1023) DEFAULT '',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`src`) references `user`(`id`),
  FOREIGN KEY (`target`) references `user`(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;


/*Table structure for table `location` */
DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `lat` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `option` varchar(1023) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;




/*Table structure for table `checkin` */
DROP TABLE IF EXISTS `checkin`;
CREATE TABLE `checkin` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `uid` int(20) NOT NULL,
  `time` varchar(20) NOT NULL,
  `lid` int(20) NOT NULL,
  `lat` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `option` varchar(1023) DEFAULT '',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`uid`) references `user`(`id`),
  FOREIGN KEY (`lid`) references `location`(`id`),
  FOREIGN KEY (`lat`) references `location`(`lat`),
  FOREIGN KEY (`lng`) references `location`(`lng`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
