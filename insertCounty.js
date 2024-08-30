const mysql = require('mysql');  
const fs = require('fs');  
const csv = require('csv-parser');  
const util = require('util');  
  
// 数据库连接池配置  
const pool = mysql.createPool({  
  host: 'localhost',  
  user: 'root',  
  password: '123456',  
  database: 'xxzx_oa',  
  connectionLimit: 10, // 最大连接数  
  queueLimit: 0        // 连接请求队列最大长度，0 表示无限制  
});  
  
// 转换 pool.getConnection 为返回 Promise 的函数  
const getConnection = util.promisify(pool.getConnection.bind(pool));  
  
// 读取CSV文件  
const fileStream = fs.createReadStream('./areas.csv');  
  
const csvStream = csv({ headers: true });  
  
fileStream  
  .pipe(csvStream)  
  .on('data', async (row) => {  
    try {  
      // 从连接池中获取连接  
      const connection = await getConnection();  
      // 从数据库中查询省级和地级名称  
      const provinceResult = await connection.query(`SELECT name FROM province WHERE code = ?`, row.provinceCode); 

      let provinceName = '';  
      provinceName = provinceResult;
      console.log(provinceName)
      
  
      const cityResult = await connection.query(`SELECT name FROM city WHERE code = ?`, row.cityCode);  
      let cityName = ''; // 默认值  
      cityName = cityResult;
      console.log(cityName)
  
      // 构建完整的县级名称  
      const fullCountyName = `${provinceName}${cityName}${row.name}`;  
  
      // 插入县级数据到数据库  
      await connection.query(`  
        INSERT INTO county (code, name, cityCode, provinceCode)  
        VALUES (?, ?, ?, ?)  
      `, [row.code, fullCountyName, row.cityCode, row.provinceCode]);  
  
      console.log(`Inserted county: ${fullCountyName}`);  
  
      // 释放连接  
      connection.release();  
    } catch (err) {  
      console.error('Error processing row:', err);  
      if (connection) {  
        connection.release();  
      }  
    }  
  })  
  .on('end', () => {  
    console.log('Done processing CSV file.');  
  })  
  .on('error', (err) => {  
    console.error('Error reading CSV file:', err);  
  });