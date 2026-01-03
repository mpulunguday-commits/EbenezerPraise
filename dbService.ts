
import { createClient } from '@supabase/supabase-js';

/**
 * Ebenezer Backend Persistence Service
 * Integrated with Supabase for cloud-based data management.
 */

const SUPABASE_URL = 'https://pmlrhmkybhbgknuuuwee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbHJobWt5YmhiZ2tudXV1d2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTYyOTAsImV4cCI6MjA4Mjk5MjI5MH0.w8VUOWTYJOUKvDb84rGBNyvrkCRAS5i4X4U-YZOoVSk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  /**
   * Fetch all records from a Supabase table
   */
  async fetchAll(table: string) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        // PostGrest error code 42P01 means "relation does not exist" (table missing)
        if (error.code === '42P01') {
           throw new Error(`SCHEMA_MISSING:${table}`);
        }
        console.error(`Supabase Fetch Error [${table}]:`, error.message);
        return [];
      }
      return data || [];
    } catch (e: any) {
      if (e.message?.startsWith('SCHEMA_MISSING')) {
        throw e;
      }
      console.error(`Network/Client Error [${table}]:`, e);
      return [];
    }
  },

  /**
   * Upsert data into a Supabase table. 
   */
  async upsert(table: string, data: any) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    try {
      const { error } = await supabase
        .from(table)
        .upsert(data);

      if (error) {
        if (error.code === '42P01') {
          throw new Error(`SCHEMA_MISSING:${table}`);
        }
        console.error(`Supabase Upsert Error [${table}]:`, error.message);
      }
    } catch (e: any) {
      if (e.message?.startsWith('SCHEMA_MISSING')) {
        throw e;
      }
      console.error(`Network/Client Error [${table}]:`, e);
    }
  },

  /**
   * Delete a specific ID from a Supabase table
   */
  async delete(table: string, id: string) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Supabase Delete Error [${table}]:`, error.message);
      }
    } catch (e) {
      console.error(`Network/Client Error [${table}]:`, e);
    }
  }
};
