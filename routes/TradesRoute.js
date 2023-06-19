import { Router } from "express";
import Trade from "../models/trade.js";

const router = Router();

/**
 * This is a test
 */
router.post("/addTrade", async (req, res) => {
    try {
        const data = req.body;
        const result = await Trade.create(data);
        res.status(200).send(`Trade ${result._id} added succefully`);

    } catch (err) {
        console.log(err);
        res.status(500).send('Error when adding a trade');
    }

});


export default router;