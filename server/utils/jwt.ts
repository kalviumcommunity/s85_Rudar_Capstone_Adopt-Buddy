import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookies = (res: Response) => {
  res.cookie('accessToken', '', { maxAge: 0, httpOnly: true, secure: true, sameSite: 'none' });
  res.cookie('refreshToken', '', { maxAge: 0, httpOnly: true, secure: true, sameSite: 'none' });
};
