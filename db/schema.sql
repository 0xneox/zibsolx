-- Token data schema
CREATE TABLE IF NOT EXISTS tokens (
    address VARCHAR(44) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    decimals INTEGER NOT NULL DEFAULT 9,
    total_supply NUMERIC(78,0),
    holder_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Token prices and market data
CREATE TABLE IF NOT EXISTS token_market_data (
    token_address VARCHAR(44) REFERENCES tokens(address),
    price NUMERIC(78,18),
    price_change_24h NUMERIC(78,18),
    volume_24h NUMERIC(78,18),
    liquidity NUMERIC(78,18),
    tx_count_24h INTEGER,
    buy_count_24h INTEGER,
    sell_count_24h INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (token_address, timestamp)
);

-- Token pairs/pools
CREATE TABLE IF NOT EXISTS token_pairs (
    pair_address VARCHAR(44) PRIMARY KEY,
    token_a_address VARCHAR(44) REFERENCES tokens(address),
    token_b_address VARCHAR(44) REFERENCES tokens(address),
    dex_name VARCHAR(50) NOT NULL,
    liquidity NUMERIC(78,18),
    volume_24h NUMERIC(78,18),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_token_market_data_timestamp ON token_market_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_token_pairs_tokens ON token_pairs(token_a_address, token_b_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_tokens_updated_at
    BEFORE UPDATE ON tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_pairs_updated_at
    BEFORE UPDATE ON token_pairs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
