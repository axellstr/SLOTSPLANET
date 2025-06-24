import { NextApiRequest, NextApiResponse } from 'next';
import { Billboard, ApiResponse } from '../../../lib/types';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

// Default billboard data
const defaultBillboards: Billboard[] = [
  {
    id: 1,
    title: "Exclusive Welcome Bonus",
    subtitle: "Get up to €500 + 200 Free Spins",
    description: "Join now and claim your exclusive welcome package with amazing bonuses and free spins!",
    buttonText: "Claim Now",
    buttonUrl: "#",
    backgroundImage: "/Assets/place.svg",
    isActive: true,
    order: 1
  },
  {
    id: 2,
    title: "VIP Casino Experience",
    subtitle: "Premium Gaming at Its Finest",
    description: "Experience luxury gaming with our VIP program, exclusive games, and personal account managers.",
    buttonText: "Learn More",
    buttonUrl: "#",
    backgroundImage: "/Assets/place.svg",
    isActive: true,
    order: 2
  },
  {
    id: 3,
    title: "Weekly Tournaments",
    subtitle: "Compete for €10,000 Prize Pool",
    description: "Join our weekly casino tournaments and compete against players worldwide for massive prizes!",
    buttonText: "Join Tournament",
    buttonUrl: "#",
    backgroundImage: "/Assets/place.svg",
    isActive: true,
    order: 3
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Billboard[]>>
) {
  try {
    if (req.method === 'GET') {
      // Get billboards
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('billboards')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          return res.status(200).json({
            success: true,
            data: defaultBillboards
          });
        }

        // Map Supabase fields to frontend format
        const mappedData = data ? data.map((billboard: any) => ({
          id: billboard.id,
          title: billboard.title,
          subtitle: billboard.subtitle,
          description: billboard.description,
          buttonText: billboard.buttonText,
          buttonUrl: billboard.buttonUrl,
          backgroundImage: billboard.backgroundImage,
          isActive: billboard.isActive,
          order: billboard.order
        })) : defaultBillboards;

        return res.status(200).json({
          success: true,
          data: mappedData
        });
      } else {
        // Fallback to default data if Supabase is not configured
        return res.status(200).json({
          success: true,
          data: defaultBillboards
        });
      }
    }

    if (req.method === 'POST') {
      // Save billboards
      const { billboards } = req.body;
      
      if (!billboards || !Array.isArray(billboards)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid billboard data'
        });
      }

      if (supabase && isSupabaseConfigured) {
        // Delete all existing billboards
        await supabase.from('billboards').delete().neq('id', 0);
        
        // Map frontend format to Supabase format
        const supabaseBillboards = billboards.map((billboard: Billboard) => ({
          id: billboard.id,
          title: billboard.title,
          subtitle: billboard.subtitle,
          description: billboard.description,
          buttonText: billboard.buttonText,
          buttonUrl: billboard.buttonUrl,
          backgroundImage: billboard.backgroundImage,
          isActive: billboard.isActive,
          order: billboard.order
        }));
        
        // Insert new billboards
        const { error } = await supabase
          .from('billboards')
          .insert(supabaseBillboards);

        if (error) {
          console.error('Supabase insert error:', error);
          return res.status(500).json({
            success: false,
            error: 'Failed to save billboards to database'
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: billboards
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Billboard API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 