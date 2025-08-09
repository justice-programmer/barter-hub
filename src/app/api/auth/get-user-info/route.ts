import { createClient } from '@/utils/supabase/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const uid = searchParams.get('uid');

  let userData = null;

  if (uid) {
    const { data, error } = await supabase.auth.getUser(uid);
    if (error || !data?.user) {
      return NextResponse.json(
        { error: error?.message || 'User not found by UID.' },
        { status: 404 }
      );
    }
    userData = data.user;
  } else if (email) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user || data.user.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match authenticated user.' },
        { status: 403 }
      );
    }
    userData = data.user;
  } else {
    // No query params — fallback to current authenticated user
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json(
        { error: 'No authenticated user found.' },
        { status: 401 }
      );
    }
    userData = data.user;
  }

  const publicInfo = {
    id: userData.id,
    email: userData.email,
    created_at: userData.created_at,
    last_sign_in_at: userData.last_sign_in_at,
  };

  return NextResponse.json({ user: publicInfo });
}