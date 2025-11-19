import Papa from 'papaparse';
import { Model } from '../../types/index.js';

/**
 * CSV Import Service for LLM model data
 */

/**
 * Parse CSV file and validate data
 * @param {File} file - CSV file to parse
 * @returns {Promise<{data: Array, errors: Array}>}
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names
        const headerMap = {
          'model_name': 'model_name',
          'model name': 'model_name',
          'provider': 'provider',
          'context_limit': 'context_limit',
          'context limit': 'context_limit',
          'input_price': 'input_price_per_1M_tokens',
          'input price': 'input_price_per_1M_tokens',
          'output_price': 'output_price_per_1M_tokens',
          'output price': 'output_price_per_1M_tokens',
          'caching_price': 'caching_price_per_1M_tokens',
          'caching price': 'caching_price_per_1M_tokens',
          'model_type': 'model_type',
          'model type': 'model_type',
          'type': 'model_type',
          'context_window': 'context_window',
          'context window': 'context_window',
          'description': 'description',
          'added_on': 'added_on',
          'added on': 'added_on',
        };
        return headerMap[header.toLowerCase()] || header.toLowerCase();
      },
      complete: (results) => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Validate model data
 * @param {Object} model - Model object to validate
 * @param {number} rowNumber - Row number for error reporting
 * @returns {Object} Validation result
 */
export const validateModelData = (model, rowNumber) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!model.model_name || model.model_name.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'model_name',
      message: 'Model name is required',
      data: model
    });
  }

  if (!model.provider || model.provider.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'provider',
      message: 'Provider is required',
      data: model
    });
  } else {
    const validProviders = ['OpenRouter', 'TogetherAI', 'Anthropic', 'OpenAI', 'Google'];
    if (!validProviders.includes(model.provider)) {
      warnings.push({
        row: rowNumber,
        field: 'provider',
        message: `Provider "${model.provider}" may not be supported`,
        data: model
      });
    }
  }

  // Validate numeric fields
  if (model.context_limit) {
    const contextLimit = parseInt(model.context_limit);
    if (isNaN(contextLimit) || contextLimit <= 0) {
      errors.push({
        row: rowNumber,
        field: 'context_limit',
        message: 'Context limit must be a positive number',
        data: model
      });
    } else {
      model.context_limit = contextLimit;
    }
  }

  if (model.input_price_per_1M_tokens) {
    const inputPrice = parseFloat(model.input_price_per_1M_tokens);
    if (isNaN(inputPrice) || inputPrice < 0) {
      errors.push({
        row: rowNumber,
        field: 'input_price_per_1M_tokens',
        message: 'Input price must be a positive number',
        data: model
      });
    } else {
      model.input_price_per_1M_tokens = inputPrice;
    }
  }

  if (model.output_price_per_1M_tokens) {
    const outputPrice = parseFloat(model.output_price_per_1M_tokens);
    if (isNaN(outputPrice) || outputPrice < 0) {
      errors.push({
        row: rowNumber,
        field: 'output_price_per_1M_tokens',
        message: 'Output price must be a positive number',
        data: model
      });
    } else {
      model.output_price_per_1M_tokens = outputPrice;
    }
  }

  if (model.caching_price_per_1M_tokens && model.caching_price_per_1M_tokens !== '') {
    const cachingPrice = parseFloat(model.caching_price_per_1M_tokens);
    if (isNaN(cachingPrice) || cachingPrice < 0) {
      errors.push({
        row: rowNumber,
        field: 'caching_price_per_1M_tokens',
        message: 'Caching price must be a positive number or empty',
        data: model
      });
    } else {
      model.caching_price_per_1M_tokens = cachingPrice;
    }
  } else {
    model.caching_price_per_1M_tokens = null;
  }

  // Validate model type
  if (model.model_type) {
    const validTypes = ['Text', 'Images', 'Videos', 'Embeddings'];
    if (!validTypes.includes(model.model_type)) {
      warnings.push({
        row: rowNumber,
        field: 'model_type',
        message: `Model type "${model.model_type}" should be one of: ${validTypes.join(', ')}`,
        data: model
      });
    }
  } else {
    // Default to Text if not provided
    model.model_type = 'Text';
  }

  // Generate context window if not provided
  if (model.context_limit && !model.context_window) {
    model.context_window = formatContextWindow(model.context_limit);
  }

  // Set default values for optional fields
  if (!model.description) {
    model.description = '';
  }
  if (!model.external_model_id) {
    model.external_model_id = model.model_name?.toLowerCase().replace(/\s+/g, '-') || '';
  }
  if (!model.added_on) {
    model.added_on = new Date().toISOString();
  }
  model.updated_on = new Date().toISOString();
  model.is_active = true;
  model.id = crypto.randomUUID();

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    model
  };
};

/**
 * Transform raw CSV data to model format
 * @param {Array} rawData - Raw CSV data
 * @returns {Object} Transform result with models and errors
 */
export const transformModels = (rawData) => {
  const models = [];
  const allErrors = [];
  const allWarnings = [];

  rawData.forEach((row, index) => {
    const rowNumber = index + 1; // CSV row number (1-based)
    const validation = validateModelData(row, rowNumber);

    if (validation.isValid) {
      models.push(validation.model);
    }

    allErrors.push(...validation.errors);
    allWarnings.push(...validation.warnings);
  });

  return {
    models,
    errors: allErrors,
    warnings: allWarnings,
    stats: {
      totalRows: rawData.length,
      validRows: models.length,
      errorRows: allErrors.length,
      warningRows: allWarnings.length
    }
  };
};

/**
 * Format context window size
 * @param {number} limit - Context limit
 * @returns {string} Formatted context window
 */
const formatContextWindow = (limit) => {
  if (limit >= 1000000) {
    return `${(limit / 1000000).toFixed(1)}M`;
  } else if (limit >= 1000) {
    return `${(limit / 1000).toFixed(0)}K`;
  } else {
    return limit.toString();
  }
};

/**
 * Download CSV template
 */
export const downloadTemplate = () => {
  const template = [
    {
      model_name: 'GPT-4 Turbo',
      provider: 'OpenRouter',
      context_limit: '128000',
      input_price_per_1M_tokens: '0.01',
      output_price_per_1M_tokens: '0.03',
      caching_price_per_1M_tokens: '0.005',
      model_type: 'Text',
      context_window: '128K',
      description: 'Latest GPT-4 Turbo model'
    },
    {
      model_name: 'Claude 3 Opus',
      provider: 'OpenRouter',
      context_limit: '200000',
      input_price_per_1M_tokens: '0.015',
      output_price_per_1M_tokens: '0.075',
      caching_price_per_1M_tokens: '0.003',
      model_type: 'Text',
      context_window: '200K',
      description: 'Anthropic\'s most capable model'
    }
  ];

  const csv = Papa.unparse(template);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'llmcostguide-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Validate CSV file format
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateCSVFile = (file) => {
  const result = {
    isValid: true,
    errors: []
  };

  // Check file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    result.isValid = false;
    result.errors.push('File must be a CSV file');
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    result.isValid = false;
    result.errors.push('File size must be less than 10MB');
  }

  return result;
};

export default {
  parseCSVFile,
  validateModelData,
  transformModels,
  downloadTemplate,
  validateCSVFile,
};