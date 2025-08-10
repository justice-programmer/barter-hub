import Link from 'next/link';

type SupabaseUser = {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string;
};

async function getUser(email?: string, uid?: string): Promise<SupabaseUser | null> {
  const query = email ? `email=${email}` : uid ? `uid=${uid}` : '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/get-user-info${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch user:', res.statusText);
    return null;
  }

  const result = await res.json();
  return result.user ?? null;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = typeof searchParams.email === 'string' ? searchParams.email : undefined;
  const uid = typeof searchParams.uid === 'string' ? searchParams.uid : undefined;
  const user = await getUser(email, uid);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-400 flex items-center justify-center font-mono">
        ⚠️ Failed to load user info.
      </div>
    );
  }

  const isOwner = user.email === 'saicoder27@gmail.com';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col justify-center items-center px-6 sm:px-20 py-12 font-sans">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">
          👤
        </div>
        <h1 className="text-lg font-mono text-indigo-400">{user.email}</h1>
        {isOwner && (
          <span className="px-2 py-1 bg-indigo-400 text-zinc-900 font-mono text-xs rounded shadow">
            OWNER
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="text-sm text-zinc-400 mb-6 font-mono">
        <p>User ID: {user.id}</p>
        {user.created_at && <p>Created: {new Date(user.created_at).toLocaleString()}</p>}
        {user.last_sign_in_at && <p>Last Sign-In: {new Date(user.last_sign_in_at).toLocaleString()}</p>}
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/create"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded text-lg font-medium transition-all shadow"
          >
            Create Offer
          </Link>
          <form action="/api/delete-account" method="POST">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded text-lg font-medium transition-all shadow"
            >
              Delete Account (not working)
            </button>
          </form>
        </div>
      )}

      <footer className="mt-20 text-xs text-zinc-600 font-mono">
        Powered by Supabase & SuperCLI✨
      </footer>
    </div>
  );
}
