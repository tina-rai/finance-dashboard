require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const {
    createUser,
    findUserByEmail,
    verifyPassword
} = require("./auth");

const pool = require("./postgres");
const transactionRoutes =
    require("./routes/transactions");


    const app = express();

    app.set("trust proxy", 1);
    
    const PORT = process.env.PORT || 5000;


    app.use(
        cors({
            origin: (origin, callback) => {
    
                const allowedOrigins = [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175"
                ];
    
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
    
            },
            credentials: true
        })
    );

app.use(express.json());


app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "lax"
                    : "lax",
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


// =========================
// AUTHENTICATION
// =========================


app.post(
    "/api/auth/signup",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({
                    message:
                        "Name, email, and password are required."
                });

            }


            if (password.length < 6) {

                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters."
                });

            }


            const existingUser =
                await findUserByEmail(email);


            if (existingUser) {

                return res.status(409).json({
                    message:
                        "An account with this email already exists."
                });

            }


            const user =
                await createUser(
                    name.trim(),
                    email.trim(),
                    password
                );


            req.session.user = user;


            res.status(201).json({
                message:
                    "Account created successfully.",
                user
            });

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to create account."
            });

        }

    }
);


app.post(
    "/api/auth/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    message:
                        "Email and password are required."
                });

            }


            const user =
                await findUserByEmail(email);


            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });

            }


            const passwordValid =
                await verifyPassword(
                    password,
                    user.password_hash
                );


            if (!passwordValid) {

                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });

            }


            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };


            res.json({
                message:
                    "Login successful.",
                user: req.session.user
            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            res.status(500).json({
                message:
                    "Unable to login."
            });

        }

    }
);


app.post(
    "/api/auth/logout",
    (req, res) => {

        req.session.destroy(
            (error) => {

                if (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                    return res.status(500).json({
                        message:
                            "Unable to logout."
                    });

                }


                res.json({
                    message:
                        "Logged out successfully."
                });

            }
        );

    }
);


app.get(
    "/api/auth/me",
    (req, res) => {

        if (!req.session.user) {

            return res.status(401).json({
                message:
                    "Not authenticated."
            });

        }


        res.json({
            user: req.session.user
        });

    }
);


// =========================
// AUTH MIDDLEWARE
// =========================


function requireAuth(
    req,
    res,
    next
) {

    if (!req.session.user) {

        return res.status(401).json({
            message:
                "Authentication required."
        });

    }

    next();
}

app.use(
    "/api/transactions",
    requireAuth,
    transactionRoutes
);
// =========================
// DATABASE TEST
// =========================


app.get(
    "/api/health",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    "SELECT NOW()"
                );

            res.json({
                status: "ok",
                database: "connected",
                time: result.rows[0].now
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                status: "error",
                database: "disconnected"
            });

        }

    }
);
// =========================
// SERVE REACT FRONTEND
// =========================

const clientPath = path.join(
    __dirname,
    "..",
    "client",
    "dist"
);

app.use(express.static(clientPath));

app.use(
    (req, res) => {
        res.sendFile(
            path.join(
                clientPath,
                "index.html"
            )
        );
    }
);
app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);