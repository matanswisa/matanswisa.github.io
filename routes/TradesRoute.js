import { Router } from "express";
import Trade from "../models/trade.js";

const router = Router();

/**
 * This is a test
 */
router.post("/addTrade", async (req, res) => {

    await Trade.create({ ...req.body });

    res.status(200).send(`symbol ${req.body.symbol} added`)
});


export default router;