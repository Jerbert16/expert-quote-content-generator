import { supabase } from '@/app/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, quote, title, expertise } = body;

  if (!name || !quote) {
    return NextResponse.json({ error: 'Name and quote are required.' }, { status: 400 });
  }

  const { error } = await supabase.from('submissions').insert([
    { name, quote, title, expertise }
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
