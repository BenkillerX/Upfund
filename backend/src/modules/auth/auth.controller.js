import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../utils/generateToken.js";

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
         const token = generateToken(user);

        return res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
        message: error.message,
        error: error
    });
}
}
export function login(params) {
    
}
export function getCurrentUser(params) {
    
}