-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: boba_shop_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventID` int NOT NULL AUTO_INCREMENT,
  `eventTitle` varchar(100) NOT NULL,
  `eventDescription` varchar(255) DEFAULT NULL,
  `eventDate` date NOT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `organizer` varchar(100) DEFAULT NULL,
  `eventStatus` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`eventID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Boba Happy Hour','Enjoy 20% off all drinks during happy hour!','2026-04-05','14:00:00','17:00:00','TeaZen Boba Shop','TeaZen Team','Scheduled'),(2,'Matcha Tasting Night','Sample premium matcha drinks and learn about matcha origins.','2026-04-10','18:00:00','20:00:00','TeaZen Boba Shop','TeaZen Team','Scheduled'),(3,'Student Discount Day','Students get 15% off with valid ID.','2026-04-15','12:00:00','18:00:00','TeaZen Boba Shop','TeaZen Team','Scheduled'),(4,'Grand Opening Celebration','Celebrate our grand opening with free samples and giveaways!','2026-04-01','10:00:00','16:00:00','TeaZen Boba Shop','TeaZen Team','Completed'),(5,'DIY Boba Workshop','Learn how to make your own boba drinks at home.','2026-04-20','17:00:00','19:00:00','TeaZen Boba Shop','TeaZen Team','Scheduled'),(6,'Summer Specials Launch','Try our new summer drinks and seasonal menu!','2026-05-01','11:00:00','15:00:00','TeaZen Boba Shop','TeaZen Team','Upcoming'),(7,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-02-06','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(8,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-02-13','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(9,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-02-20','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(10,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-02-27','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(11,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-03-06','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(12,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-03-13','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(13,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-03-20','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(14,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-03-27','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(15,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-04-03','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(16,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-04-10','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(17,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-04-17','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(18,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-04-24','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(19,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-05-01','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(20,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-05-08','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(21,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-05-15','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled'),(22,'Acoustic Chill Night','Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.','2026-05-22','20:00:00','22:00:00','TeaZen Boba Shop','Atlas Grey','Scheduled'),(23,'K-Pop Night','Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.','2026-05-29','20:00:00','22:00:00','TeaZen Boba Shop','Jasmine Chen','Scheduled');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `ingredientsID` int NOT NULL AUTO_INCREMENT,
  `ingredientName` varchar(55) NOT NULL,
  `category` varchar(55) DEFAULT NULL,
  `unitOfMeasure` varchar(45) NOT NULL,
  `costPerUnit` decimal(5,2) NOT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `reorderLevel` int DEFAULT NULL,
  PRIMARY KEY (`ingredientsID`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'Black Tea','Tea','ml',0.02,'Tea Supplier Co.',1000),(2,'Jasmine Tea','Tea','ml',0.03,'Tea Supplier Co.',1000),(3,'Matcha Powder','Tea','g',0.10,'Matcha Imports',500),(4,'Milk','Dairy','ml',0.03,'Local Dairy',1000),(5,'Oat Milk','Dairy Alternative','ml',0.04,'Oat Farms',800),(6,'Brown Sugar Syrup','Sweetener','ml',0.05,'Sweet Supply',500),(7,'Sugar Syrup','Sweetener','ml',0.03,'Sweet Supply',500),(8,'Honey','Sweetener','ml',0.06,'Honey Farms',300),(9,'Tapioca Pearls','Topping','g',0.08,'Boba Supplier',1000),(10,'Cheese Foam','Topping','ml',0.07,'Dairy Supplier',300),(11,'Taro Powder','Flavor','g',0.09,'Flavor Co.',500),(12,'Strawberry Puree','Fruit','ml',0.06,'Fruit Supplier',400),(13,'Rice Paper','Snack','pcs',0.20,'Asian Foods Co.',200),(14,'Shrimp','Protein','g',0.15,'Seafood Supplier',300),(15,'Tofu','Protein','g',0.08,'Tofu Supplier',300),(16,'Avocado','Vegetable','pcs',1.00,'Produce Supplier',100),(17,'Edamame','Vegetable','g',0.05,'Produce Supplier',300),(18,'Sesame Seeds','Topping','g',0.02,'Spice Supplier',200);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventoryID` int NOT NULL AUTO_INCREMENT,
  `ingredientsID` int NOT NULL,
  `quantityInStock` decimal(10,2) NOT NULL,
  `lastRestockedDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `inventoryStatus` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`inventoryID`),
  KEY `fk_inventory_ingredient_idx` (`ingredientsID`),
  CONSTRAINT `fk_inventory_ingredient` FOREIGN KEY (`ingredientsID`) REFERENCES `ingredients` (`ingredientsID`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,5000.00,'2026-03-20','2026-04-20','In Stock'),(2,2,4500.00,'2026-03-20','2026-04-20','In Stock'),(3,3,1200.00,'2026-03-18','2026-06-18','In Stock'),(4,4,3000.00,'2026-03-22','2026-03-29','Low Stock'),(5,5,2500.00,'2026-03-22','2026-04-05','In Stock'),(6,6,1800.00,'2026-03-21','2026-05-21','In Stock'),(7,7,2000.00,'2026-03-21','2026-05-21','In Stock'),(8,8,900.00,'2026-03-19','2026-06-19','In Stock'),(9,9,3500.00,'2026-03-20','2026-04-10','In Stock'),(10,10,700.00,'2026-03-22','2026-03-30','Low Stock'),(11,11,1000.00,'2026-03-18','2026-05-18','In Stock'),(12,12,1600.00,'2026-03-21','2026-04-15','In Stock'),(13,13,300.00,'2026-03-17','2026-04-17','In Stock'),(14,14,800.00,'2026-03-22','2026-03-27','Low Stock'),(15,15,1000.00,'2026-03-22','2026-03-29','In Stock'),(16,16,120.00,'2026-03-21','2026-03-28','Low Stock'),(17,17,1400.00,'2026-03-20','2026-04-12','In Stock'),(18,18,600.00,'2026-03-20','2026-06-20','In Stock');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobapplications`
--

DROP TABLE IF EXISTS `jobapplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobapplications` (
  `applicationID` int NOT NULL AUTO_INCREMENT,
  `positionID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `experience` varchar(300) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `desired_start_date` date DEFAULT NULL,
  `availability` enum('full-time','part-time','flexible') DEFAULT NULL,
  PRIMARY KEY (`applicationID`),
  KEY `positionID_idx` (`positionID`),
  CONSTRAINT `positionID` FOREIGN KEY (`positionID`) REFERENCES `jobpositions` (`positionID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobapplications`
--

LOCK TABLES `jobapplications` WRITE;
/*!40000 ALTER TABLE `jobapplications` DISABLE KEYS */;
INSERT INTO `jobapplications` VALUES (1,1,'testing1','testing1@gmail.com','im just testing',NULL,NULL,NULL),(2,1,'testing3','testing3@gmail.com','i am testing',NULL,NULL,NULL),(3,4,'testing 7','testing7@gmail.com','i am testing 7',NULL,NULL,NULL),(4,1,'testing 8','testing8@gmail.com','i am testing 8',NULL,NULL,NULL),(5,2,'testing 9','testing9@gmail.com','i am testing 9',NULL,NULL,NULL),(6,2,'testing101','testing101@gmail.com','i am testing 101',NULL,NULL,NULL),(7,1,'testing 102','testing102@gmail.com','idk',NULL,NULL,NULL),(8,1,'testing 103','testing103@gmail.com','i am testing 103',NULL,NULL,NULL),(9,1,'testing 104','testing104@gmail.com','i am testing 104.','123456789','2026-04-23','full-time'),(10,2,'testing105','testing105@gmail.com','i am testing 105!','1234567890','2026-04-22','part-time');
/*!40000 ALTER TABLE `jobapplications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobpositions`
--

DROP TABLE IF EXISTS `jobpositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobpositions` (
  `positionID` int NOT NULL AUTO_INCREMENT,
  `positionTitle` varchar(99) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`positionID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobpositions`
--

LOCK TABLES `jobpositions` WRITE;
/*!40000 ALTER TABLE `jobpositions` DISABLE KEYS */;
INSERT INTO `jobpositions` VALUES (1,'Barista','Prepare and serve boba drinks, maintain cleanliness, and provide excellent customer service.','Open'),(2,'Cashier','Handle customer orders, process payments, and assist with front-of-house operations.','Open'),(3,'Shift Lead','Supervise staff, manage shifts, handle customer issues, and ensure smooth store operations.','Open'),(4,'Kitchen Assistant','Assist in preparing ingredients, snacks, and maintaining kitchen cleanliness.','Open'),(5,'Inventory Manager','Track inventory levels, manage stock, and coordinate restocking with suppliers.','Closed');
/*!40000 ALTER TABLE `jobpositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitem`
--

DROP TABLE IF EXISTS `menuitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitem` (
  `menuItemID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(45) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`menuItemID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitem`
--

LOCK TABLES `menuitem` WRITE;
/*!40000 ALTER TABLE `menuitem` DISABLE KEYS */;
INSERT INTO `menuitem` VALUES (1,'Classic Milk Tea','Boba & Tea','Traditional black tea with creamy milk and chewy tapioca pearls.',5.50),(2,'Classic Milk Tea (Large)','Boba & Tea','Traditional black tea with creamy milk and chewy tapioca pearls.',6.50),(3,'Taro Bliss','Boba & Tea','Sweet taro root blended with milk and your choice of toppings.',6.00),(4,'Taro Bliss (Large)','Boba & Tea','Sweet taro root blended with milk and your choice of toppings.',7.00),(5,'Matcha Zen','Boba & Tea','Premium Japanese matcha with oat milk and honey boba.',6.75),(6,'Matcha Zen (Large)','Boba & Tea','Premium Japanese matcha with oat milk and honey boba.',7.75),(7,'Strawberry Cloud','Boba & Tea','Fresh strawberries blended with jasmine tea, topped with sweet cheese foam.',6.50),(8,'Strawberry Cloud (Large)','Boba & Tea','Fresh strawberries blended with jasmine tea, topped with sweet cheese foam.',7.50),(9,'Brown Sugar Tiger','Boba & Tea','House-made brown sugar syrup swirled with fresh milk and chewy pearls.',6.25),(10,'Brown Sugar Tiger (Large)','Boba & Tea','House-made brown sugar syrup swirled with fresh milk and chewy pearls.',7.25),(11,'Mochi Trio','Snacks','Three pieces of handmade mochi in rotating seasonal flavors.',5.00),(12,'Taiyaki (1 pc)','Snacks','Fish-shaped waffle pastry filled with red bean, Nutella, or custard.',3.50),(13,'Taiyaki (3 pcs)','Snacks','Fish-shaped waffle pastry filled with red bean, Nutella, or custard.',9.00),(14,'Poké Bowl','Snacks','Fresh tuna or tofu over seasoned rice with avocado, edamame, and sesame.',12.95),(15,'Summer Rolls','Snacks','Two rice paper rolls with shrimp or tofu, fresh herbs, and rice noodles.',7.50),(16,'TeaZen Zen Vibes Tee (S)','Merch','100% organic cotton. Wear in-store for 10% off your drink!',18.95),(17,'TeaZen Zen Vibes Tee (M)','Merch','100% organic cotton. Wear in-store for 10% off your drink!',18.95),(18,'TeaZen Zen Vibes Tee (L)','Merch','100% organic cotton. Wear in-store for 10% off your drink!',18.95),(19,'TeaZen Zen Vibes Tee (XL)','Merch','100% organic cotton. Wear in-store for 10% off your drink!',18.95),(20,'TeaZen Boba Tumbler','Merch','20oz tumbler with wide boba straw. Keeps drinks cold for hours. Bring in for 10% off!',14.95);
/*!40000 ALTER TABLE `menuitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitemingredients`
--

DROP TABLE IF EXISTS `menuitemingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitemingredients` (
  `itemIngredientsID` int NOT NULL AUTO_INCREMENT,
  `menuitemID` int NOT NULL,
  `ingredientsID` int NOT NULL,
  `quantityRequired` decimal(10,2) NOT NULL,
  PRIMARY KEY (`itemIngredientsID`),
  KEY `fk_menuitemingredients_menuitem_idx` (`menuitemID`),
  KEY `fk_menuitemingredients_ingredient_idx` (`ingredientsID`),
  CONSTRAINT `fk_menuitemingredients_ingredient` FOREIGN KEY (`ingredientsID`) REFERENCES `ingredients` (`ingredientsID`),
  CONSTRAINT `fk_menuitemingredients_menuitem` FOREIGN KEY (`menuitemID`) REFERENCES `menuitem` (`menuItemID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitemingredients`
--

LOCK TABLES `menuitemingredients` WRITE;
/*!40000 ALTER TABLE `menuitemingredients` DISABLE KEYS */;
INSERT INTO `menuitemingredients` VALUES (1,1,1,200.00),(2,1,4,100.00),(3,1,9,50.00),(4,1,7,20.00),(5,3,11,30.00),(6,3,4,100.00),(7,3,9,50.00),(8,5,3,10.00),(9,5,5,100.00),(10,5,8,10.00),(11,7,12,80.00),(12,7,2,200.00),(13,7,10,30.00),(14,9,6,50.00),(15,9,4,100.00),(16,9,9,50.00),(17,11,11,20.00),(18,12,7,10.00),(19,13,7,20.00),(20,14,14,100.00),(21,14,15,100.00),(22,14,16,1.00),(23,14,17,50.00),(24,14,18,5.00),(25,15,13,2.00),(26,15,14,50.00),(27,15,15,50.00);
/*!40000 ALTER TABLE `menuitemingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `orderDetailID` int NOT NULL AUTO_INCREMENT,
  `orderID` int NOT NULL,
  `menuItemID` int NOT NULL,
  `quantity` int NOT NULL,
  `item_price` decimal(8,2) NOT NULL,
  `specialRequest` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderDetailID`),
  KEY `orderID_idx` (`orderID`),
  KEY `menuItemID_idx` (`menuItemID`),
  CONSTRAINT `menuItemID` FOREIGN KEY (`menuItemID`) REFERENCES `menuitem` (`menuItemID`),
  CONSTRAINT `orderID` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,5,1,1,5.50,''),(2,5,5,1,6.75,''),(3,6,5,1,6.75,''),(4,7,11,1,5.00,''),(5,7,14,1,12.95,''),(6,8,7,1,6.50,''),(7,8,11,1,5.00,''),(8,9,1,1,5.50,''),(9,10,1,1,5.50,''),(10,11,5,1,6.75,''),(11,12,10,1,7.25,'no sugar'),(12,13,3,1,6.00,''),(13,14,7,1,6.50,'extra sugar'),(14,15,7,1,6.50,'no sugar | pickup at 5pm'),(15,16,12,1,3.50,'no fish-shape, replace with heart shape'),(16,17,3,1,6.00,'light ice'),(17,18,20,1,14.95,'pickup at 2pm'),(18,19,15,5,7.50,'none');
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderID` int NOT NULL AUTO_INCREMENT,
  `orderDate` datetime NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `totalAmount` decimal(8,2) NOT NULL,
  PRIMARY KEY (`orderID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-03-24 15:23:05','Pending',5.50),(2,'2026-03-30 10:56:39','Pending',5.50),(3,'2026-03-30 12:31:38','Pending',6.00),(5,'2026-04-06 06:16:38','Pending',12.25),(6,'2026-04-13 16:24:51','Pending',6.75),(7,'2026-04-13 16:59:48','Pending',17.95),(8,'2026-04-20 03:59:16','Pending',11.50),(9,'2026-04-20 04:00:50','Pending',5.50),(10,'2026-04-20 04:02:37','Pending',5.50),(11,'2026-04-20 04:18:19','Pending',6.75),(12,'2026-04-20 04:19:47','Pending',7.25),(13,'2026-04-20 04:21:41','Pending',6.00),(14,'2026-04-20 04:31:20','Pending',6.50),(15,'2026-04-20 04:32:19','Pending',6.50),(16,'2026-04-20 04:46:50','Pending',3.50),(17,'2026-04-20 04:54:11','Pending',6.00),(18,'2026-04-20 04:55:29','Pending',14.95),(19,'2026-04-24 19:04:36','Pending',37.50);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 14:31:30
