import { Router } from "express";
import { authenticateToken, authorizeRole } from "../auth/jwt.js";
import { roles } from "../utils/roles.js";
const router = Router();

router.get('/validate-token', authenticateToken, (req, res) => {
    // Token is valid, return success response or perform additional operations
    res.status(200).json({ success: true, message: "ok" });
});


router.get('/is-admin', authorizeRole(roles.admin), (req, res) => {
    res.status(200).json({ success: true, message: "ok" });
});

export default router;