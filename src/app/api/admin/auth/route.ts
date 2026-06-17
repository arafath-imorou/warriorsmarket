import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'warriors_market_jwt_secret_key_2026_xyz';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Veuillez saisir votre identifiant et votre mot de passe.' },
        { status: 400 }
      );
    }

    // 1. Fetch admin from Supabase
    const { data: admin, error } = await supabase
      .from('warriors_admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // 2. Compare password hashes
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 4. Set HttpOnly Cookie (Next.js 15 asynchronous cookies)
    const cookieStore = await cookies();
    cookieStore.set('warriors_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin auth error:', err);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('warriors_admin_token');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue lors de la déconnexion.' },
      { status: 500 }
    );
  }
}
