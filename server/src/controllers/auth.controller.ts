import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { PropertyOwnerProfile } from '../models/PropertyOwnerProfile';
import { BrokerProfile } from '../models/BrokerProfile';
import { AuthRequest } from '../middleware/auth.middleware';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!['PROPERTY_OWNER', 'BROKER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      role
    });
    
    await user.save();

    if (role === 'PROPERTY_OWNER') {
      await new PropertyOwnerProfile({ userId: user._id }).save();
    } else if (role === 'BROKER') {
      const { businessName, experienceYears, brokerId } = req.body;
      if (!brokerId || !businessName || experienceYears === undefined) {
         return res.status(400).json({ message: 'Broker fields (brokerId, businessName, experienceYears) required' });
      }
      await new BrokerProfile({
        userId: user._id,
        brokerId,
        businessName,
        experienceYears,
        serviceAreas: []
      }).save();
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const brokerLogin = async (req: Request, res: Response) => {
  try {
    const { brokerId, password } = req.body;

    const brokerProfile = await BrokerProfile.findOne({ brokerId }).populate('userId');
    if (!brokerProfile) {
      return res.status(401).json({ message: 'Invalid Broker ID or password' });
    }

    const user: any = brokerProfile.userId;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Broker ID or password' });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brokerId
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, licenseNumber } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, email, phone } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'BROKER' && licenseNumber) {
      await BrokerProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: { brokerId: licenseNumber } }, // assuming brokerId is used for licenseNumber for now
        { new: true }
      );
    }

    // Return updated user data (similar structure to what login returns)
    let extraData = {};
    if (user.role === 'BROKER') {
      const brokerProfile = await BrokerProfile.findOne({ userId: user._id });
      if (brokerProfile) {
        extraData = { brokerId: brokerProfile.brokerId };
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ...extraData
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    console.log(`\n\n=== PASSWORD RESET LINK ===\nhttp://localhost:5173/reset-password?token=${resetToken}\n===========================\n\n`);

    res.json({ message: 'Password reset link has been sent to your email (check server console for dev)' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
