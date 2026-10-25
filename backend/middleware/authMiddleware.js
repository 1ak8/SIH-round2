import jwt from 'jsonwebtoken';
import { memoryStore } from '../utils/memoryStore.js';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Support Quick Demo Switcher header / query for seamless role evaluation
    const demoRole = req.headers['x-demo-role'] || req.query.demoRole;
    if (demoRole && ['college', 'ro', 'evc', 'hq'].includes(demoRole)) {
      const demoUser =
        memoryStore.users.find((u) => u.role === demoRole) || {
          _id: `demo_${demoRole}`,
          name: `Demo ${demoRole.toUpperCase()} Officer`,
          email: `${demoRole}@aicte.gov.in`,
          role: demoRole,
          institutionName:
            demoRole === 'college'
              ? 'Apex Institute of Technology, Bhopal'
              : 'AICTE Council',
          region: demoRole === 'ro' ? 'Western' : 'Central',
        };
      req.user = demoUser;
      return next();
    }

    // 2. Standard Bearer JWT verification
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // Default fallback demo user for effortless zero-friction API exploration
      req.user = memoryStore.users[0] || {
        name: 'Demo College User',
        email: 'college@aicte.gov.in',
        role: 'college',
        institutionName: 'Apex Institute of Technology, Bhopal',
        region: 'Central',
      };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aicte_pravah_secure_jwt_secret_sih2026_round2');
    
    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Memory store fallback
    const user = memoryStore.users.find((u) => u.email === decoded.email) || decoded;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed.',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to perform this action. Required: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};
