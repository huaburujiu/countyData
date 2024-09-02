const mysql = require('mysql2/promise'); 
const fs = require('fs');  
const csv = require('csv-parser');  
const util = require('util');  


// 数据库连接池配置  
const poolConfig = {  
    host: 'localhost',  
    user: 'root',  
    password: '123456',  
    database: 'xxzx_oa',  
    waitForConnections: true,  
    connectionLimit: 10, // 连接池中的最大连接数  
    queueLimit: 0 // 连接请求队列的最大长度，0表示无限制  
};
  
// 创建数据库连接池  
const pool = mysql.createPool(poolConfig);  
  
// 读取CSV文件  
const fileStream = fs.createReadStream('./areas.csv');  
  
const csvStream = csv({ headers: true });  

fileStream  
  .pipe(csvStream)  
  .on('data', async (row) => {
    if(row._0){
        try {
            // 从数据库中查询省级和地级名称  
            const [res1]= await pool.execute(`SELECT name FROM province WHERE code = ?`, [row._3]);
            const [res2] = await pool.execute(`SELECT name FROM city WHERE code = ?`, [row._2]);
            if(res1[0] !== undefined && typeof res1[0] === 'object' && res1[0] !== null&&res2[0] !== undefined && typeof res2[0] === 'object' && res2[0] !== null){
                let provinceName = res1[0].name;
                let cityName = res2[0].name;
                // 构建完整的县级名称  
                 const fullCountyName = `${provinceName}${cityName}`+row._1;  
                // 插入县级数据到数据库  
                await pool.execute(`INSERT INTO county (code, name, cityCode, provinceCode) VALUES (?, ?, ?, ?)`, [row._0, fullCountyName, row._2, row._3]);  
                console.log(`Inserted county: ${fullCountyName}`);  
            }

          } catch (err) {  
            console.log(err)
          }
    }
   
  })  
  .on('end', () => {  
    console.log('Done processing CSV file.'); 

  })  
  .on('error', (err) => {  
    console.error('Error reading CSV file:', err);  
  });