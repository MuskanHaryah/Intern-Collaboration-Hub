import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (userId, rememberMe = false) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : '1d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'intern',
      department: department || '',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token (30d if rememberMe, 1d otherwise)
    const token = generateToken(user._id, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('projects', 'name description');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.toPublicProfile(),
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, department, skills, avatar } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (department !== undefined) updateFields.department = department;
    if (skills) updateFields.skills = skills;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toPublicProfile(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user not found (security: don't reveal if email exists)
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (frontend URL)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #9333ea, #ec4899); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">CollabHub</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            You requested a password reset for your CollabHub account. 
            Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #9333ea, #ec4899); color: white; 
                      padding: 14px 32px; border-radius: 8px; text-decoration: none; 
                      font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in <strong>10 minutes</strong>.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this, please ignore this email and your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            CollabHub - Intern Collaboration Platform
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'CollabHub - Password Reset Request',
        html,
      });

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password (at least 6 characters)',
      });
    }

    // Hash the token from URL params
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new login token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        user: user.toPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
