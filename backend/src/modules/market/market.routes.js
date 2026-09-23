import {Router} from 'express'
import { getForexCandles } from './market.controllers.js';

const marketRoutes = Router()
marketRoutes.get('/forex', getForexCandles)
export default marketRoutes;