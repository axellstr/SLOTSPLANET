import { NextApiRequest, NextApiResponse } from 'next';
import { Casino, ApiResponse } from '../../../lib/types';
import { DatabaseService } from '../../../lib/database';
import { initialCasinoData, validateCasino } from '../../../lib/casinoData';
import { isSupabaseConfigured } from '../../../lib/supabase';

// Fallback in-memory storage when Supabase is not configured
let runtimeCasinoData: Casino[] | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Casino[]>>
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Casino[]>>
) {
  try {
    // If Supabase is configured, use it
    if (isSupabaseConfigured) {
      const result = await DatabaseService.getAllCasinos();
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to fetch casino data'
        });
      }

      // If no data exists in database, initialize with default data
      if (!result.data || result.data.length === 0) {
        console.log('No data found, initializing database with default data...');
        const initResult = await DatabaseService.initializeDatabase(initialCasinoData);
        
        if (!initResult.success) {
          return res.status(500).json({
            success: false,
            error: initResult.error || 'Failed to initialize database'
          });
        }

        return res.status(200).json({
          success: true,
          data: initialCasinoData,
          message: 'Database initialized with default casino data'
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      // Fallback to in-memory storage
      const data = runtimeCasinoData || initialCasinoData;
      return res.status(200).json({
        success: true,
        data,
        message: 'Using temporary storage - configure Supabase for persistence'
      });
    }
  } catch (error) {
    console.error('GET Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch casino data'
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Casino[]>>
) {
  try {
    const { casinos } = req.body;

    if (!Array.isArray(casinos)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format. Expected array of casinos.'
      });
    }

    // Validate each casino
    for (let i = 0; i < casinos.length; i++) {
      const errors = validateCasino(casinos[i]);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Casino ${i + 1} validation failed: ${errors.join(', ')}`
        });
      }
    }

    // Ensure each casino has proper rank and id
    const processedCasinos = casinos.map((casino, index) => ({
      ...casino,
      rank: casino.rank || index + 1,
      id: casino.id || Date.now() + index
    }));

    if (isSupabaseConfigured) {
      // Save to Supabase
      const result = await DatabaseService.saveCasinos(processedCasinos);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to save casino data'
        });
      }

      res.status(200).json({
        success: true,
        data: processedCasinos,
        message: 'Casino data saved successfully to database'
      });
    } else {
      // Save to in-memory storage
      runtimeCasinoData = processedCasinos;
      
      res.status(200).json({
        success: true,
        data: processedCasinos,
        message: 'Casino data saved temporarily - configure Supabase for persistence'
      });
    }
  } catch (error) {
    console.error('POST Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save casino data'
    });
  }
} 