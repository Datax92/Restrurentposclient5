const { register, login, getAllStaff, createNewStaff, updateStaff, toggleStaffStatus, deleteStaff } = require('../controllers/user.controller');
const { body } = require('express-validator');
const { protectedRoute, isAdmin } = require('../middlewares/auth.middleware');
const router = require('express').Router();

router.post('/register',
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("role").optional().isIn(["admin", "cashier", "client", "kitchen", "waiter"]).withMessage("Invalid role")
    ],
    register);

router.post('/login',
    [
        body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    ],
    login);

router.get('/me', protectedRoute, (req, res) => {
    res.json(req.user);
})

router.post('/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.json({
        success: true,
        message: "User logged out successfully"
    })
})

// Staff Management Routes (Admin Only)
router.get('/staff', protectedRoute, isAdmin, getAllStaff);
router.post('/staff', protectedRoute, isAdmin, createNewStaff);
router.put('/staff/:id', protectedRoute, isAdmin, updateStaff);
router.patch('/staff/:id/status', protectedRoute, isAdmin, toggleStaffStatus);
router.delete('/staff/:id', protectedRoute, isAdmin, deleteStaff);

module.exports = router;
