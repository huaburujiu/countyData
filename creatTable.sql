 -- 分条执行
CREATE TABLE province (  
    id INT AUTO_INCREMENT PRIMARY KEY,  
    code INT NOT NULL UNIQUE,  
    name VARCHAR(255) NOT NULL  
);  

 -- 分条执行
CREATE TABLE city (  
    id INT AUTO_INCREMENT PRIMARY KEY,  
    code INT NOT NULL UNIQUE,  
    name VARCHAR(255) NOT NULL,  
    provinceCode INT,  
    FOREIGN KEY (provinceCode) REFERENCES province(code)  
);  

 -- 分条执行
CREATE TABLE county (  
    id INT AUTO_INCREMENT PRIMARY KEY,  
    code INT NOT NULL UNIQUE,  
    name VARCHAR(255) NOT NULL, -- 这里我们将通过触发器或应用程序代码来设置完整的名称  
    cityCode INT,  
    provinceCode INT,  
    FOREIGN KEY (cityCode) REFERENCES city(code),  
    FOREIGN KEY (provinceCode) REFERENCES province(code)  
);