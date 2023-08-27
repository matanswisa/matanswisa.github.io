import { Router } from "express";
import Messages from "../models/messages.js";
import { authenticateToken } from "../auth/jwt.js";
const router = Router();



router.get('/messages',authenticateToken, async (req, res) => {
    try {
        const messages = await Messages.find({});
        console.log(messages);


         res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });


export default router;