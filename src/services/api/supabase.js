import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../../utils/constants.js';

/**
 * Supabase API client configuration
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Database service functions
 */

/**
 * Fetch models from Supabase with optional filtering
 * @param {Object} options - Query options
 * @param {string=} options.provider - Filter by provider
 * @param {string=} options.search - Search query
 * @param {number=} options.limit - Limit results
 * @param {number=} options.offset - Offset for pagination
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const fetchModels = async (options = {}) => {
  try {
    let query = supabase
      .from('llm_models')
      .select('*')
      .eq('is_active', true);

    // Apply provider filter
    if (options.provider && options.provider !== 'all') {
      query = query.eq('provider', options.provider);
    }

    // Apply search filter
    if (options.search && options.search.trim()) {
      const searchTerm = options.search.trim().toLowerCase();
      query = query.or(
        `model_name.ilike.%${searchTerm}%,provider.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    // Apply sorting
    if (options.sortBy && options.sortDirection) {
      query = query.order(options.sortBy, { 
        ascending: options.sortDirection === 'asc' 
      });
    } else {
      query = query.order('model_name', { ascending: true });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 25) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching models:', error);
    return { data: [], error };
  }
};

/**
 * Search models with full-text search
 * @param {string} query - Search query
 * @param {Array<string>=} searchFields - Fields to search in
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const searchModels = async (query, searchFields = []) => {
  try {
    if (!query || query.trim().length === 0) {
      return fetchModels();
    }

    const searchTerm = query.trim().toLowerCase();
    let searchQuery = supabase
      .from('llm_models')
      .select('*')
      .eq('is_active', true);

    // Build search conditions
    const searchConditions = searchFields.map(field => 
      `${field}.ilike.%${searchTerm}%`
    ).join(',');

    searchQuery = searchQuery.or(searchConditions);

    const { data, error } = await searchQuery;

    if (error) {
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error searching models:', error);
    return { data: [], error };
  }
};

/**
 * Get model by ID
 * @param {string} modelId - Model ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getModelById = async (modelId) => {
  try {
    const { data, error } = await supabase
      .from('llm_models')
      .select('*')
      .eq('id', modelId)
      .eq('is_active', true)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching model:', error);
    return { data: null, error };
  }
};

/**
 * Get models by provider
 * @param {string} provider - Provider name
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getModelsByProvider = async (provider) => {
  try {
    const { data, error } = await supabase
      .from('llm_models')
      .select('*')
      .eq('provider', provider)
      .eq('is_active', true)
      .order('model_name', { ascending: true });

    if (error) {
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching models by provider:', error);
    return { data: [], error };
  }
};

/**
 * Get unique providers
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getProviders = async () => {
  try {
    const { data, error } = await supabase
      .from('llm_models')
      .select('provider')
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    // Extract unique providers
    const providers = [...new Set(data.map(item => item.provider))];
    
    return { data: providers, error: null };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return { data: [], error };
  }
};

/**
 * Bulk import models
 * @param {Array} models - Array of model objects
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export const importModels = async (models) => {
  try {
    if (!Array.isArray(models) || models.length === 0) {
      throw new Error('No models to import');
    }

    // Transform models for database insertion
    const transformedModels = models.map(model => ({
      ...model,
      id: model.id || crypto.randomUUID(),
      added_on: model.added_on || new Date().toISOString(),
      updated_on: new Date().toISOString(),
      is_active: true,
    }));

    // Upsert models (insert or update if exists)
    const { data, error } = await supabase
      .from('llm_models')
      .upsert(transformedModels, { 
        onConflict: 'external_model_id,provider',
        ignoreDuplicates: false 
      });

    if (error) {
      throw error;
    }

    // Log the import operation
    await logSyncOperation({
      provider: 'manual',
      sync_type: 'csv_import',
      records_added: transformedModels.length,
      records_updated: 0,
      status: 'completed',
    });

    return { data: { count: transformedModels.length }, error: null };
  } catch (error) {
    console.error('Error importing models:', error);
    
    // Log failed import
    await logSyncOperation({
      provider: 'manual',
      sync_type: 'csv_import',
      records_added: 0,
      records_updated: 0,
      status: 'failed',
      error_message: error.message,
    });

    return { data: null, error };
  }
};

/**
 * Get sync logs
 * @param {number=} limit - Number of logs to fetch
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getSyncLogs = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('data_sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return { data: [], error };
  }
};

/**
 * Log sync operation
 * @param {Object} logData - Log data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const logSyncOperation = async (logData) => {
  try {
    const { data, error } = await supabase
      .from('data_sync_logs')
      .insert([{
        ...logData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error logging sync operation:', error);
    return { data: null, error };
  }
};

/**
 * Get model count with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<{count: number, error: Error|null}>}
 */
export const getModelCount = async (filters = {}) => {
  try {
    let query = supabase
      .from('llm_models')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (filters.provider && filters.provider !== 'all') {
      query = query.eq('provider', filters.provider);
    }

    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();
      query = query.or(
        `model_name.ilike.%${searchTerm}%,provider.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error getting model count:', error);
    return { count: 0, error };
  }
};

/**
 * Check database connection
 * @returns {Promise<boolean>}
 */
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('llm_models').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

export default {
  fetchModels,
  searchModels,
  getModelById,
  getModelsByProvider,
  getProviders,
  importModels,
  getSyncLogs,
  logSyncOperation,
  getModelCount,
  checkConnection,
};