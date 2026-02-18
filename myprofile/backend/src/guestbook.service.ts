import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

@Injectable()
export class GuestbookService {
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) environment variables.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAll(): Promise<GuestbookEntry[]> {
    const { data, error } = await this.supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []) as GuestbookEntry[];
  }

  async create(name: string, message: string): Promise<GuestbookEntry> {
    const { data, error } = await this.supabase
      .from('guestbook_entries')
      .insert({ name, message })
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as GuestbookEntry;
  }

  async update(
    id: string,
    name: string,
    message: string,
  ): Promise<GuestbookEntry> {
    const { data, error } = await this.supabase
      .from('guestbook_entries')
      .update({ name, message })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Guestbook entry not found');
    }

    return data as GuestbookEntry;
  }

  async delete(id: string): Promise<{ deletedId: string }> {
    const { data, error } = await this.supabase
      .from('guestbook_entries')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Guestbook entry not found');
    }

    return { deletedId: data.id as string };
  }
}
