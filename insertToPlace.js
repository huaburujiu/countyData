const mysql = require('mysql2/promise');
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

// 定义一个异步函数来执行数据库操作  
async function processCounties() {
    for (let id = 1; id <= 2978; id++) {
        try {
            const [res] = await pool.execute(`SELECT name, code FROM county WHERE id = ?`, [id]);
            if (res[0] !== undefined && res[0] !== null) {
                const { code, name } = res[0];
                // 插入县级数据到数据库  
                await pool.execute(`INSERT INTO place (id, name) VALUES (?, ?)`, [code, name]);
                console.log(`Inserted place: ${name}`);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

// 调用异步函数  
processCounties();