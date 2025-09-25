import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const addressRaw: unknown = body?.address;
    const fidRaw: unknown = body?.fid;
    const usernameRaw: unknown = body?.username;
    const pfpUrlRaw: unknown = body?.pfpUrl;

    const address = typeof addressRaw === 'string' && addressRaw.length > 0 ? addressRaw.toLowerCase() : null;
    const fid = typeof fidRaw === 'number' ? fidRaw : null;
    const username = typeof usernameRaw === 'string' ? usernameRaw : null;
    const pfp_url = typeof pfpUrlRaw === 'string' ? pfpUrlRaw : null;

    if (!address && !fid) {
      return NextResponse.json({ ok: false, error: 'address or fid required' }, { status: 400 });
    }

    const supabase = supabaseServer();

    // Upsert into users on unique fid/address
    // Prefer fid if available; otherwise use address as unique key
    let userId: string | null = null;

    if (fid) {
      const { data: existingByFid } = await supabase
        .from('users')
        .select('id')
        .eq('fid', fid)
        .limit(1)
        .maybeSingle();

      if (existingByFid?.id) {
        userId = existingByFid.id;
        await supabase
          .from('users')
          .update({ address: address ?? undefined, username: username ?? undefined, pfp_url: pfp_url ?? undefined })
          .eq('id', userId);
      } else {
        const { data: inserted, error } = await supabase
          .from('users')
          .insert({ fid, address, username, pfp_url })
          .select('id')
          .single();
        if (!error && inserted?.id) userId = inserted.id;
      }
    }

    if (!userId && address) {
      const { data: existingByAddr } = await supabase
        .from('users')
        .select('id')
        .eq('address', address)
        .limit(1)
        .maybeSingle();

      if (existingByAddr?.id) {
        userId = existingByAddr.id;
        await supabase
          .from('users')
          .update({ fid: fid ?? undefined, username: username ?? undefined, pfp_url: pfp_url ?? undefined })
          .eq('id', userId);
      } else {
        const { data: inserted, error } = await supabase
          .from('users')
          .insert({ address, fid, username, pfp_url })
          .select('id')
          .single();
        if (!error && inserted?.id) userId = inserted.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Ensure user_progress row exists
    await supabase
      .from('user_progress')
      .upsert({ user_id: userId }, { onConflict: 'user_id' });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


