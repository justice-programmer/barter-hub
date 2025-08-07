import { createClient } from '@/utils/supabase/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const uid = searchParams.get('uid');

  if (!email && !uid) {
    return NextResponse.json(
      { error: 'Missing email or uid query parameter.' },
      { status: 400 }
    );
  }

  let userData = null;

  if (uid) {
    const { data, error } = await supabase.auth.getUser(uid);
    if (error || !data?.user) {
      return NextResponse.json(
        { error: error?.message || 'User not found.' },
        { status: 404 }
      );
    }
    userData = data.user;
  } else if (email) {
    const { data, error } = await supabase.auth.getUser(); // gets current user
    if (error || !data?.user || data.user.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match authenticated user.' },
        { status: 403 }
      );
    }
    userData! = data.user;
  }

  // Return only safe public info
  const publicInfo = {
    id: userData!.email,
    created_at: userData!.created_at,
    last_sign_in_at: userData!.last_sign_in_at,
  };

  return NextResponse.json({ user: publicInfo });
}