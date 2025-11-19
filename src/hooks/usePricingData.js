import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchModels, searchModels, getModelCount, checkConnection, supabase } from '../services/api/supabase.js';
import { SEARCH_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for managing pricing data with React Query
 * @param {Object} options - Query options
 * @param {string=} options.provider - Filter by provider
 * @param {string=} options.search - Search query
 * @param {Object=} options.sort - Sort configuration
 * @param {number=} options.limit - Limit results
 * @param {number=} options.offset - Offset for pagination
 * @param {boolean=} options.enableCache - Enable caching
 * @returns {Object} Pricing data functionality
 */
export const usePricingData = ({
  provider = 'all',
  search = '',
  sort = { key: 'model_name', direction: 'asc' },
  limit = 50,
  offset = 0,
  enableCache = true,
} = {}) => {
  const queryClient = useQueryClient();

  // Main query for fetching models
  const {
    data: models = [],
    isLoading,
    error,
    refetch,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['models', { provider, search, sort, limit, offset }],
    queryFn: async () => {
      const queryOptions = {
        provider: provider === 'all' ? undefined : provider,
        search: search.trim(),
        sortBy: sort.key,
        sortDirection: sort.direction,
        limit: limit + 1, // Fetch one extra to check if there are more
        offset,
      };

      if (search.trim()) {
        const { data, error } = await searchModels(search.trim(), SEARCH_CONFIG.searchFields);
        if (error) throw error;
        return data || [];
      } else {
        const { data, error } = await fetchModels(queryOptions);
        if (error) throw error;
        return data || [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: enableCache,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('auth') || error?.message?.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for getting total count (for pagination)
  const {
    data: count = 0,
    isLoading: isLoadingCount,
    error: countError,
  } = useQuery({
    queryKey: ['models-count', { provider, search }],
    queryFn: async () => {
      const { count, error } = await getModelCount({
        provider: provider === 'all' ? undefined : provider,
        search: search.trim(),
      });
      if (error) throw error;
      return count;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enableCache,
  });

  // Query for checking database connection
  const {
    data: isConnected = false,
    isLoading: isLoadingConnection,
    error: connectionError,
  } = useQuery({
    queryKey: ['database-connection'],
    queryFn: checkConnection,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Check if there are more results (hasNextPage)
  const hasNextPage = models.length > limit;
  const actualModels = hasNextPage ? models.slice(0, limit) : models;

  // Manual refetch function that clears cache
  const forceRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['models'] });
    await queryClient.invalidateQueries({ queryKey: ['models-count'] });
    return refetch();
  };

  // Prefetch data for better UX
  const prefetchData = (newOptions = {}) => {
    queryClient.prefetchQuery({
      queryKey: ['models', newOptions],
      queryFn: async () => {
        const queryOptions = {
          provider: newOptions.provider === 'all' ? undefined : newOptions.provider,
          search: (newOptions.search || '').trim(),
          sortBy: (newOptions.sort?.key) || 'model_name',
          sortDirection: (newOptions.sort?.direction) || 'asc',
          limit: newOptions.limit || 50,
          offset: newOptions.offset || 0,
        };

        const { data, error } = await fetchModels(queryOptions);
        if (error) throw error;
        return data || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get pagination info
  const paginationInfo = {
    total: count,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(count / limit),
    itemsPerPage: limit,
    hasNextPage,
    hasPreviousPage: offset > 0,
    startIndex: offset + 1,
    endIndex: Math.min(offset + limit, count),
  };

  // Get provider-specific stats
  const providerStats = {
    totalProviders: 0,
    totalModels: count,
    isConnected,
    loadingStates: {
      isLoading,
      isLoadingCount,
      isLoadingConnection,
    },
    errors: {
      mainError: error,
      countError,
      connectionError,
      hasErrors: isError || !!countError || !!connectionError,
    },
  };

  return {
    models: actualModels,
    count,
    paginationInfo,
    providerStats,
    isLoading: isLoading || isLoadingCount,
    error: error || countError || connectionError,
    isError: isError || !!countError || !!connectionError,
    isFetching,
    isConnected,
    refetch,
    forceRefresh,
    prefetchData,
    hasNextPage,
  };
};

// Hook for fetching all models without filters
export const useAllModels = (options = {}) => {
  return useQuery({
    queryKey: ['all-models', options],
    queryFn: async () => {
      const { data, error } = await fetchModels({
        limit: options.limit || 1000,
        sortBy: 'model_name',
        sortDirection: 'asc',
      });
      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false,
  });
};

// Hook for real-time data updates
export const useRealtimePricingData = (options = {}) => {
  const queryClient = useQueryClient();

  // Subscribe to changes in the llm_models table
  const subscribeToChanges = () => {
    const subscription = supabase
      .channel('llm_models_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'llm_models' },
        (payload) => {
          // Invalidate relevant queries when data changes
          queryClient.invalidateQueries({ queryKey: ['models'] });
          queryClient.invalidateQueries({ queryKey: ['models-count'] });
        }
      )
      .subscribe();

    return subscription;
  };

  // Get base pricing data
  const baseData = usePricingData(options);

  // Auto-subscribe to changes if enabled
  React.useEffect(() => {
    if (options.enableRealtime !== false) {
      const subscription = subscribeToChanges();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [options.enableRealtime]);

  return {
    ...baseData,
    subscribeToChanges,
  };
};

export default usePricingData;