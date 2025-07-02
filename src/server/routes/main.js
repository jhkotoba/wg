import { Router } from 'express';
import model from '../config/model.js';

const router = Router();

router.get('/', async (request, response) => response.send(await model.modelAndView('main/main.html', {request})));

export default router;