
import jwt from 'jsonwebtoken';

const generateJWTToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET; // Ensure this is in your environment variables

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export default generateJWTToken;
