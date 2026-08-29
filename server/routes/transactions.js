const express = require("express");
const pool = require("../postgres");

const router = express.Router();


// Get user's transactions
router.get("/", async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                amount,
                category,
                type,
                transaction_date AS date
            FROM transactions
            WHERE user_id = $1
            ORDER BY transaction_date DESC
            `,
            [req.session.user.id]
        );

        res.json({
            transactions: result.rows
        });

    } catch (error) {

        console.error(
            "Get transactions error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to load transactions."
        });

    }

});


// Create transaction
router.post("/", async (req, res) => {

    try {

        const {
            title,
            amount,
            category,
            type
        } = req.body;


        if (
            !title ||
            !amount ||
            !category ||
            !["income", "expense"].includes(type)
        ) {

            return res.status(400).json({
                message:
                    "Invalid transaction data."
            });

        }


        const result = await pool.query(
            `
            INSERT INTO transactions
            (
                user_id,
                title,
                amount,
                category,
                type
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                title,
                amount,
                category,
                type,
                transaction_date AS date
            `,
            [
                req.session.user.id,
                title.trim(),
                Number(amount),
                category,
                type
            ]
        );


        res.status(201).json({
            transaction:
                result.rows[0]
        });

    } catch (error) {

        console.error(
            "Create transaction error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to create transaction."
        });

    }

});


// Update transaction
router.put("/:id", async (req, res) => {

    try {

        const {
            title,
            amount
        } = req.body;


        const result = await pool.query(
            `
            UPDATE transactions
            SET
                title = $1,
                amount = $2
            WHERE
                id = $3
                AND user_id = $4
            RETURNING
                id,
                title,
                amount,
                category,
                type,
                transaction_date AS date
            `,
            [
                title.trim(),
                Number(amount),
                req.params.id,
                req.session.user.id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Transaction not found."
            });

        }


        res.json({
            transaction:
                result.rows[0]
        });

    } catch (error) {

        console.error(
            "Update transaction error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to update transaction."
        });

    }

});


// Delete transaction
router.delete("/:id", async (req, res) => {

    try {

        const result = await pool.query(
            `
            DELETE FROM transactions
            WHERE
                id = $1
                AND user_id = $2
            RETURNING id
            `,
            [
                req.params.id,
                req.session.user.id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Transaction not found."
            });

        }


        res.json({
            message:
                "Transaction deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete transaction error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to delete transaction."
        });

    }

});


module.exports = router;