import express from "express";
import { loginProcess, joinProcess } from "../controllers/loginController.js";
const router = express.Router();

// 로그인 페이지
router.get("/", async (request, response) => response.sendFile(`${public}/view/login/login.html`, {request}));

// 회원가입 페이지
router.get("/join", async (request, response) => response.sendFile(`${public}/view/login/join.html`, {request}));

// 로그인 처리
router.post("/loginProcess", loginProcess);

// 회원가입 처리
router.post("/joinProcess", joinProcess);

export default router;
