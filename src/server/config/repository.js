import logger from "./logger.js";
import * as utils from "./utils.js";
import { getConnection } from "./database.js";

// 단건 조회 쿼리문 실행
export const selectOne = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await getConnection();

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
export const selectList = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await getConnection();

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
export const insert = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await getConnection();

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
export const update = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await getConnection();

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
export const del = async (query, oConn) => {
  logger.debug('\n' + query);
  let conn = oConn ? oConn : await getConnection();

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
export const string = value => utils.isEmpty(value) ? 'NULL' : `'${value}'`;

// 숫자 대입
export const int = value => utils.isEmpty(value) ? 0 : value;
