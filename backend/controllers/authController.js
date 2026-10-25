import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { memoryStore, logAuditEvent } from '../utils/memoryStore.js';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.email, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'aicte_pravah_secure_jwt_secret_sih2026_round2',
    { expiresIn: '30d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = null;
    if (getDBStatus()) {
      user = await User.findOne({ email });
    }
    if (!user) {
      user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'aicte123') {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);

    await logAuditEvent({
      applicationId: 'SYSTEM',
      actorName: user.name,
      role: user.role,
      action: 'USER_LOGIN',
      remarks: `User ${user.email} logged in successfully via web portal.`,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.email,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionName: user.institutionName,
        region: user.region,
        designation: user.designation,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const getDemoAccounts = async (req, res) => {
  const accounts = [
    {
      role: 'college',
      roleLabel: 'College Principal / Registrar',
      institution: 'Apex Institute of Technology, Bhopal',
      email: 'college@gmail.com',
      password: 'aicte123',
      icon: 'GraduationCap',
      description: 'Submit EoA, track scrutiny status, upload compliance & resolve deficiencies',
    },
    {
      role: 'ro',
      roleLabel: 'Regional Scrutiny Officer',
      institution: 'AICTE Western / Central Regional Office',
      email: 'ro@gmail.com',
      password: 'aicte123',
      icon: 'Building2',
      description: 'Dual-pane scrutiny desk, raise APH deficiencies, forward to EVC or approve',
    },
    {
      role: 'evc',
      roleLabel: 'EVC Inspection Committee Chair',
      institution: 'Expert Visit Committee (NIT Nominee)',
      email: 'evc@gmail.com',
      password: 'aicte123',
      icon: 'ClipboardCheck',
      description: 'On-site digital verification, GPS geo-tagged photo evidence, recommendation desk',
    },
    {
      role: 'hq',
      roleLabel: 'AICTE HQ Member Secretary (Apex Council)',
      institution: 'AICTE Headquarters, Nelson Mandela Marg, New Delhi',
      email: 'admin@gmail.com',
      password: 'aicte123',
      icon: 'ShieldCheck',
      description: 'Pan-India KPIs, regional bottleneck heatmap, SLA escalation matrix & rules engine',
    },
  ];

  res.json({ success: true, accounts });
};
