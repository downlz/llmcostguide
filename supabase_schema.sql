-- LLMCostGuide Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create llm_models table
CREATE TABLE llm_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name VARCHAR(255) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  context_limit INTEGER NOT NULL,
  input_price_per_1k_tokens DECIMAL(10,6) NOT NULL DEFAULT 0,
  output_price_per_1k_tokens DECIMAL(10,6) NOT NULL DEFAULT 0,
  caching_price_per_1k_tokens DECIMAL(10,6),
  model_type VARCHAR(50) NOT NULL DEFAULT 'Text',
  added_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  external_model_id VARCHAR(255) UNIQUE,
  context_window VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create data_sync_logs table
CREATE TABLE data_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(100) NOT NULL,
  sync_type VARCHAR(50) NOT NULL,
  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_llm_models_provider ON llm_models(provider);
CREATE INDEX idx_llm_models_active ON llm_models(is_active);
CREATE INDEX idx_llm_models_model_type ON llm_models(model_type);
CREATE INDEX idx_llm_models_name ON llm_models(model_name);
CREATE INDEX idx_data_sync_logs_created_at ON data_sync_logs(created_at DESC);

-- Create function to update updated_on timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_on = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for llm_models
CREATE TRIGGER update_llm_models_updated_at 
  BEFORE UPDATE ON llm_models 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO llm_models (
  model_name, 
  provider, 
  context_limit, 
  input_price_per_1k_tokens,
  output_price_per_1k_tokens,
  caching_price_per_1k_tokens,
  model_type,
  external_model_id,
  context_window,
  description
) VALUES 
(
  'GPT-4 Turbo',
  'OpenRouter',
  128000,
  0.01,
  0.03,
  0.005,
  'Text',
  'openai/gpt-4-turbo',
  '128K',
  'Latest GPT-4 Turbo model with improved performance and longer context'
),
(
  'Claude 3 Opus',
  'OpenRouter',
  200000,
  0.015,
  0.075,
  0.003,
  'Text',
  'anthropic/claude-3-opus',
  '200K',
  'Anthropic''s most capable model for complex reasoning tasks'
),
(
  'LLaMA 2 70B',
  'TogetherAI',
  4096,
  0.0007,
  0.0009,
  NULL,
  'Text',
  'togethercomputer/llama-2-70b',
  '4K',
  'Meta''s LLaMA 2 70B model hosted on Together AI'
),
(
  'DALL-E 3',
  'OpenRouter',
  4000,
  0.04,
  0.12,
  0.01,
  'Images',
  'openai/dall-e-3',
  '4K',
  'OpenAI''s latest image generation model'
),
(
  'Mistral 7B Instruct',
  'TogetherAI',
  32768,
  0.0002,
  0.0002,
  NULL,
  'Text',
  'mistralai/mistral-7b-instruct',
  '32K',
  'Mistral AI''s 7B parameter instruction-tuned model'
),
(
  'Gemini Pro',
  'OpenRouter',
  30720,
  0.00025,
  0.0005,
  NULL,
  'Text',
  'google/gemini-pro',
  '32K',
  'Google''s Gemini Pro model for text generation'
),
(
  'Code Llama 34B',
  'TogetherAI',
  16384,
  0.0003,
  0.0004,
  NULL,
  'Text',
  'codellama/CodeLlama-34b-Instruct',
  '16K',
  'Meta''s Code Llama for code generation and completion'
),
(
  'Whisper Large',
  'OpenRouter',
  48000,
  0.006,
  0.006,
  NULL,
  'Audio',
  'openai/whisper-large-v2',
  '48K',
  'OpenAI''s Whisper for speech-to-text transcription'
);

-- Insert sample sync log
INSERT INTO data_sync_logs (
  provider,
  sync_type,
  records_added,
  records_updated,
  status
) VALUES 
('manual', 'sample_data_import', 8, 0, 'completed');

-- Create RLS policies (Row Level Security)
-- Enable RLS on tables
ALTER TABLE llm_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sync_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to active models
CREATE POLICY "Allow public read access to active models" 
ON llm_models FOR SELECT 
USING (is_active = true);

-- Policy to allow all operations for service role (for admin functions)
CREATE POLICY "Allow all operations for service role" 
ON llm_models FOR ALL 
USING (auth.role() = 'service_role');

-- Policy to allow all operations for data_sync_logs
CREATE POLICY "Allow all operations for data_sync_logs" 
ON data_sync_logs FOR ALL 
USING (auth.role() = 'service_role');

-- Grant permissions
-- Note: In production, you might want to be more restrictive
GRANT SELECT ON llm_models TO anon, authenticated;
GRANT ALL ON llm_models TO service_role;
GRANT ALL ON data_sync_logs TO service_role;

-- Create a view for easy access to active models
CREATE OR REPLACE VIEW active_models AS
SELECT 
  id,
  model_name,
  provider,
  context_limit,
  input_price_per_1k_tokens,
  output_price_per_1k_tokens,
  caching_price_per_1k_tokens,
  model_type,
  added_on,
  context_window,
  description,
  external_model_id
FROM llm_models
WHERE is_active = true
ORDER BY model_name;

-- Grant select on view
GRANT SELECT ON active_models TO anon, authenticated;

-- Create function to get models with filters
CREATE OR REPLACE FUNCTION get_models(
  provider_filter TEXT DEFAULT NULL,
  model_type_filter TEXT DEFAULT NULL,
  search_query TEXT DEFAULT NULL,
  sort_by TEXT DEFAULT 'model_name',
  sort_order TEXT DEFAULT 'ASC',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  model_name VARCHAR(255),
  provider VARCHAR(100),
  context_limit INTEGER,
  input_price_per_1k_tokens DECIMAL(10,6),
  output_price_per_1k_tokens DECIMAL(10,6),
  caching_price_per_1k_tokens DECIMAL(10,6),
  model_type VARCHAR(50),
  added_on TIMESTAMP WITH TIME ZONE,
  context_window VARCHAR(50),
  description TEXT,
  external_model_id VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.model_name,
    m.provider,
    m.context_limit,
    m.input_price_per_1k_tokens,
    m.output_price_per_1k_tokens,
    m.caching_price_per_1k_tokens,
    m.model_type,
    m.added_on,
    m.context_window,
    m.description,
    m.external_model_id
  FROM llm_models m
  WHERE
    m.is_active = TRUE
    AND (provider_filter IS NULL OR m.provider = provider_filter)
    AND (model_type_filter IS NULL OR m.model_type = model_type_filter)
    AND (
      search_query IS NULL
      OR m.model_name ILIKE '%' || search_query || '%'
      OR m.provider ILIKE '%' || search_query || '%'
      OR m.description ILIKE '%' || search_query || '%'
    )
  ORDER BY
    -- Dynamic sorting column
    CASE WHEN sort_by = 'model_name'            THEN m.model_name END,
    CASE WHEN sort_by = 'provider'              THEN m.provider END,
    CASE WHEN sort_by = 'input_price_per_1k_tokens'  THEN m.input_price_per_1k_tokens END,
    CASE WHEN sort_by = 'output_price_per_1k_tokens' THEN m.output_price_per_1k_tokens END,
    CASE WHEN sort_by = 'context_limit'         THEN m.context_limit END,
    CASE WHEN sort_by = 'added_on'              THEN m.added_on END,

    -- Dynamic sort direction (DESC branches)
    CASE WHEN sort_by = 'model_name'            AND sort_order = 'DESC' THEN m.model_name END DESC,
    CASE WHEN sort_by = 'provider'              AND sort_order = 'DESC' THEN m.provider END DESC,
    CASE WHEN sort_by = 'input_price_per_1k_tokens'  AND sort_order = 'DESC' THEN m.input_price_per_1k_tokens END DESC,
    CASE WHEN sort_by = 'output_price_per_1k_tokens' AND sort_order = 'DESC' THEN m.output_price_per_1k_tokens END DESC,
    CASE WHEN sort_by = 'context_limit'         AND sort_order = 'DESC' THEN m.context_limit END DESC,
    CASE WHEN sort_by = 'added_on'              AND sort_order = 'DESC' THEN m.added_on END DESC,

    -- Default sort if unknown column
    m.model_name  -- fallback
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION get_models TO anon, authenticated;

-- Create function to get model count with filters
CREATE OR REPLACE FUNCTION get_models_count(
  provider_filter TEXT DEFAULT NULL,
  model_type_filter TEXT DEFAULT NULL,
  search_query TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  model_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO model_count
  FROM llm_models
  WHERE 
    is_active = true
    AND (provider_filter IS NULL OR provider = provider_filter)
    AND (model_type_filter IS NULL OR model_type = model_type_filter)
    AND (search_query IS NULL OR 
         model_name ILIKE '%' || search_query || '%' OR
         provider ILIKE '%' || search_query || '%' OR
         description ILIKE '%' || search_query || '%');
  
  RETURN model_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION get_models_count TO anon, authenticated;

-- Create function to bulk import models
CREATE OR REPLACE FUNCTION import_models(models_data JSONB)
RETURNS JSONB AS $$
DECLARE
  imported_count INTEGER := 0;
  updated_count INTEGER := 0;
  model_record JSONB;
  result JSONB;
BEGIN
  -- Process each model in the JSON array
  FOR model_record IN SELECT * FROM jsonb_array_elements(models_data)
  LOOP
    INSERT INTO llm_models (
      model_name,
      provider,
      context_limit,
      input_price_per_1M_tokens,
      output_price_per_1M_tokens,
      caching_price_per_1M_tokens,
      model_type,
      external_model_id,
      context_window,
      description,
      added_on,
      updated_on,
      is_active
    ) VALUES (
      (model_record->>'model_name')::VARCHAR(255),
      (model_record->>'provider')::VARCHAR(100),
      (model_record->>'context_limit')::INTEGER,
      (model_record->>'input_price_per_1k_tokens')::DECIMAL(10,6),
      (model_record->>'output_price_per_1k_tokens')::DECIMAL(10,6),
      CASE
        WHEN model_record->>'caching_price_per_1k_tokens' IS NOT NULL
          THEN (model_record->>'caching_price_per_1k_tokens')::DECIMAL(10,6)
          ELSE NULL
      END,
      (model_record->>'model_type')::VARCHAR(50),
      (model_record->>'external_model_id')::VARCHAR(255),
      (model_record->>'context_window')::VARCHAR(50),
      (model_record->>'description')::TEXT,
      COALESCE((model_record->>'added_on')::TIMESTAMP WITH TIME ZONE, NOW()),
      NOW(),
      COALESCE((model_record->>'is_active')::BOOLEAN, true)
    )
    ON CONFLICT (external_model_id) DO UPDATE SET
      model_name = EXCLUDED.model_name,
      provider = EXCLUDED.provider,
      context_limit = EXCLUDED.context_limit,
      input_price_per_1k_tokens = EXCLUDED.input_price_per_1k_tokens,
      output_price_per_1k_tokens = EXCLUDED.output_price_per_1k_tokens,
      caching_price_per_1k_tokens = EXCLUDED.caching_price_per_1k_tokens,
      model_type = EXCLUDED.model_type,
      context_window = EXCLUDED.context_window,
      description = EXCLUDED.description,
      updated_on = NOW(),
      is_active = EXCLUDED.is_active;
    
    imported_count := imported_count + 1;
  END LOOP;

  -- Log the import operation
  INSERT INTO data_sync_logs (
    provider,
    sync_type,
    records_added,
    records_updated,
    status
  ) VALUES (
    'manual',
    'csv_import',
    imported_count,
    updated_count,
    'completed'
  );

  -- Return result
  result := jsonb_build_object(
    'success', true,
    'imported_count', imported_count,
    'updated_count', updated_count
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION import_models TO service_role;

-- Success message
SELECT 'LLMCostGuide database setup completed successfully!' AS status;
SELECT 'Tables created: llm_models, data_sync_logs' AS tables;
SELECT 'Sample data inserted. You can now use the application!' AS message;