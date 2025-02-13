-- Add KYC fields to profiles table
ALTER TABLE profiles 
ADD COLUMN kyc_status text DEFAULT 'not_started' CHECK (kyc_status IN ('not_started', 'pending', 'verified')),
ADD COLUMN kyc_data jsonb DEFAULT NULL,
ADD COLUMN fiat_enabled boolean DEFAULT false;
