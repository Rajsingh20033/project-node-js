import db from '../config/db.js';
import generateOTP from '../utils/generateOTP.js';
import sendSMS from '../utils/sendSMS.js';

class UserController {
  // Register/Login
  static registerUser = async (req, res) => {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ status: 'error', message: 'Name and mobile are required' });
    }

    const otp = generateOTP();

    try {
      await db.execute(
        `INSERT INTO mtbl_customer_otp (name, mobile, email, otp, is_verify)
         VALUES (?, ?, NULL, ?, ?)
         ON DUPLICATE KEY UPDATE name = ?, otp = ?, is_verify = 0`,
        [name, mobile, otp, false, name, otp]
      );

      await sendSMS(mobile, otp);

      res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Registration Error:', err.message);
      res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
    }
  };

  // OTP Verification
  static verifyUser = async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ status: 'error', message: 'Mobile and OTP are required' });
    }

    try {
      const [rows] = await db.execute(
        `SELECT otp FROM mtbl_customer_otp WHERE mobile = ?`,
        [mobile]
      );

      if (!rows.length) {
        return res.status(404).json({ status: 'failed', message: 'User not found' });
      }

      if (rows[0].otp !== otp) {
        return res.status(401).json({ status: 'failed', message: 'Invalid OTP' });
      }

      await db.execute(
        `UPDATE mtbl_customer_otp SET is_verify = 1 WHERE mobile = ?`,
        [mobile]
      );

      res.status(200).json({ status: 'success', message: 'User verified successfully' });
    } catch (err) {
      console.error('OTP Verification Error:', err.message);
      res.status(500).json({ status: 'error', message: 'Failed to verify OTP' });
    }
  };
}

export default UserController;
