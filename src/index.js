/**
 * dotenv는 환경변수를 .env파일에 저장하고
 * process.env로 로드하는 의존성 모듈
 */
import dotenv from "dotenv";
// 개발, 운영 분기처리
dotenv.config({ path: process.argv[2] === 'dev' ? '.env.dev' : '.env' });

// 전역상수
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

globalThis.basePath =  __dirname + '/server';
globalThis.public =  __dirname + '/public';
globalThis.rootPath =  __dirname;

// 서버 호스트
const hostname = process.env.HOST_NAME;
// 서버 포트
const port = process.env.PORT;
/**
 * Node.js를 위한 빠르고 개방적인 간결한 웹 프레임워크
 */
import express from "express";
const app = express();

// body-parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * Express 프레임워크를 위한 간단한 세션 관리용 미들웨어
 */
import session from 'express-session';

/**
 * Express용 Redis 세션 스토리지를 제공 미들웨어
 */
import connectRedis from "connect-redis";
let redisStore = connectRedis(session);

// 정적자원
app.use(express.static(__dirname + "/public/assets"));

// 세션필터
import sessionFilter from "./server/config/sessionFilter.js";
app.use(sessionFilter);

// 메인
import main from "./server/routes/main.js";
app.use('/', main);

// 로그인
import login from "./server/routes/login.js";
app.use('/login', login);

//404
app.use((request, response, next) => {
  response.status(404).send("404");
});

//500
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send("500");
});

//서버시작
app.listen(port, () => {
  console.log(`${process.env.NODE_ENV} Server running at http://${hostname}:${port}/`);
});