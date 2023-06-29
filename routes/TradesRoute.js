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
        console.err(err);
        res.status(500).send('Error when adding a trade');
    }
});


router.post("/editTrade", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const result = await Trade.findByIdAndUpdate(data.tradeId, { data });
        res.status(200).send(`Trade ${result._id} added succefully`);

    } catch (err) {
        console.err(err);
        res.status(500).send('Error when adding a trade');
    }
});


router.get('/fetchTrades', async (req, res) => {
    try {
        const trades = await Trade.find({});
        res.status(200).json(trades);
    } catch (err) {
        console.err(err);
        res.status(500).send(err);
    }
});

router.delete('/deleteTrade', async (req, res) => {
    try {
        const { tradeId } = req.body;
        if (tradeId) {
            const result = await Trade.deleteOne({ _id: tradeId });
            if (result) {
                res.status(200).send('Trade has been deleted');
            } else {
                res.status(400).send('Trade couldn\'t be deleted , there was a problem.');
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
})


export default router;