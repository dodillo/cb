-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('variance', 'optimization', 'planning')),
  complexity TEXT NOT NULL CHECK (complexity IN ('standard', 'advanced', 'expert')),
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index to accelerate searches by type
CREATE INDEX IF NOT EXISTS scenarios_type_idx ON scenarios (type);

-- Seed baseline scenarios
INSERT INTO scenarios (id, title, description, type, complexity, fields)
VALUES
  (
    'scenario-variance-001',
    'Revenue Variance Model',
    'Assess pricing and volume deviations versus plan.',
    'variance',
    'standard',
    '[
      {"id": "plannedVolume", "label": "Planned Volume", "type": "number"},
      {"id": "plannedPrice", "label": "Planned Price", "type": "currency"},
      {"id": "actualVolume", "label": "Actual Volume", "type": "number"},
      {"id": "actualPrice", "label": "Actual Price", "type": "currency"},
      {"id": "unitCost", "label": "Unit Cost", "type": "currency"}
    ]'
  ),
  (
    'scenario-optimization-001',
    'Price Optimization Model',
    'Identify optimal price points under demand elasticity.',
    'optimization',
    'advanced',
    '[
      {"id": "currentPrice", "label": "Current Price", "type": "currency"},
      {"id": "currentVolume", "label": "Current Volume", "type": "number"},
      {"id": "elasticity", "label": "Demand Elasticity", "type": "percent"},
      {"id": "unitCost", "label": "Unit Cost", "type": "currency"},
      {"id": "fixedCost", "label": "Fixed Cost Base", "type": "currency"}
    ]'
  ),
  (
    'scenario-planning-001',
    'Sales Planning Model',
    'Forecast revenue impact across growth scenarios.',
    'planning',
    'standard',
    '[
      {"id": "currentRevenue", "label": "Current Revenue", "type": "currency"},
      {"id": "averagePrice", "label": "Average Price", "type": "currency"},
      {"id": "growthRate", "label": "Growth Rate", "type": "percent"},
      {"id": "grossMargin", "label": "Gross Margin", "type": "percent"}
    ]'
  );

-- Store scenario results
CREATE TABLE IF NOT EXISTS scenario_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  user_id UUID,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index to accelerate searches by scenario and user
CREATE INDEX IF NOT EXISTS scenario_results_scenario_id_idx ON scenario_results (scenario_id);
CREATE INDEX IF NOT EXISTS scenario_results_user_id_idx ON scenario_results (user_id);
