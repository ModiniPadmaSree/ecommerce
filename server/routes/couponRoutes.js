const express = require('express');
const router = express.Router();
const Coupon = require('../models/couponModel');

// GET /api/v1/coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      expiresAt: { $gt: new Date() }
    }).select('code discountPercent expiresAt');

    res.status(200).json(coupons);
  } catch (error) {
    console.error('Fetch coupons error:', error);

    res.status(500).json({
      message: 'Failed to fetch coupons'
    });
  }
});

// POST /api/v1/coupons/apply
router.post('/apply', async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase()
    });

    if (!coupon) {
      return res.status(404).json({
        message: 'Invalid coupon code'
      });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        message: 'Coupon has expired'
      });
    }

    res.status(200).json({
      discountPercent: coupon.discountPercent
    });

  } catch (error) {
    console.error('Apply coupon error:', error);

    res.status(500).json({
      message: 'Failed to apply coupon'
    });
  }
});

module.exports = router;