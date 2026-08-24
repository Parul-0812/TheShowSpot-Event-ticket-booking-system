const express = require("express");
const router = express.Router();
const axios = require("axios");

const otpStore = new Map();

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg";
const CASHFREE_API_VERSION = "2025-01-01";

// ================= SEND OTP =================

router.post("/send-otp", async (req, res) => {
    try {
        const { paymentId } = req.body;

        if (!paymentId) {
            return res.json({
                success: false,
                message: "Payment ID is required"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(paymentId, {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        console.log("Payment OTP generated:", otp);

        res.json({
            success: true,
            message: "OTP generated successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to generate OTP"
        });
    }
});

// ================= VERIFY OTP =================

router.post("/verify-otp", async (req, res) => {
    try {
        const { paymentId, otp } = req.body;

        const stored = otpStore.get(paymentId);

        if (!stored) {
            return res.json({
                success: false,
                message: "OTP expired or not found"
            });
        }

        if (Date.now() > stored.expires) {
            otpStore.delete(paymentId);

            return res.json({
                success: false,
                message: "OTP expired. Please request a new OTP."
            });
        }

        if (stored.otp !== otp) {
            return res.json({
                success: false,
                message: "Incorrect OTP"
            });
        }

        otpStore.delete(paymentId);

        res.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to verify OTP"
        });
    }
});

// ================= CREATE CASHFREE ORDER =================

router.post("/create-cashfree-order", async (req, res) => {
    try {
        const {
            orderId,
            amount,
            customerId,
            customerName,
            customerEmail,
            customerPhone
        } = req.body;

        if (
            !orderId ||
            !amount ||
            !customerId ||
            !customerName ||
            !customerEmail ||
            !customerPhone
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            });
        }

        const response = await axios.post(
            `${CASHFREE_API_URL}/orders`,
            {
                order_id: orderId,
                order_amount: Number(amount),
                order_currency: "INR",

                customer_details: {
                    customer_id: String(customerId),
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: String(customerPhone)
                },

                order_meta: {
                    return_url: `http://localhost:5173/payment?order_id=${orderId}`
                }
            },
            {
                headers: {
                    "x-client-id": CASHFREE_APP_ID,
                    "x-client-secret": CASHFREE_SECRET_KEY,
                    "x-api-version": CASHFREE_API_VERSION,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        res.json({
            success: true,
            orderId: response.data.order_id,
            paymentSessionId: response.data.payment_session_id
        });

    } catch (error) {
        console.log("Cashfree Create Order Error:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: "Unable to create Cashfree payment order",
            error: error.response?.data || error.message
        });
    }
});

// ================= CHECK CASHFREE PAYMENT STATUS =================

router.get("/cashfree-status/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        const response = await axios.get(
            `${CASHFREE_API_URL}/orders/${orderId}`,
            {
                headers: {
                    "x-client-id": CASHFREE_APP_ID,
                    "x-client-secret": CASHFREE_SECRET_KEY,
                    "x-api-version": CASHFREE_API_VERSION,
                    "Accept": "application/json"
                }
            }
        );

        res.json({
            success: true,
            orderStatus: response.data.order_status,
            orderId: response.data.order_id,
            amount: response.data.order_amount
        });

    } catch (error) {
        console.log("Cashfree Status Error:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: "Unable to check Cashfree payment status",
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;