-- Create user_kyc table
CREATE TABLE user_kyc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_wallets table
CREATE TABLE user_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    chain TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, wallet_address)
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'trade'
    status TEXT NOT NULL DEFAULT 'pending',
    amount DECIMAL(24,8) NOT NULL,
    fee DECIMAL(24,8) NOT NULL,
    token TEXT NOT NULL,
    from_address TEXT,
    to_address TEXT,
    tx_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fiat_transactions table
CREATE TABLE fiat_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'deposit', 'withdrawal'
    status TEXT NOT NULL DEFAULT 'pending',
    amount DECIMAL(24,8) NOT NULL,
    fee DECIMAL(24,8) NOT NULL,
    currency TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trading_pairs table
CREATE TABLE trading_pairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_token TEXT NOT NULL,
    quote_token TEXT NOT NULL,
    min_trade_amount DECIMAL(24,8) NOT NULL,
    maker_fee DECIMAL(5,2) NOT NULL,
    taker_fee DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(base_token, quote_token)
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trading_pair_id UUID REFERENCES trading_pairs(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'limit', 'market'
    side TEXT NOT NULL, -- 'buy', 'sell'
    status TEXT NOT NULL DEFAULT 'pending',
    price DECIMAL(24,8),
    amount DECIMAL(24,8) NOT NULL,
    filled_amount DECIMAL(24,8) DEFAULT 0,
    fee DECIMAL(24,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trades table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trading_pair_id UUID REFERENCES trading_pairs(id) ON DELETE CASCADE,
    maker_order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    taker_order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    price DECIMAL(24,8) NOT NULL,
    amount DECIMAL(24,8) NOT NULL,
    maker_fee DECIMAL(24,8) NOT NULL,
    taker_fee DECIMAL(24,8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE user_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiat_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Users can only view and modify their own data
CREATE POLICY "Users can view own kyc" ON user_kyc
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kyc" ON user_kyc
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wallets" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wallets" ON user_wallets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own fiat transactions" ON fiat_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own orders" ON orders
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM orders WHERE id IN (maker_order_id, taker_order_id)
        )
    );

-- Everyone can view trading pairs
CREATE POLICY "Anyone can view trading pairs" ON trading_pairs
    FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_user_kyc_user_id ON user_kyc(user_id);
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_fiat_transactions_user_id ON fiat_transactions(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_trades_trading_pair_id ON trades(trading_pair_id);
CREATE INDEX idx_orders_trading_pair_id ON orders(trading_pair_id);
