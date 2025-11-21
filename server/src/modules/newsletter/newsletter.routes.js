import express from 'express';
import { body, validationResult } from 'express-validator';
import emailService from '../../common/utils/email.service.js';

const router = express.Router();

router.post(
  '/subscribe',
  body('email').isEmail().withMessage('A valid email is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid request', errors: errors.array() });
    }

    const { email } = req.body;
    try {
      const result = await emailService.sendNewsletterSubscription(email);
      if (result.success) {
        return res.status(200).json({ message: 'Subscription received' });
      }
      return res.status(500).json({ message: result.message || 'Failed to send subscription email' });
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
