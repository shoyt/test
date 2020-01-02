CREATE TABLE "people" 
(
	"id" 		INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"firstName" TEXT(255,0) NOT NULL,
	"lastName" 	TEXT(255,0) NOT NULL,
	"userName"	TEXT(255,0) NOT NULL,
	"password"	TEXT(255,0) NOT NULL
);
CREATE INDEX "userNameIndex" ON people ("userName" COLLATE NOCASE ASC);
INSERT INTO `people` VALUES (NULL, "Steve", "Hoyt", "shoyt", "test");
INSERT INTO `people` VALUES (NULL, "David", "Pens", "dpens", "dpens");
