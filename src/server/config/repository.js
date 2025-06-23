const logger = require(`${basePath}/config/logger.js`);
const utils = require(`${basePath}/config/utils.js`);
const db = require(`${basePath}/config/database.js`);

// 단건 조회 쿼리문 실행
exports.selectOne = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await db.getConnection();

  try {
    let rows = await conn.query(query);    
    if(rows.length > 1){
      logger.error('SELECT ONE ERROR:: TOO_MAYN_RESULT');
      throw new Error('TOO_MAYN_RESULT');
    }else{
      return rows[0];
    }
  }catch(error){
    logger.error('SELECT ONE ERROR::', error);
    if(conn){
      await conn.rollback();
      conn.release();
    }
    throw error;
  }finally{
    if (!oConn && conn) conn.release();
  }
};

// 복수건 조회
exports.selectList = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await db.getConnection();

  try {
    return await conn.query(query);
  }catch(error){
    logger.error('SELECT LIST ERROR::', error);
    if(conn){
      await conn.rollback();
      conn.release();
    }
    throw error;
  }finally{
    if (!oConn && conn) conn.release();
  }
}

// 저장
exports.insert = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await db.getConnection();

  try {
    let result = await conn.query(query);
    return result;
  }catch(error){
    logger.error('INSERT ERROR::', error);
    if(conn){
      await conn.rollback();
      conn.release();
    }
    throw(error);
  }finally{
    if (!oConn && conn) conn.release();
  }
}

// 수정
exports.update = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await db.getConnection();

  try {
    let result = await conn.query(query);
    return result;
  }catch(error){
    logger.error('UPDATE ERROR::', error);
    if(conn){
      await conn.rollback();
      conn.release();
    }
    throw(error);
  }finally{
    if (!oConn && conn) conn.release();
  }
}

// 삭제
exports.delete = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await db.getConnection();

  try {
    let result = await conn.query(query);
    return result;
  }catch(error){
    logger.error('DELETE ERROR::', error);
    if(conn){
      await conn.rollback();
      conn.release();
    }
    throw(error);
  }finally{
    if (!oConn && conn) conn.release();
  }
}

// 문자대입
exports.string = value => utils.isEmpty(value) ? 'NULL' : `'${value}'`;

// 숫자 대입
exports.int = value => utils.isEmpty(value) ? 0 : value;