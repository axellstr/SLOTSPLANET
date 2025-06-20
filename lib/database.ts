import { supabase, CASINOS_TABLE, isSupabaseConfigured } from './supabase'
import { Casino } from './types'

export class DatabaseService {
  // Get all casinos
  static async getAllCasinos(): Promise<{ success: boolean; data?: Casino[]; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      const { data, error } = await supabase
        .from(CASINOS_TABLE)
        .select('*')
        .order('rank', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to fetch casinos' }
    }
  }

  // Save all casinos (upsert operation)
  static async saveCasinos(casinos: Casino[]): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      // First, delete all existing records
      const { error: deleteError } = await supabase
        .from(CASINOS_TABLE)
        .delete()
        .neq('id', 0) // Delete all records

      if (deleteError) {
        console.error('Delete error:', deleteError)
        return { success: false, error: deleteError.message }
      }

      // Then insert all new records
      const { error: insertError } = await supabase
        .from(CASINOS_TABLE)
        .insert(casinos)

      if (insertError) {
        console.error('Insert error:', insertError)
        return { success: false, error: insertError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to save casinos' }
    }
  }

  // Add a single casino
  static async addCasino(casino: Casino): Promise<{ success: boolean; data?: Casino; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      const { data, error } = await supabase
        .from(CASINOS_TABLE)
        .insert([casino])
        .select()
        .single()

      if (error) {
        console.error('Insert error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to add casino' }
    }
  }

  // Update a single casino
  static async updateCasino(casino: Casino): Promise<{ success: boolean; data?: Casino; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      const { data, error } = await supabase
        .from(CASINOS_TABLE)
        .update(casino)
        .eq('id', casino.id)
        .select()
        .single()

      if (error) {
        console.error('Update error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to update casino' }
    }
  }

  // Delete a casino
  static async deleteCasino(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      const { error } = await supabase
        .from(CASINOS_TABLE)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to delete casino' }
    }
  }

  // Initialize database with default data (run once)
  static async initializeDatabase(casinos: Casino[]): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured' }
      }

      // Check if data already exists
      const { data: existingData } = await supabase
        .from(CASINOS_TABLE)
        .select('id')
        .limit(1)

      if (existingData && existingData.length > 0) {
        return { success: true } // Data already exists
      }

      // Insert initial data
      const { error } = await supabase
        .from(CASINOS_TABLE)
        .insert(casinos)

      if (error) {
        console.error('Initialize error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to initialize database' }
    }
  }
} 