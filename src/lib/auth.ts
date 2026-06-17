import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'warriors_market_jwt_secret_key_2026_xyz';

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('warriors_admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { id: string; username: string };
  } catch (err) {
    redirect('/admin/login');
  }
}
