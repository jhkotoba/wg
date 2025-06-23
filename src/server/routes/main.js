import express from "express";
import { modelAndView } from "../config/model.js";
const router = express.Router();

router.get('/', async (request, response) => response.send(await modelAndView('main/main.html', {request})));

router.get('/logout', (request, response) => {
    request.session.destroy();
    response.sendFile(`${public}/view/login/login.html`);
});

export default router;


