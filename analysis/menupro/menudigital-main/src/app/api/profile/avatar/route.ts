import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/profile/avatar
// Body: { avatarUrl: string }
// Allows any authenticated user to update their own profiles.avatar_url
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { avatarUrl } = body;
    if (!avatarUrl || typeof avatarUrl !== 'string') {
      return NextResponse.json({ error: 'Falta avatarUrl' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('[api/profile/avatar] update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, avatar_url: avatarUrl });
  } catch (err) {
    console.error('[api/profile/avatar] unexpected:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
