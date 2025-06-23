// DB - MARIADB
const mariadb = require("mariadb");

console.log("require database");

// DB 정보
const info = {
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_UESR,
  password: process.env.MARIA_PASSWORD,
  database: process.env.MARIA_DATABASE,
  connectionLimit: 50,
  rowsAsArray: false
}

// Pool 초기화
const pool = mariadb.createPool(info);
exports.getConnection = async function(){
  try{
    return await pool.getConnection();
  }catch(err){
    throw new Error(err);
  }
}