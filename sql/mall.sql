-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: mall
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--
DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `discount` float NOT NULL DEFAULT '0.8',
  `starttime` datetime NOT NULL,
  `deadline` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1019707492 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1014861084,'双11购物节',9,'2023-11-11 12:00:00','2023-11-12 12:00:00',0),(1015240176,'双12购物节',7,'2023-12-01 12:00:00','2023-12-12 12:00:00',0),(1019707491,'618年中大促',7,'2023-06-01 12:00:00','2023-06-18 12:00:00',1);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` bigint NOT NULL,
  `account` varchar(20) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `level` int NOT NULL DEFAULT '5',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '在职状态',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `license_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '注册许可码',
  `selfcode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_un` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (948030,'admin','$2a$10$JRPNs5P1P4M7CQx8H9NGPuusjzplVixNxhGo3awtGd8m6w6mpQg2O',10,1,'2023-03-15 14:43:33',NULL,'3Q79NJ'),(1020682068,'zhangsan','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i',5,0,'2023-04-03 21:03:52','3Q79NJ','WR9AJZ'),(1022232698,'yyy','$2a$10$xFKdenO5OVnPXdMgW0aFWuZynSIHp9iUNkZDh3ULxk2B10AAz3ts.',5,1,'2023-04-04 15:46:49','3Q79NJ','ZN8MAO'),(1023014409,'uuu','$2a$10$D9/X8uktIsD700JOhsyzPe8sSci4g9FTqKaWKqF9Io1wltJO1nKl6',5,0,'2023-04-04 15:58:57','3Q79NJ','DE62NF'),(1024485180,'test03','$2a$10$6cz8aLfYJMqpyO1tuZkvj.Z9wYDyaO8S85sp.MEnlkdVux8twNecC',5,1,'2023-05-11 18:48:13','3Q79NJ','FGPEOV'),(1024541928,'rrr','$2a$10$gVcdQVplZfBNDN1Sqn6EceZzoqS83.R3vmjvk0Bpogp1f3CKGoy2u',5,1,'2023-04-04 15:57:53','3Q79NJ','K6U42W'),(1025632740,'hhh','$2a$10$xFKdenO5OVnPXdMgW0aFWuZynSIHp9iUNkZDh3ULxk2B10AAz3ts.',5,1,'2023-04-04 15:45:17','3Q79NJ','B634LR'),(1026241379,'www','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i',5,1,'2023-04-04 15:44:52','3Q79NJ','3F7CHD'),(1026759796,'lisi','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i',5,1,'2023-04-03 23:05:43','3Q79NJ','801D8F'),(1026819262,'eee','$2a$10$gVcdQVplZfBNDN1Sqn6EceZzoqS83.R3vmjvk0Bpogp1f3CKGoy2u',5,1,'2023-04-04 15:58:41','3Q79NJ','B8LWJG'),(1026978018,'xiataoran','$2a$10$R5u3dVxnmwIAJN8GnU2I/e8TsQzA/LJAXK/9U4xf8Qi18RwPNh76e',5,1,'2023-05-12 23:29:34','3Q79NJ','UUBV1A'),(1029559660,'lll','$2a$10$Rx4L0OXOvq.YlTkK77ZUde7fG6vVSsjtEAHpes6rSCIMjToAffjA2',5,1,'2023-04-04 15:55:53','3Q79NJ','1GWXUP'),(1029751755,'aaa','$2a$10$fvskACJ/Wlju86tLJHZOhezZxyDK1sntu3MZlCc1Ayhfus/ERAp2m',5,1,'2023-05-12 23:25:29','3Q79NJ','71BE7C');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attribute`
--

DROP TABLE IF EXISTS `attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `specification_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attribute_un` (`name`),
  KEY `attribute_FK` (`specification_id`),
  CONSTRAINT `attribute_FK` FOREIGN KEY (`specification_id`) REFERENCES `specification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='规格属性表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute`
--

LOCK TABLES `attribute` WRITE;
/*!40000 ALTER TABLE `attribute` DISABLE KEYS */;
INSERT INTO `attribute` VALUES (1,'黑色',432326),(3,'5G',895426),(8,'白色',432326),(9,'蓝色',432326),(12,'黄色',432326),(16,'8+128GB',1158424613),(17,'12+128GB',1158424613),(18,'12+256GB',1158424613),(19,'12+512GB',1158424613),(20,'16+256GB',1158424613),(21,'16+512GB',1158424613),(25,'S码',1156941273),(26,'M码',1156941273),(27,'L码',1156941273),(28,'XL码',1156941273),(29,'XXL码',1156941273),(30,'XXXL码',1156941273),(31,'i9-13900HX',1158304314),(32,'i7-13700HX',1158304314),(33,'i5-13500HX',1158304314),(34,'骁龙8gen2',1153864197),(35,'天玑9200',1153864197),(36,'A15',1153864197),(37,'3050',1154690318),(38,'3050ti',1154690318),(39,'3060',1154690318),(40,'3060ti',1154690318),(41,'3070',1154690318),(42,'3080',1154690318),(43,'3080ti',1154690318),(44,'3090',1154690318),(45,'3090ti',1154690318),(46,'4050',1154690318),(47,'4050ti',1154690318),(48,'4060',1154690318),(49,'4070',1154690318),(50,'4080',1154690318),(51,'4090',1154690318),(53,'38码',1151360969),(54,'39码',1151360969),(55,'40码',1151360969),(58,'紫色',432326);
/*!40000 ALTER TABLE `attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1049843213 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品类别表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'手机'),(2,'电脑'),(1040430702,'耳机'),(1040942303,'鞋子'),(1041690376,'衣服'),(1043300949,'穿戴'),(1045339526,'平板');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_activity`
--

DROP TABLE IF EXISTS `category_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_activity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `activity_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_activity_FK` (`category_id`),
  KEY `category_activity_FK_1` (`activity_id`),
  CONSTRAINT `category_activity_FK` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `category_activity_FK_1` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='类别-活动关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_activity`
--

LOCK TABLES `category_activity` WRITE;
/*!40000 ALTER TABLE `category_activity` DISABLE KEYS */;
INSERT INTO `category_activity` VALUES (20,1,1014861084),(21,2,1014861084),(22,1040430702,1014861084),(23,1041690376,1014861084),(24,1040942303,1014861084),(25,1043300949,1014861084),(27,1,1015240176),(28,2,1015240176),(29,1041690376,1015240176),(30,1040942303,1015240176),(31,1040430702,1015240176),(32,1043300949,1015240176),(33,1,1019707491),(34,2,1019707491),(35,1040430702,1019707491);
/*!40000 ALTER TABLE `category_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_coupon`
--

DROP TABLE IF EXISTS `category_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_coupon` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `coupon_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_coupon_FK` (`category_id`),
  KEY `category_coupon_FK_1` (`coupon_id`),
  CONSTRAINT `category_coupon_FK` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `category_coupon_FK_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='类别-优惠券关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_coupon`
--

LOCK TABLES `category_coupon` WRITE;
/*!40000 ALTER TABLE `category_coupon` DISABLE KEYS */;
INSERT INTO `category_coupon` VALUES (45,1040430702,1089673242),(46,1040942303,1089673242),(47,1041690376,1089673242);
/*!40000 ALTER TABLE `category_coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_specification`
--

DROP TABLE IF EXISTS `category_specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_specification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `specification_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_specification_FK` (`category_id`),
  KEY `category_specification_FK_1` (`specification_id`),
  CONSTRAINT `category_specification_FK` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `category_specification_FK_1` FOREIGN KEY (`specification_id`) REFERENCES `specification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='类别-规格关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_specification`
--

LOCK TABLES `category_specification` WRITE;
/*!40000 ALTER TABLE `category_specification` DISABLE KEYS */;
INSERT INTO `category_specification` VALUES (83,1041690376,432326),(84,1041690376,1156941273),(85,1040942303,432326),(88,1043300949,432326),(89,1040430702,432326),(125,2,432326),(126,2,1158304314),(127,2,1154690318),(128,2,1158424613),(129,1,432326),(130,1,895426),(131,1,1153864197);
/*!40000 ALTER TABLE `category_specification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `id` bigint NOT NULL,
  `description` varchar(100) NOT NULL,
  `min` double NOT NULL DEFAULT '100',
  `max` double NOT NULL DEFAULT '9999999999',
  `starttime` datetime NOT NULL,
  `deadline` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `stock` int NOT NULL DEFAULT '100',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='优惠券';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1089673242,'满100减10',200,500,'2023-05-25 12:00:00','2023-06-20 12:00:00',1,4348);
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` bigint NOT NULL,
  `name` varchar(10) NOT NULL,
  `gender` varchar(1) NOT NULL DEFAULT '男',
  `age` int NOT NULL DEFAULT '18',
  `job` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='员工表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'陈庞桂','男',24,'网站管理者','广东省-汕头市-潮阳区',1,'2023-03-12 22:20:16'),(1093349833,'小刚','男',31,'客服','河北省-唐山市-路北区',1,'2023-05-12 22:39:11'),(1094677211,'小明','男',20,'技术开发','北京市-市辖区-东城区',1,'2023-05-12 21:15:51'),(1095025598,'小红','女',26,'销售','山西省-长治市-上党区',1,'2023-05-12 22:40:13');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` bigint NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `freemail` tinyint(1) NOT NULL DEFAULT '0',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `commodity_FK` (`category_id`),
  CONSTRAINT `commodity_FK` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1090214177,'联想电脑',2,'2023-05-13 08:14:09',0,'联想拯救者y70001111',0),(1090593262,'iPhone14pro',1,'2023-05-12 16:44:41',0,'iphone14pro红红火火恍恍惚惚',1),(1092572721,'三星S23',1,'2023-05-08 22:47:04',1,'三星 SAMSUNG Galaxy S23 超视觉夜拍 可持续性设计 超亮全视护眼屏',0);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_version`
--

DROP TABLE IF EXISTS `goods_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_version` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `goods_id` bigint NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `price` decimal(18,2) NOT NULL COMMENT '原价',
  `current_price` decimal(18,2) NOT NULL COMMENT '现价',
  `name` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commodity_attribute_FK` (`goods_id`),
  CONSTRAINT `goods_specification_FK` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品版本表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_version`
--

LOCK TABLES `goods_version` WRITE;
/*!40000 ALTER TABLE `goods_version` DISABLE KEYS */;
INSERT INTO `goods_version` VALUES (49,1092572721,34434,5999.00,5599.00,'白色,5G,骁龙8gen2'),(53,1090593262,345453,7999.00,6999.00,'黑色,5G,A15,8+128GB'),(54,1090214177,54654,7999.00,6777.00,'黑色,i7-13700HX,3050,12+512GB');
/*!40000 ALTER TABLE `goods_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `url` varchar(100) NOT NULL,
  `admin_id` bigint DEFAULT NULL,
  `goods_version_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image_FK_1` (`admin_id`),
  KEY `image_FK` (`goods_version_id`),
  CONSTRAINT `image_FK` FOREIGN KEY (`goods_version_id`) REFERENCES `goods_version` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `image_FK_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='图片表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (28,'0b230bbd5996ff128674822b00bb8a90.jpg',948030,NULL),(74,'89162261f22a9c461f2f2f67dca5e838.jpg',NULL,49),(79,'41078866f86203590f0967f2e4515aab.jpg',NULL,53),(80,'22b07a5e107289c5ed12363a8001840f.jpg',NULL,54);
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL,
  `num` int NOT NULL DEFAULT '1',
  `goods_version_id` bigint NOT NULL,
  `username` varchar(100) NOT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '0：已退货；1：已完成；2：发货中；3：已取消',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cause` varchar(100) DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `address` varchar(100) NOT NULL COMMENT '省市区',
  `_address` varchar(100) DEFAULT NULL COMMENT '详细地址',
  PRIMARY KEY (`id`),
  KEY `order_FK` (`goods_version_id`),
  KEY `orders_FK_1` (`category_id`),
  CONSTRAINT `orders_FK` FOREIGN KEY (`goods_version_id`) REFERENCES `goods_version` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_FK_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1134998008,1,49,'test01','1','2023-05-12 20:21:13','',1,'广东省/广州市/番禺区','九龙镇九龙大道广州商学院'),(1137168627,3,54,'test02','2','2023-05-13 08:15:29','',2,'广东省/广州市/黄埔区','九龙镇九龙大道广州商学院');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register`
--

DROP TABLE IF EXISTS `register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `license_code` varchar(10) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='注册申请表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register`
--

LOCK TABLES `register` WRITE;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` VALUES (1,'zhangsan','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i','3Q79NJ','2023-04-02 17:38:20',1),(2,'lisi','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i','3Q79NJ','2023-04-02 17:39:08',1),(4,'www','$2a$10$q8jhf4NUpxqObyUpk0pmPeV8z1CQDAlyb.q4sD4pNrLg2ibiGtO1i','3Q79NJ','2023-04-02 17:43:51',1),(5,'hhh','$2a$10$xFKdenO5OVnPXdMgW0aFWuZynSIHp9iUNkZDh3ULxk2B10AAz3ts.','3Q79NJ','2023-04-02 17:45:23',1),(6,'yyy','$2a$10$xFKdenO5OVnPXdMgW0aFWuZynSIHp9iUNkZDh3ULxk2B10AAz3ts.','3Q79NJ','2023-04-02 17:47:19',1),(7,'lll','$2a$10$Rx4L0OXOvq.YlTkK77ZUde7fG6vVSsjtEAHpes6rSCIMjToAffjA2','3Q79NJ','2023-04-02 18:05:49',1),(8,'rrr','$2a$10$gVcdQVplZfBNDN1Sqn6EceZzoqS83.R3vmjvk0Bpogp1f3CKGoy2u','3Q79NJ','2023-04-02 18:07:04',1),(9,'eee','$2a$10$gVcdQVplZfBNDN1Sqn6EceZzoqS83.R3vmjvk0Bpogp1f3CKGoy2u','3Q79NJ','2023-04-02 18:08:18',1),(10,'uuu','$2a$10$D9/X8uktIsD700JOhsyzPe8sSci4g9FTqKaWKqF9Io1wltJO1nKl6','3Q79NJ','2023-04-02 22:21:13',1),(11,'ppp','$2a$10$Jfu45G2B50u06o8mxAr5L.u9EehfPjCO9OHD1qMVlxnB6r9uuVbg2','3Q79NJ','2023-04-02 22:22:36',0),(12,'ggg','$2a$10$Jfu45G2B50u06o8mxAr5L.u9EehfPjCO9OHD1qMVlxnB6r9uuVbg2','3Q79NJ','2023-04-02 22:25:26',0),(13,'ddd','$2a$10$Jfu45G2B50u06o8mxAr5L.u9EehfPjCO9OHD1qMVlxnB6r9uuVbg2','3Q79NJ','2023-04-02 22:29:33',0),(14,'bbb','$2a$10$sFMUTKCuNM0DIiXAdZNtg.CHPfsA7mBpLissI6YtiHje96R5THLCW','3Q79NJ','2023-04-02 22:43:53',0),(15,'mmm','$2a$10$D9bUc13tYHXF4xy9N0g5suoDv1Jt6V/G9ezI9V8R22qm1o5ZtoWhK','3Q79NJ','2023-04-04 16:24:43',0),(16,'test01','$2a$10$HnOZ/knKKcFSFG5g5.HDcehpaq8BS1aPCymqnJZgTyW9BC0N6JBbK','3Q79NJ','2023-04-20 22:49:19',0),(17,'test02','$2a$10$6cz8aLfYJMqpyO1tuZkvj.Z9wYDyaO8S85sp.MEnlkdVux8twNecC','3Q79NJ','2023-04-20 22:50:24',0),(18,'test03','$2a$10$6cz8aLfYJMqpyO1tuZkvj.Z9wYDyaO8S85sp.MEnlkdVux8twNecC','3Q79NJ','2023-04-20 22:55:52',1),(19,'iii','$2a$10$Lbth5j6n6Tr6Fx.53jKymeegBGSklk3ZBdHBUDuXYEc4jhTfJ9Qj2','3Q79NJ','2023-05-11 18:46:51',0),(20,'aaa','$2a$10$fvskACJ/Wlju86tLJHZOhezZxyDK1sntu3MZlCc1Ayhfus/ERAp2m','3Q79NJ','2023-05-11 23:19:01',1),(21,'xiataoran','$2a$10$R5u3dVxnmwIAJN8GnU2I/e8TsQzA/LJAXK/9U4xf8Qi18RwPNh76e','3Q79NJ','2023-05-12 23:28:17',1),(22,'admin01','$2a$10$1wXAIxqYcK.IOZnlY.B02eaVCpViXFfcpgi0ZuGNSIHAPSiNeePw.','3Q79NJ','2023-05-13 08:55:18',2);
/*!40000 ALTER TABLE `register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specification`
--

DROP TABLE IF EXISTS `specification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specification` (
  `id` bigint NOT NULL,
  `name` varchar(50) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='规格表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specification`
--

LOCK TABLES `specification` WRITE;
/*!40000 ALTER TABLE `specification` DISABLE KEYS */;
INSERT INTO `specification` VALUES (432326,'颜色','2023-03-15 14:56:34'),(895426,'网络通信','2023-03-15 18:19:50'),(1151360969,'鞋码','2023-05-09 21:35:54'),(1153864197,'SOC','2023-04-13 23:05:58'),(1154690318,'显卡','2023-04-13 23:26:38'),(1156941273,'尺码','2023-04-13 22:48:01'),(1158304314,'CPU','2023-04-13 23:03:10'),(1158424613,'存储','2023-04-12 22:07:33'),(1158692972,'分辨率','2023-05-13 08:58:03');
/*!40000 ALTER TABLE `specification` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `modify_specification` AFTER DELETE ON `specification` FOR EACH ROW begin 

	delete from `attribute` where specification_id=old.id;

end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping routines for database 'mall'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-30 12:11:06
