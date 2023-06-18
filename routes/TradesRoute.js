import { Router } from "express";

const router = Router();

/**
 * This is a test
 */
router.post("/addTrade", (req, res) => {
    const { symbol, price, date, typeOfPosition } = req.body;



    res.status(200).send(`symbol ${symbol} added`)
});


export default router;