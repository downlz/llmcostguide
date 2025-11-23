import { useQuery } from '@tanstack/react-query';
import { getProviders } from '../services/api/supabase.js';

export const useProviders = () => {
  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await getProviders();
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};