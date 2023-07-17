import { Router } from "express";
import { authenticateToken } from "../auth/jwt.js";
const router = Router();

router.get('/validate-token', authenticateToken, (req, res) => {
    // Token is valid, return success response or perform additional operations
    res.status(200).json({ success: true, message: "ok" });
});

export default router;