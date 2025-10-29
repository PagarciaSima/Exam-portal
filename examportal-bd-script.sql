CREATE DATABASE  IF NOT EXISTS `examportal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `examportal`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: examportal
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `cid` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (23,'Aptitude practices updated','This quiz category contains quizzes related to aptitude practices updated'),(24,'GK practices','For practice GK questions'),(26,'Programming practice','This category contains quiz of programming'),(94,'Science','Quizzes related to various scientific topics.'),(95,'Mathematics','Quizzes covering mathematical concepts and problems.'),(96,'History','Quizzes about historical events and figures.'),(97,'Geography','Quizzes on geographical locations and features. updated'),(98,'Literature','Quizzes about literary works and authors.'),(124,'Health & Wellness','Quizzes about fitness, nutrition, and mental well-being.'),(125,'Technology','Quizzes on modern technologies, gadgets, and innovations.'),(126,'Sports','Questions covering various sports, players, and competitions.'),(127,'Environment','Quizzes related to nature, ecology, climate, and environmental issues.'),(128,'Politics','Quizzes on political systems, leaders, and events around the world.'),(129,'Art & Creativity','Quizzes about art history, painting, music, and other creative fields.'),(130,'Languages','Questions covering grammar, vocabulary, and language learning.'),(131,'Movies & Entertainment','Quizzes on films, TV series, actors, and entertainment trivia.');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_seq`
--

DROP TABLE IF EXISTS `category_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_seq`
--

LOCK TABLES `category_seq` WRITE;
/*!40000 ALTER TABLE `category_seq` DISABLE KEYS */;
INSERT INTO `category_seq` VALUES (201);
/*!40000 ALTER TABLE `category_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
INSERT INTO `hibernate_sequence` VALUES (138);
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `ques_id` bigint NOT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `option1` varchar(255) DEFAULT NULL,
  `option2` varchar(255) DEFAULT NULL,
  `option3` varchar(255) DEFAULT NULL,
  `option4` varchar(255) DEFAULT NULL,
  `quiz_q_id` bigint DEFAULT NULL,
  `given_answer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ques_id`),
  KEY `FKq1xd7v9iuws36j2pb22my632e` (`quiz_q_id`),
  CONSTRAINT `FKq1xd7v9iuws36j2pb22my632e` FOREIGN KEY (`quiz_q_id`) REFERENCES `quiz` (`q_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (33,'Object-Oriented Programming (OOP)','What type of programming paradigm is Java primarily based on?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','Object-Oriented Programming (OOP)','Functional Programming','Procedural Programming','Logic Programming',29,NULL),(35,'extends','Which of the following is the correct keyword to inherit a class in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','extends','implements','inherit','super',29,NULL),(36,'main()','Which method is the entry point of a Java program?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','start()','run()','main()','execute()',29,NULL),(37,'final','Which keyword in Java is used to prevent a class from being inherited?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','final','static','const','sealed',29,NULL),(38,'0','Which of the following is the default value of an uninitialized int variable in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','0','null','undefined','1',29,NULL),(39,'new','Which keyword is used in Java to create an object?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','new','create','make','instance',29,NULL),(41,'global','Which of the following is not a Java access modifier? updated','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','public','private','protected','global',29,NULL),(42,'==','Which operator is used to compare two values in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','==','=','!=','<>',29,NULL),(43,'int[] arr = new int[5];','Which of the following is the correct way to declare an array in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','int[] arr = new int[5];','array arr = int[5];','int arr = new int(5);','int arr[] = int[5];',29,NULL),(44,'final int MAX = 100;','Which of these is a valid way to declare a constant in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','final int MAX = 100;','const int MAX = 100;','static int MAX = 100;','immutable int MAX = 100;',29,NULL),(45,'start()','Which method is used to start a thread in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','run()','start()','init()','execute()',29,NULL),(46,'Serializable','Which interface does a class implement to be serializable in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','Serializable','Cloneable','Comparable','Runnable',29,NULL),(47,'IOException','Which of the following is a checked exception in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','IOException','NullPointerException','ArithmeticException','ArrayIndexOutOfBoundsException',29,NULL),(48,'Set','Which collection allows unique elements only in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','Set','List','Map','Queue',29,NULL),(49,'try-catch','Which of the following is used to handle exceptions in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','try-catch','if-else','switch-case','loop',29,NULL),(50,'interface','Which of the following keywords is used to define an interface in Java?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','interface','class','abstract','implements',29,NULL),(51,'finalize()','Which method in Java is called to clean up resources before an object is garbage collected?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','finalize()','destroy()','delete()','clean()',29,NULL),(52,'ArrayList','Which class in Java is used to represent a dynamically resizable array?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','ArrayList','LinkedList','Vector','HashMap',29,NULL),(53,'finally','Which keyword is used in Java to define a block of code that must always execute after a try block?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','finally','final','catch','complete',29,NULL),(54,'@RestController','Which annotation in Spring Boot is used to mark a class as a REST controller?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@RestController','@Controller','@Service','@Component',31,NULL),(55,'@SpringBootApplication','Which annotation in Spring Boot is used to create a Spring Boot application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@SpringBootApplication','@EnableAutoConfiguration','@Configuration','@ComponentScan',31,NULL),(56,'@Autowired','Which annotation is used to inject a dependency in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Autowired','@Inject','@Resource','@Dependency',31,NULL),(57,'@GetMapping','Which annotation in Spring Boot maps HTTP GET requests onto a method?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@GetMapping','@PostMapping','@RequestMapping','@PutMapping',31,NULL),(58,'@PathVariable','Which annotation is used to bind a method parameter to a path variable in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@PathVariable','@RequestParam','@RequestBody','@ModelAttribute',31,NULL),(59,'@RequestBody','Which annotation binds a method parameter to the body of a web request in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@RequestBody','@RequestParam','@PathVariable','@ModelAttribute',31,NULL),(60,'@ControllerAdvice','Which annotation is used to handle exceptions globally in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@ControllerAdvice','@ExceptionHandler','@RestController','@Service',31,NULL),(61,'@ExceptionHandler','Which annotation defines a method to handle a specific exception type in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@ExceptionHandler','@ErrorHandler','@HandleException','@Catch',31,NULL),(62,'All of the above','Which annotation is used to make a class a Spring Bean?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Component','@Service','@Repository','All of the above',31,NULL),(63,'@PostMapping','Which annotation in Spring Boot is used to map HTTP POST requests onto a method?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@PostMapping','@GetMapping','@PutMapping','@RequestMapping',31,NULL),(64,'@Value','Which annotation is used in Spring Boot to read a property value from application.properties?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Value','@Property','@ConfigValue','@PropertySource',31,NULL),(65,'@Service','Which annotation is used to indicate that a class provides business services in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Service','@Component','@Repository','@Controller',31,NULL),(66,'@Repository','Which annotation in Spring Boot indicates a class is a repository that encapsulates storage operations?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Repository','@Service','@Component','@Controller',31,NULL),(67,'@Controller','Which annotation in Spring Boot indicates a class is a web controller?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Controller','@RestController','@Service','@Component',31,NULL),(68,'@RequestParam','Which annotation is used to map a request parameter in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@RequestParam','@PathVariable','@RequestBody','@ModelAttribute',31,NULL),(69,'@Configuration','Which annotation in Spring Boot marks a class as a configuration class?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Configuration','@Component','@Bean','@Service',31,NULL),(70,'@Bean','Which annotation is used to define a bean method in a configuration class in Spring Boot?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Bean','@Component','@Service','@Autowired',31,NULL),(71,'@EnableAutoConfiguration','Which annotation in Spring Boot automatically configures your application based on the dependencies present?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@EnableAutoConfiguration','@SpringBootApplication','@Configuration','@ComponentScan',31,NULL),(72,'@ComponentScan','Which annotation in Spring Boot scans for Spring components in the specified package?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@ComponentScan','@Configuration','@SpringBootApplication','@EnableAutoConfiguration',31,NULL),(73,'@RestController','Which annotation is used in Spring Boot to create a RESTful web service?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@RestController','@Controller','@Service','@Component',31,NULL),(74,'@Component','<p>Which decorator is used to <strong>define an Angular component</strong>?</p>','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Component','@NgModule','@Injectable','@Directive',30,NULL),(75,'@Injectable','<p>Which decorator is used to <strong>make a class injectable</strong> as a service in Angular?</p>','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Injectable','@Service','@Component','@NgModule',30,NULL),(76,'*ngIf','Which directive is used for conditional rendering in Angular templates?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','*ngIf','*ngFor','*ngSwitch','*ngModel',30,NULL),(77,'*ngFor','Which directive is used to loop through a list in Angular templates?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','*ngFor','*ngIf','*ngSwitch','*ngModel',30,NULL),(78,'@Input','Which decorator is used to pass data from a parent to a child component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Input','@Output','@Injectable','@ViewChild',30,NULL),(79,'@Output','Which decorator is used to emit events from a child component to a parent?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Output','@Input','@EventEmitter','@Injectable',30,NULL),(80,'HttpClient','Which service is commonly used to perform HTTP requests in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','HttpClient','HttpService','HttpModule','HttpRequest',30,NULL),(81,'FormsModule','Which module must be imported to use forms in Angular templates?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','FormsModule','ReactiveFormsModule','BrowserModule','HttpClientModule',30,NULL),(82,'ReactiveFormsModule','Which module is used for reactive forms in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ReactiveFormsModule','FormsModule','BrowserModule','CommonModule',30,NULL),(83,'ngOnInit','Which lifecycle hook is called after Angular has initialized all data-bound properties?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ngOnInit','ngOnChanges','ngAfterViewInit','ngDoCheck',30,NULL),(84,'ngOnChanges','Which lifecycle hook is called whenever a data-bound input property changes?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ngOnChanges','ngOnInit','ngAfterViewInit','ngDoCheck',30,NULL),(85,'ngModel','Which directive is used to bind a form control to a component property?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ngModel','ngIf','ngFor','ngSwitch',30,NULL),(86,'@ViewChild','Which decorator is used to get a reference to a child component or DOM element?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@ViewChild','@ContentChild','@Inject','@Input',30,NULL),(87,'Router','Which Angular feature allows navigation between different components?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Router','NgModule','Service','Directive',30,NULL),(88,'@NgModule','Which decorator is used to define an Angular module?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@NgModule','@Component','@Injectable','@Directive',30,NULL),(89,'Router','Which service is used to navigate programmatically in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Router','Location','HttpClient','NgZone',30,NULL),(90,'@Directive','Which decorator is used to create a custom directive in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Directive','@Component','@Injectable','@NgModule',30,NULL),(91,'Service','Which Angular feature allows sharing data between components without a direct parent-child relationship?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Service','Directive','Module','Pipe',30,NULL),(92,'@Inject','Which decorator is used to inject a dependency in a component\'s constructor in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Inject','@Input','@Output','@ViewChild',30,NULL),(93,'Pipe','Which Angular feature allows transforming data in templates, like formatting dates or text?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Pipe','Directive','Service','Component',30,NULL),(113,'Polymorphism','Which OOP principle allows a subclass to provide a specific implementation of a method already defined in its superclass?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','Encapsulation','Polymorphism','Inheritance','Abstraction',29,NULL),(114,'extends','In Java, which keyword is used by a class to inherit from another class?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_java.jpg','extends','implements','inherits','super',29,NULL),(120,'@Autowired','Which annotation in Spring Boot is used to enable automatic dependency injection?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot.jpeg','@Autowired','@Inject','@Resource','@Qualifier',31,NULL),(152,'Controllers','Which of the following is NOT a core building block of an Angular application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Components','Modules','Controllers','Services',30,NULL),(153,'To declare a set of components, directives, and pipes that belong together.','What is the primary purpose of an Angular Module (NgModule)?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To define the application\'s routing configuration.','To declare a set of components, directives, and pipes that belong together.','To provide data to components.','To handle HTTP requests and responses.',30,NULL),(154,'@Component()','Which decorator is used to define a class as an Angular component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Injectable()','@Component()','@NgModule()','@Directive()',30,NULL),(155,'Using `[(ngModel)]` directive.','How do you achieve two-way data binding in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Using `[property]` binding.','Using `(event)` binding.','Using `[(ngModel)]` directive.','Using `{{ interpolation }}`.',30,NULL),(156,'ngOnInit','Which lifecycle hook is called once, after Angular has initialized all data-bound properties of a directive or component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ngOnInit','ngOnChanges','ngAfterViewInit','ngDoCheck',30,NULL),(157,'A design pattern where a class requests dependencies from external sources rather than creating them itself.','What is Dependency Injection in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','A technique to inject CSS styles into components.','A design pattern where a class requests dependencies from external sources rather than creating them itself.','A method for securely transmitting data between components.','A way to optimize the loading of JavaScript modules.',30,NULL),(158,'ng new app-name','Which command is used to generate a new Angular project using the Angular CLI?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ng create app-name','ng new app-name','angular generate app-name','npm init angular app-name',30,NULL),(159,'To subscribe to an Observable or Promise and return its latest value.','What is the purpose of the `async` pipe in Angular templates?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To make an HTTP request asynchronously.','To subscribe to an Observable or Promise and return its latest value.','To convert a value to a string asynchronously.','To run a function in the background.',30,NULL),(160,'Structural Directives','Which type of directive changes the DOM layout by adding and removing DOM elements?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Attribute Directives','Structural Directives','Component Directives','Event Directives',30,NULL),(161,'Faster rendering and better security.','What is the primary benefit of Ahead-of-Time (AOT) compilation in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Faster development cycle.','Larger bundle size.','Faster rendering and better security.','Enables dynamic module loading.',30,NULL),(162,'map','Which RxJS operator is commonly used to transform each value emitted by an Observable into another value?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','filter','tap','map','switchMap',30,NULL),(163,'To make services available for Dependency Injection.','What is the purpose of `providers` array in an `@NgModule` or `@Component` decorator?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To declare components, directives, and pipes.','To make services available for Dependency Injection.','To import other Angular modules.','To define routing configurations.',30,NULL),(164,'@Input()','Which of the following is used to pass data from a parent component to a child component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Output()','@ViewChild()','@Input()','EventEmitter',30,NULL),(165,'To provide a mechanism for Angular\'s change detection to know when to run.','What is `Zone.js` primarily used for in Angular applications?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To manage state across the application.','To provide a mechanism for Angular\'s change detection to know when to run.','To compile TypeScript code to JavaScript.','To handle routing and navigation.',30,NULL),(166,'FormsModule','Which module should you import to use `ngModel` in your Angular forms?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','HttpClientModule','RouterModule','ReactiveFormsModule','FormsModule',30,NULL),(167,'By configuring routes in the `app-routing.module.ts`.','How do you handle routing in an Angular application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Using `ng-route` directive.','By configuring routes in the `app-routing.module.ts`.','Through manual DOM manipulation.','By importing `BrowserModule`.',30,NULL),(168,'To make HTTP requests to backend services.','What is the purpose of `HttpClient` in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To create web servers.','To make HTTP requests to backend services.','To handle client-side routing.','To manage the component lifecycle.',30,NULL),(169,'Component Binding','Which of the following is NOT a type of data binding in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Property Binding','Event Binding','Class Binding','Component Binding',30,NULL),(170,'To transform data before displaying it in the template.','In Angular, what is the role of a Pipe?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To handle asynchronous operations.','To transform data before displaying it in the template.','To create reusable UI components.','To manage global application state.',30,NULL),(171,'@Output()','Which decorator is used to expose an event from a child component to a parent component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Input()','@Output()','@HostListener()','@EventEmitter()',30,NULL),(172,'Component','What is the fundamental building block of an Angular application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Module','Component','Service','Directive',30,NULL),(173,'@Component','Which decorator is used to define a class as an Angular component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@NgModule','@Injectable','@Component','@Directive',30,NULL),(174,'Property binding','Which type of data binding is used to pass data from a parent component to a child component in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Event binding','Two-way binding','Property binding','Style binding',30,NULL),(175,'ng new','What is the Angular CLI command to create a new Angular project?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ng build','ng serve','ng new','ng generate',30,NULL),(176,'@Injectable','Which decorator is typically used to mark a class as an Angular service, making it available for dependency injection?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Component','@Pipe','@Injectable','@Directive',30,NULL),(177,'ngOnInit','Which Angular lifecycle hook is called once after the component\'s data-bound properties have been initialized?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','ngOnChanges','ngOnInit','ngDoCheck','ngOnDestroy',30,NULL),(178,'RouterModule','Which module needs to be imported to enable routing in an Angular application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','FormsModule','HttpClientModule','BrowserModule','RouterModule',30,NULL),(179,'*ngIf','Which structural directive is used for conditional rendering of elements in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','*ngFor','[ngClass]','*ngIf','[ngStyle]',30,NULL),(180,'Event binding','How do you listen to DOM events (like a button click) in an Angular template?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Property binding','Event binding','Two-way binding','Attribute binding',30,NULL),(181,'RxJS','What is the primary library Angular uses for handling asynchronous operations and events?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Promises','Callbacks','RxJS','Async/Await',30,NULL),(182,'{{ value | pipeName }}','How do you apply a pipe to transform data in an Angular template?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','{{ value | pipeName }}','[value]=\"pipeName(value)\"','(value)=\"pipeName\"','value.pipeName()',30,NULL),(183,'Emulated','Which `ViewEncapsulation` strategy ensures that component styles are isolated and do not affect other parts of the application?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','None','ShadowDom','Emulated','Native',30,NULL),(184,'Singleton (Application-wide)','When you provide a service in the `providers` array of an `@NgModule`, what is its default scope?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Component-specific','Singleton (Application-wide)','Module-specific (lazy-loaded module)','Global',30,NULL),(185,'FormsModule','Which module must be imported to use template-driven forms in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','HttpClientModule','RouterModule','FormsModule','ReactiveFormsModule',30,NULL),(186,'HttpClientModule','Which Angular module is used to make HTTP requests to a backend server?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','RouterModule','BrowserModule','HttpClientModule','FormsModule',30,NULL),(187,'To improve performance when list items change','What is the purpose of the `trackBy` function when using `*ngFor`?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','To sort the list items','To filter the list items','To improve performance when list items change','To group list items',30,NULL),(188,'@Input','Which decorator is used to mark a property as an input property, allowing it to receive data from a parent component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Output','@Inject','@Input','@ViewChild',30,NULL),(189,'@Output','Which decorator is used to mark a property as an output property, allowing a component to emit events to its parent?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','@Input','@Inject','@Output','@HostListener',30,NULL),(190,'Improves initial load time','What is the primary benefit of lazy loading modules in Angular?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Reduces application bundle size','Improves initial load time','Enhances security','Simplifies component communication',30,NULL),(191,'OnPush','Which `ChangeDetectionStrategy` can significantly improve performance by only checking for changes when input properties change or an event originates from the component?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_angular.png','Default','OnPush','Always','Manual',30,NULL),(202,'option1','What does CSS stand for?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','Cascading Style Sheets','Creative Style Sheets','Computer Style Sheets','Colorful Style Sheets',102,NULL),(203,'option1','Which HTML tag is used to define an internal style sheet?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','<style>','<script>','<css>','<link>',102,NULL),(204,'option4','Which HTML tag is used to link an external style sheet?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','<style>','<script>','<css>','<link>',102,NULL),(205,'option2','Where in an HTML document is the correct place to refer to an external style sheet?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','In the <body> section','In the <head> section','At the end of the document','After the <html> tag',102,NULL),(206,'option2','Which CSS property is used to change the background color of an element?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','color','background-color','bgcolor','background',102,NULL),(207,'option3','Which CSS property is used to change the text color of an element?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','text-color','fgcolor','color','font-color',102,NULL),(208,'option3','Which CSS property controls the text size?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','text-style','text-size','font-size','font-style',102,NULL),(209,'option2','How do you display a border like this: top: 10px, right: 5px, bottom: 15px, left: 20px?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','border-width: 10px 20px 15px 5px;','border-width: 10px 5px 15px 20px;','border-width: 15px 20px 10px 5px;','border-width: 20px 15px 10px 5px;',102,NULL),(210,'option1','Which property is used to change the font of an element?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','font-family','font-style','font-weight','font-variant',102,NULL),(211,'option1','How do you make the text bold?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','font-weight: bold;','text-decoration: bold;','font-style: bold;','text-transform: bold;',102,NULL),(212,'option2','How do you select an element with id \"demo\"?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','.demo','#demo','*demo','demo',102,NULL),(213,'option4','How do you select elements with class name \"test\"?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','*test','test','#test','.test',102,NULL),(214,'option2','Which CSS property is used for controlling the space between the element\'s content and its border?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','margin','padding','border-spacing','spacing',102,NULL),(215,'option1','Which CSS property is used for controlling the space outside the element\'s border?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','margin','padding','border-spacing','spacing',102,NULL),(216,'option3','Which value of the `display` property makes an element behave like an inline element but with the ability to set width and height?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','inline','block','inline-block','none',102,NULL),(217,'option1','What is the correct CSS syntax for making all `<p>` elements red?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','p {color: red;}','p.color=red;','<p style=\"color:red;\">','{p; color:red;}',102,NULL),(218,'option3','Which of the following is the correct way to add a comment in CSS?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','<!-- This is a comment -->','// This is a comment','/* This is a comment */','\' This is a comment',102,NULL),(219,'option1','What does the `box-sizing: border-box;` property do?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','Includes padding and border in the element\'s total width and height.','Excludes padding and border from the element\'s total width and height.','Sets the box shadow property.','Resets the box model entirely.',102,NULL),(220,'option4','What is the default value of the `position` property?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','relative','absolute','fixed','static',102,NULL),(221,'option2','Which CSS property would you use to hide an element while still taking up space in the layout?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_css.png/','display: none;','visibility: hidden;','opacity: 0;','height: 0;',102,NULL),(222,'Proton','Which subatomic particle has a positive charge?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Electron','Neutron','Proton','Photon',136,NULL),(223,'Number of protons','What determines the atomic number of an element?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Number of neutrons','Number of electrons','Number of protons','Total mass of the atom',136,NULL),(224,'Ion','What is an atom with a net electrical charge called?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Isotope','Molecule','Ion','Compound',136,NULL),(225,'Orbiting the nucleus in shells/orbitals','Where are electrons found within an atom?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','In the nucleus with protons','In the nucleus with neutrons','Orbiting the nucleus in shells/orbitals','Randomly dispersed throughout the atom',136,NULL),(226,'Isotopes','What are atoms of the same element with different numbers of neutrons called?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Ions','Isotopes','Allotropes','Molecules',136,NULL),(227,'Burning wood','Which of the following represents a chemical change?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Melting ice','Boiling water','Burning wood','Dissolving sugar in water',136,NULL),(228,'It is neither created nor destroyed','According to the Law of Conservation of Mass, what happens to matter in a chemical reaction?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','It is created','It is destroyed','It is neither created nor destroyed','It is converted into energy',136,NULL),(229,'Reactants','In a chemical equation, substances written on the left side of the arrow are called what?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Products','Reactants','Catalysts','Solvents',136,NULL),(230,'Exothermic','A reaction that releases energy, often in the form of heat, is called:','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Endothermic','Exothermic','Isothermic','Catalytic',136,NULL),(231,'Synthesis reaction','Which type of reaction combines two or more reactants to form a single, more complex product?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Decomposition reaction','Single displacement reaction','Synthesis reaction','Combustion reaction',136,NULL),(232,'Carbon dioxide and water','What is typically produced when a hydrocarbon undergoes complete combustion?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Carbon monoxide and hydrogen','Carbon dioxide and water','Methane and oxygen','Sulfur dioxide and nitrogen',136,NULL),(233,'Periods','What are the horizontal rows on the periodic table called?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Groups','Blocks','Periods','Families',136,NULL),(234,'Chemical properties','Elements in the same group (vertical column) of the periodic table generally have similar:','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Atomic masses','Numbers of protons','Chemical properties','Numbers of electron shells',136,NULL),(235,'Noble gases','Which group of elements is known for being largely unreactive and having a full outer electron shell?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Alkali metals','Halogens','Noble gases','Transition metals',136,NULL),(236,'Metals','Which type of elements are typically good conductors of heat and electricity?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Nonmetals','Metalloids','Noble gases','Metals',136,NULL),(237,'Alkali metals','What is the common name for the elements in Group 1 of the periodic table (excluding hydrogen)?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Alkaline earth metals','Halogens','Alkali metals','Chalcogens',136,NULL),(238,'7','How many valence electrons do elements in Group 17 (Halogens) typically have?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','1','2','7','8',136,NULL),(239,'It decreases','As you move from left to right across a period on the periodic table, what generally happens to the atomic radius?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','It increases','It decreases','It remains constant','It first increases, then decreases',136,NULL),(240,'Electron','Which subatomic particle has a negligible mass compared to protons and neutrons?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Proton','Neutron','Electron','Nucleus',136,NULL),(241,'C','What is the chemical symbol for the element Carbon?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_spring-boot_quimica.jpg/','Ca','Co','C','Cr',136,NULL),(242,'Array','Which of the following data structures stores elements in contiguous memory locations?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Linked List','Array','Tree','Graph',133,NULL),(243,'O(1)','What is the time complexity for accessing an element at a specific index in an array?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','O(log n)','O(n)','O(1)','O(n^2)',133,NULL),(244,'Linked List','Which data structure uses nodes that contain both data and a reference to the next node?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Array','Stack','Linked List','Queue (implemented with array)',133,NULL),(245,'Fixed size','What is a major disadvantage of arrays compared to linked lists?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Faster element access','Fixed size','Easier to implement','Less memory usage',133,NULL),(246,'Stack','Which data structure follows the Last-In, First-Out (LIFO) principle?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Queue','Linked List','Stack','Array',133,NULL),(247,'Push','What operation is used to add an element to a stack?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Dequeue','Insert','Push','Enqueue',133,NULL),(248,'Queue','Which data structure follows the First-In, First-Out (FIFO) principle?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Stack','Queue','Binary Search Tree','Hash Table',133,NULL),(249,'Dequeue','What operation is used to remove an element from a queue?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Pop','Delete','Enqueue','Dequeue',133,NULL),(250,'Leaf','In a tree data structure, what is a node that has no children called?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Root','Parent','Leaf','Branch',133,NULL),(251,'In-order','Which tree traversal method visits the left subtree, then the root, then the right subtree?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Pre-order','Post-order','In-order','Level-order',133,NULL),(252,'Ability to traverse backwards','What is the primary advantage of a Doubly Linked List over a Singly Linked List?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Less memory usage','Faster random access','Ability to traverse backwards','Simpler implementation',133,NULL),(253,'Browser history (back button)','Which of the following is an application of a stack?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','CPU Scheduling','Browser history (back button)','Print spooling','File system directory structure',133,NULL),(254,'O(n)','The worst-case time complexity for inserting an element at the beginning of an array of size \'n\' is:','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','O(1)','O(log n)','O(n)','O(n log n)',133,NULL),(255,'Stack','Which data structure is best suited for implementing an \'undo\' mechanism in a text editor?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Queue','Array','Stack','Binary Search Tree',133,NULL),(256,'O(log n)','In a Binary Search Tree (BST), what is the time complexity for searching an element in the best case (balanced tree)?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','O(n)','O(log n)','O(1)','O(n^2)',133,NULL),(257,'Binary Tree','What is the term for a tree where each node has at most two children?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','N-ary Tree','General Tree','Binary Tree','AVL Tree',133,NULL),(258,'Hash Linked List','Which of the following is NOT a type of linked list?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Singly Linked List','Doubly Linked List','Circular Linked List','Hash Linked List',133,NULL),(259,'Rear (Tail)','In a queue, which end is typically used for adding new elements?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Front (Head)','Rear (Tail)','Middle','Anywhere',133,NULL),(260,'The topmost node in the tree','What is the root node in a tree data structure?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','A node with no children','The topmost node in the tree','A node with exactly one child','Any node that is not a leaf',133,NULL),(261,'Linked lists do not require shifting elements during insertion/deletion.','Why might a linked list be preferred over an array for dynamic data where frequent insertions and deletions occur at arbitrary positions?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_data_structure.jpg','Linked lists use less memory.','Linked lists provide O(1) random access.','Linked lists do not require shifting elements during insertion/deletion.','Linked lists are always faster to traverse.',133,NULL),(262,'#','Which symbol is used for single-line comments in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','//','#','/* */','<!-- -->',132,NULL),(263,'Using indentation','How does Python primarily define code blocks (e.g., inside `if` statements or functions)?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','Using curly braces `{}`','Using parentheses `()`','Using indentation','Using keywords `begin` and `end`',132,NULL),(264,'x = 10','What is the correct way to assign the integer value 10 to a variable named `x`?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','x == 10','x = 10','int x = 10','assign x to 10',132,NULL),(265,'float','What is the data type of the value `5.0` in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','int','str','float','bool',132,NULL),(266,'All of the above','Which of the following is a valid way to create a string in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','text = \'Hello\'','text = \"Hello\"','text = \'\'\'Hello\'\'\'','All of the above',132,NULL),(267,'my_list = []','How do you create an empty list named `my_list` in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','my_list = {}','my_list = ()','my_list = []','my_list = new List()',132,NULL),(268,'Immutable and ordered','Which of the following best describes a Python tuple?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','Mutable and unordered','Immutable and ordered','Mutable and ordered','Immutable and unordered',132,NULL),(269,'person[\'name\']','Given a dictionary `person = {\'name\': \'Alice\', \'age\': 30}`, how do you access the value associated with the key \'name\'?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','person.name','person(\'name\')','person[\'name\']','person.get_name()',132,NULL),(270,'3','What is the result of the Python expression `10 // 3`?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','3.333...','3','1','4',132,NULL),(271,'==','Which operator is used to check if two values are equal in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','=','==','!=','===',132,NULL),(272,'elif','What keyword is used to start an \'else if\' condition in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','else if','elseif','elif','elsif',132,NULL),(273,'0, 1, 2, 3, 4','What sequence of numbers will `range(5)` generate in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','0, 1, 2, 3, 4, 5','1, 2, 3, 4, 5','0, 1, 2, 3, 4','5',132,NULL),(274,'break','Which statement is used to immediately exit a loop (e.g., `for` or `while`) in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','exit','stop','break','continue',132,NULL),(275,'def','What keyword is used to define a function in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','function','func','def','define',132,NULL),(276,'None','What does a Python function return if no `return` statement is explicitly used?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','0','None','An empty string','An error',132,NULL),(277,'\'Hello World\'','What is the output of the expression `\'Hello\' + \' \' + \'World\'`?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','\'HelloWorld\'','\'Hello World\'','Error','\'Hello\' \'World\'',132,NULL),(278,'True, False','What are the two possible Boolean values in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','true, false','1, 0','True, False','yes, no',132,NULL),(279,'append()','Which list method is used to add an item to the end of a list?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','add()','insert()','append()','extend()',132,NULL),(280,'The integer 123','What is the result of `int(\'123\')` in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','The string \'123\'','The integer 123','The float 123.0','An error',132,NULL),(281,'2nd_variable','Which of the following is an invalid variable name in Python?','http://localhost:8080/images/questions/90a1791d-4c1a-4651-881a-df781ebea304_py.png','my_variable','_variable','variable2','2nd_variable',132,NULL);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_attempts`
--

DROP TABLE IF EXISTS `question_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `correct` bit(1) NOT NULL,
  `given_answer` varchar(255) DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  `attempt_id` bigint DEFAULT NULL,
  `quiz_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl6lg569ba8ad47g2ph4btai2v` (`question_id`),
  KEY `FK867illn56dxfjrgwak6vuonwj` (`attempt_id`),
  CONSTRAINT `FK867illn56dxfjrgwak6vuonwj` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`),
  CONSTRAINT `FKl6lg569ba8ad47g2ph4btai2v` FOREIGN KEY (`question_id`) REFERENCES `question` (`ques_id`)
) ENGINE=InnoDB AUTO_INCREMENT=661 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_attempts`
--

LOCK TABLES `question_attempts` WRITE;
/*!40000 ALTER TABLE `question_attempts` DISABLE KEYS */;
INSERT INTO `question_attempts` VALUES (441,_binary '\0','',41,307,29),(442,_binary '','start()',45,307,29),(443,_binary '\0','',51,307,29),(444,_binary '\0','',44,307,29),(445,_binary '\0','',33,307,29),(446,_binary '\0','',50,307,29),(447,_binary '\0','',53,307,29),(448,_binary '\0','',38,307,29),(449,_binary '\0','',47,307,29),(450,_binary '\0','',49,307,29),(451,_binary '\0','',46,307,29),(452,_binary '\0','',113,307,29),(453,_binary '\0','',39,307,29),(454,_binary '\0','',36,307,29),(455,_binary '\0','',52,307,29),(456,_binary '\0','',37,307,29),(457,_binary '\0','',43,307,29),(458,_binary '\0','',35,307,29),(459,_binary '\0','',42,307,29),(460,_binary '\0','',48,307,29),(461,_binary '\0','',50,308,29),(462,_binary '\0','',46,308,29),(463,_binary '\0','',42,308,29),(464,_binary '\0','',38,308,29),(465,_binary '\0','',113,308,29),(466,_binary '\0','',39,308,29),(467,_binary '\0','',41,308,29),(468,_binary '\0','',33,308,29),(469,_binary '\0','',51,308,29),(470,_binary '\0','',114,308,29),(471,_binary '\0','',36,308,29),(472,_binary '\0','',45,308,29),(473,_binary '\0','',43,308,29),(474,_binary '\0','',35,308,29),(475,_binary '\0','',52,308,29),(476,_binary '\0','',48,308,29),(477,_binary '\0','',44,308,29),(478,_binary '\0','',53,308,29),(479,_binary '\0','',37,308,29),(480,_binary '\0','',47,308,29),(481,_binary '\0','',43,309,29),(482,_binary '\0','',53,309,29),(483,_binary '\0','',45,309,29),(484,_binary '\0','',49,309,29),(485,_binary '\0','',51,309,29),(486,_binary '\0','',114,309,29),(487,_binary '\0','',36,309,29),(488,_binary '\0','',42,309,29),(489,_binary '\0','',50,309,29),(490,_binary '\0','',47,309,29),(491,_binary '\0','',44,309,29),(492,_binary '\0','',33,309,29),(493,_binary '\0','',38,309,29),(494,_binary '\0','',35,309,29),(495,_binary '\0','',52,309,29),(496,_binary '\0','',46,309,29),(497,_binary '\0','',113,309,29),(498,_binary '\0','',39,309,29),(499,_binary '\0','',41,309,29),(500,_binary '\0','',48,309,29),(501,_binary '','new',39,310,29),(502,_binary '\0','',47,310,29),(503,_binary '\0','',36,310,29),(504,_binary '\0','',41,310,29),(505,_binary '\0','',33,310,29),(506,_binary '\0','',42,310,29),(507,_binary '\0','',50,310,29),(508,_binary '\0','',113,310,29),(509,_binary '\0','',114,310,29),(510,_binary '\0','',44,310,29),(511,_binary '\0','',35,310,29),(512,_binary '\0','',46,310,29),(513,_binary '\0','',45,310,29),(514,_binary '\0','',53,310,29),(515,_binary '\0','',43,310,29),(516,_binary '\0','',52,310,29),(517,_binary '\0','',51,310,29),(518,_binary '\0','',37,310,29),(519,_binary '\0','',48,310,29),(520,_binary '\0','',38,310,29),(521,_binary '\0','',44,311,29),(522,_binary '\0','',45,311,29),(523,_binary '\0','',47,311,29),(524,_binary '\0','',113,311,29),(525,_binary '\0','super',114,311,29),(526,_binary '\0','',36,311,29),(527,_binary '\0','',43,311,29),(528,_binary '\0','',49,311,29),(529,_binary '\0','',51,311,29),(530,_binary '\0','',41,311,29),(531,_binary '\0','',42,311,29),(532,_binary '\0','',50,311,29),(533,_binary '\0','',52,311,29),(534,_binary '\0','',48,311,29),(535,_binary '\0','',37,311,29),(536,_binary '\0','',39,311,29),(537,_binary '\0','',46,311,29),(538,_binary '\0','',38,311,29),(539,_binary '\0','',35,311,29),(540,_binary '\0','',53,311,29),(541,_binary '\0','',36,312,29),(542,_binary '\0','',42,312,29),(543,_binary '\0','',38,312,29),(544,_binary '\0','',48,312,29),(545,_binary '\0','',44,312,29),(546,_binary '\0','',43,312,29),(547,_binary '','extends',35,312,29),(548,_binary '\0','',53,312,29),(549,_binary '\0','',37,312,29),(550,_binary '\0','',45,312,29),(551,_binary '\0','',33,312,29),(552,_binary '\0','',47,312,29),(553,_binary '\0','',41,312,29),(554,_binary '\0','',52,312,29),(555,_binary '\0','',51,312,29),(556,_binary '\0','',46,312,29),(557,_binary '\0','',113,312,29),(558,_binary '\0','',39,312,29),(559,_binary '\0','',114,312,29),(560,_binary '\0','',50,312,29),(561,_binary '\0','',39,313,29),(562,_binary '\0','',36,313,29),(563,_binary '\0','',113,313,29),(564,_binary '\0','',114,313,29),(565,_binary '\0','',52,313,29),(566,_binary '\0','',37,313,29),(567,_binary '','start()',45,313,29),(568,_binary '\0','',44,313,29),(569,_binary '\0','',51,313,29),(570,_binary '\0','',53,313,29),(571,_binary '\0','',49,313,29),(572,_binary '\0','',46,313,29),(573,_binary '\0','',35,313,29),(574,_binary '\0','',43,313,29),(575,_binary '\0','',41,313,29),(576,_binary '\0','',38,313,29),(577,_binary '\0','',33,313,29),(578,_binary '\0','',48,313,29),(579,_binary '\0','',42,313,29),(580,_binary '\0','',50,313,29),(581,_binary '\0','',47,314,29),(582,_binary '\0','',51,314,29),(583,_binary '\0','',33,314,29),(584,_binary '\0','',48,314,29),(585,_binary '\0','',36,314,29),(586,_binary '\0','',43,314,29),(587,_binary '\0','',44,314,29),(588,_binary '\0','',35,314,29),(589,_binary '\0','',114,314,29),(590,_binary '\0','',46,314,29),(591,_binary '\0','',52,314,29),(592,_binary '\0','',53,314,29),(593,_binary '\0','',37,314,29),(594,_binary '\0','',49,314,29),(595,_binary '\0','',45,314,29),(596,_binary '\0','',113,314,29),(597,_binary '\0','',39,314,29),(598,_binary '\0','',41,314,29),(599,_binary '\0','',50,314,29),(600,_binary '\0','',38,314,29),(601,_binary '\0','',42,352,29),(602,_binary '\0','',46,352,29),(603,_binary '\0','',47,352,29),(604,_binary '\0','',41,352,29),(605,_binary '\0','',45,352,29),(606,_binary '\0','',35,352,29),(607,_binary '\0','',114,352,29),(608,_binary '\0','',50,352,29),(609,_binary '\0','',51,352,29),(610,_binary '\0','',113,352,29),(611,_binary '\0','',37,352,29),(612,_binary '\0','',43,352,29),(613,_binary '\0','',36,352,29),(614,_binary '\0','',49,352,29),(615,_binary '\0','',38,352,29),(616,_binary '\0','',33,352,29),(617,_binary '\0','',39,352,29),(618,_binary '\0','',53,352,29),(619,_binary '\0','',44,352,29),(620,_binary '\0','',48,352,29),(621,_binary '\0','',167,353,30),(622,_binary '\0','',159,353,30),(623,_binary '\0','',179,353,30),(624,_binary '\0','',191,353,30),(625,_binary '\0','',80,353,30),(626,_binary '\0','',166,353,30),(627,_binary '\0','',186,353,30),(628,_binary '\0','',178,353,30),(629,_binary '\0','',93,353,30),(630,_binary '\0','',165,353,30),(631,_binary '\0','',177,353,30),(632,_binary '\0','',87,353,30),(633,_binary '\0','',153,353,30),(634,_binary '\0','',181,353,30),(635,_binary '\0','',78,353,30),(636,_binary '\0','',190,353,30),(637,_binary '\0','',169,353,30),(638,_binary '\0','',79,353,30),(639,_binary '\0','',162,353,30),(640,_binary '\0','',77,353,30),(641,_binary '','new',39,402,29),(642,_binary '\0','',33,402,29),(643,_binary '\0','',47,402,29),(644,_binary '\0','',51,402,29),(645,_binary '\0','',44,402,29),(646,_binary '\0','',43,402,29),(647,_binary '\0','',53,402,29),(648,_binary '\0','',38,402,29),(649,_binary '\0','',113,402,29),(650,_binary '\0','',37,402,29),(651,_binary '\0','',42,402,29),(652,_binary '\0','',48,402,29),(653,_binary '\0','',46,402,29),(654,_binary '\0','',114,402,29),(655,_binary '\0','',50,402,29),(656,_binary '\0','',49,402,29),(657,_binary '\0','',45,402,29),(658,_binary '\0','',36,402,29),(659,_binary '\0','',41,402,29),(660,_binary '\0','',52,402,29);
/*!40000 ALTER TABLE `question_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_seq`
--

DROP TABLE IF EXISTS `question_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_seq`
--

LOCK TABLES `question_seq` WRITE;
/*!40000 ALTER TABLE `question_seq` DISABLE KEYS */;
INSERT INTO `question_seq` VALUES (351);
/*!40000 ALTER TABLE `question_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `q_id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `max_marks` int DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `number_of_questions` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`q_id`),
  KEY `FK82x9fxd5tsbb3i1ewrp3cr8xa` (`category_id`),
  CONSTRAINT `FK82x9fxd5tsbb3i1ewrp3cr8xa` FOREIGN KEY (`category_id`) REFERENCES `category` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (2,'Questions covering various branches of science including physics, chemistry, and biology.','General Science Quiz',150,_binary '\0',15,94),(4,'Questions about political systems, leaders, ideologies, and major global events.','World Politics Quiz',150,_binary '\0',15,128),(5,'Test your knowledge about nutrition, exercise, and healthy lifestyle habits.','Healthy Living Quiz',150,_binary '\0',15,124),(6,'Explore important topics related to stress management, emotional balance, and mental well-being.','Mental Health Awareness Quiz',150,_binary '\0',15,124),(29,'This quiz contains questions of basic core java and oops','Java and OOP Basics Quiz',200,_binary '',20,26),(30,'This quiz contains questions of Angular 2+','Angular Quiz',200,_binary '',20,26),(31,'This quiz contains questions of basic core Spring Boot','Spring boot Basics Quiz',NULL,_binary '',20,26),(102,'This quiz contains questions covering basic CSS concepts, selectors, and styling techniques','CSS Basics Quiz',200,_binary '',20,26),(132,'This quiz covers basic Python syntax, data types, and functions','Python Fundamentals Quiz',150,_binary '',15,26),(133,'Questions on arrays, linked lists, stacks, queues, and trees','Data Structures Quiz',200,_binary '',20,26),(134,'Test your knowledge of countries, capitals, and major landmarks','World Geography Quiz',100,_binary '\0',10,97),(135,'Questions about major events and figures in European history','European History Quiz',120,_binary '',12,96),(136,'Covers atomic structure, chemical reactions, and periodic table basics','Basic Chemistry Quiz',180,_binary '',18,94),(137,'Questions on classic and modern English literature works and authors','English Literature Quiz',150,_binary '',15,98);
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` bigint NOT NULL,
  `attempt_date` datetime(6) DEFAULT NULL,
  `attempted` int NOT NULL,
  `correct_answers` double NOT NULL,
  `marks_got` double NOT NULL,
  `quiz_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKny3k8jif6t9pj9dmhreegmeg7` (`quiz_id`),
  KEY `FKpj4a9hw0iv1mo1ut6rppg594u` (`user_id`),
  CONSTRAINT `FKny3k8jif6t9pj9dmhreegmeg7` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`q_id`),
  CONSTRAINT `FKpj4a9hw0iv1mo1ut6rppg594u` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
INSERT INTO `quiz_attempts` VALUES (307,'2025-10-22 07:10:16.529530',1,1,10,29,10),(308,'2025-10-22 07:13:01.834557',0,0,0,29,10),(309,'2025-10-22 07:18:13.765031',0,0,0,29,10),(310,'2025-10-22 07:22:56.468663',1,1,10,29,10),(311,'2025-10-22 07:36:17.103130',1,0,0,29,10),(312,'2025-10-22 07:38:58.978343',1,1,10,29,10),(313,'2025-10-22 07:42:16.670786',1,1,10,29,10),(314,'2025-10-22 07:44:24.361826',0,0,0,29,10),(352,'2025-10-24 10:09:21.174044',0,0,0,29,10),(353,'2025-10-24 10:20:01.409651',0,0,0,30,10),(402,'2025-10-24 14:28:39.686691',1,1,10,29,10);
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts_seq`
--

DROP TABLE IF EXISTS `quiz_attempts_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts_seq`
--

LOCK TABLES `quiz_attempts_seq` WRITE;
/*!40000 ALTER TABLE `quiz_attempts_seq` DISABLE KEYS */;
INSERT INTO `quiz_attempts_seq` VALUES (501);
/*!40000 ALTER TABLE `quiz_attempts_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_seq`
--

DROP TABLE IF EXISTS `quiz_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_seq`
--

LOCK TABLES `quiz_seq` WRITE;
/*!40000 ALTER TABLE `quiz_seq` DISABLE KEYS */;
INSERT INTO `quiz_seq` VALUES (101);
/*!40000 ALTER TABLE `quiz_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'NORMAL'),(2,'ADMIN');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_seq`
--

DROP TABLE IF EXISTS `roles_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_seq`
--

LOCK TABLES `roles_seq` WRITE;
/*!40000 ALTER TABLE `roles_seq` DISABLE KEYS */;
INSERT INTO `roles_seq` VALUES (1);
/*!40000 ALTER TABLE `roles_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_role` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `role_role_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_role`),
  KEY `FKj345gk1bovqvfame88rcx7yyx` (`user_id`),
  KEY `FK7u21823ktfhu9bmx2350x6n8s` (`role_role_id`),
  CONSTRAINT `FK7u21823ktfhu9bmx2350x6n8s` FOREIGN KEY (`role_role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (3,2,1),(5,4,2),(11,10,1),(13,12,1),(15,14,1),(17,16,1),(19,18,1),(21,20,1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_seq`
--

DROP TABLE IF EXISTS `user_role_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_seq`
--

LOCK TABLES `user_role_seq` WRITE;
/*!40000 ALTER TABLE `user_role_seq` DISABLE KEYS */;
INSERT INTO `user_role_seq` VALUES (1);
/*!40000 ALTER TABLE `user_role_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'john.doe@example.com',_binary '','John','Doe','+34123456789','john.doe','default.jpg',NULL),(4,'admin@example.com',_binary '','Pablo','García','666223311','admin','http://localhost:8080/images/profile/user_4.jpg','$2a$10$MTmH9YjiSPhbGqMFpJOYmuyuHNumL/R5riyKUU51kHpHocmhrwhHe'),(10,'patata@hot.com',_binary '','patata','patata','12345632','user','default.png','$2a$10$iYEerGX2pvz7RnI0l6h1KuqQy9Txn2vxplXLsDD2hGD3LSm1bGJaS'),(12,'pg@hot.com',_binary '','aqsasasasas','asasasa','6666666666','john.doe2','default.png','1212112'),(14,'admin2@example.com',_binary '','admin','admin','+34111222333','admin2','admin.jpg','$2a$10$hU.sW4qKn7IwDxGQGzk1EOacptmTaCNaDZ9qdhWM5PWKGYnm/etQS'),(16,'patata@hotmail.com',_binary '','patata','patata','654646464','patata2','default.png','$2a$10$iZhIyhSSAg4DxztXRfvMAeTi9/MPoMPgJYjuPdokAyvs7fY5LGS9G'),(18,'asasa@hot.com',_binary '','asa','asas','676776777','asas','default.png','$2a$10$2BnCZeMFrE/n2bWw6oYmg.gqa/FVMw6E42FEX7oYk0yd3p1X1vJzi'),(20,'user@hotmail.com',_binary '','User','User','666666666','user2','default.png','$2a$10$HHBiHejEnzupOzxcz5mvrO2aXBXP/NNrqVHW5u1gCL0jQyvvBcTZ2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_seq`
--

DROP TABLE IF EXISTS `users_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_seq`
--

LOCK TABLES `users_seq` WRITE;
/*!40000 ALTER TABLE `users_seq` DISABLE KEYS */;
INSERT INTO `users_seq` VALUES (1);
/*!40000 ALTER TABLE `users_seq` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-28 14:35:17
