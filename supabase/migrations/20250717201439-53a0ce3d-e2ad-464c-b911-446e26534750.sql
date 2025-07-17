-- Fix missing RLS policies for tables that have RLS enabled
-- Add policies for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (user_id = (auth.uid())::text);

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (user_id = (auth.uid())::text);

-- Add policies for user_tokens table
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tokens" 
ON public.user_tokens 
FOR SELECT 
USING (user_id = (auth.uid())::text);

CREATE POLICY "Users can insert their own tokens" 
ON public.user_tokens 
FOR INSERT 
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Users can update their own tokens" 
ON public.user_tokens 
FOR UPDATE 
USING (user_id = (auth.uid())::text);

-- Add policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (auth_id = (auth.uid())::text);

CREATE POLICY "Users can insert their own record" 
ON public.users 
FOR INSERT 
WITH CHECK (auth_id = (auth.uid())::text);

CREATE POLICY "Users can update their own record" 
ON public.users 
FOR UPDATE 
USING (auth_id = (auth.uid())::text);

-- Add policies for stripe_webhook_logs (admin only)
ALTER TABLE public.stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access webhook logs" 
ON public.stripe_webhook_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add policies for backup tables (admin only)
ALTER TABLE public.creators_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access creators backup" 
ON public.creators_backup 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.transactions_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access transactions backup" 
ON public.transactions_backup 
FOR ALL 
USING (auth.role() = 'service_role');

ALTER TABLE public.users_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access users backup" 
ON public.users_backup 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix database functions by setting search_path to secure defaults
-- Update all functions to include secure search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_creator_price(p_creator_id text, p_new_price numeric, p_volume numeric DEFAULT 0)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Update the current price in creators table
  UPDATE public.creators 
  SET 
    token_price = p_new_price,
    total_volume = COALESCE(total_volume, 0) + p_volume
  WHERE id = p_creator_id;
  
  -- Record price history
  INSERT INTO public.price_history (creator_id, price, volume)
  VALUES (p_creator_id, p_new_price, p_volume);
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_new_price(p_creator_id text, p_tokens_traded integer, p_is_buy boolean)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  v_current_price DECIMAL(10,4);
  v_price_impact DECIMAL(10,4);
  v_new_price DECIMAL(10,4);
BEGIN
  -- Get current price
  SELECT token_price INTO v_current_price
  FROM public.creators
  WHERE id = p_creator_id;
  
  -- Simple price impact calculation (0.1% per 100 tokens)
  v_price_impact := v_current_price * (p_tokens_traded::DECIMAL / 10000);
  
  -- Apply price impact (increase for buys, decrease for sells)
  IF p_is_buy THEN
    v_new_price := v_current_price + v_price_impact;
  ELSE
    v_new_price := v_current_price - v_price_impact;
  END IF;
  
  -- Ensure price doesn't go below 0.01
  v_new_price := GREATEST(v_new_price, 0.01);
  
  RETURN v_new_price;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_subscription_plan(p_user_id text)
 RETURNS TABLE(plan_type text, buy_fee_rate numeric, sell_fee_rate numeric, can_use_clone boolean, skip_fees boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(sub.plan_type, 'investor_free'::TEXT) as plan_type,
        COALESCE(sub.buy_fee_rate, 0.050::DECIMAL) as buy_fee_rate,
        COALESCE(sub.sell_fee_rate, 0.030::DECIMAL) as sell_fee_rate,
        COALESCE(sub.can_use_clone, false) as can_use_clone,
        COALESCE(sub.skip_fees, false) as skip_fees
    FROM public.investor_subscriptions sub 
    WHERE sub.user_id = p_user_id 
    AND sub.active = true
    LIMIT 1;
    
    -- If no subscription found, return default free plan
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            'investor_free'::TEXT as plan_type,
            0.050::DECIMAL as buy_fee_rate,
            0.030::DECIMAL as sell_fee_rate,
            false as can_use_clone,
            false as skip_fees;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_clone_access(p_user_id text, p_creator_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_tokens_owned INTEGER := 0;
    v_can_use_clone BOOLEAN := false;
    v_subscription_active BOOLEAN := false;
BEGIN
    -- Get user's token holdings for this creator
    SELECT COALESCE(tokens_owned, 0) INTO v_tokens_owned
    FROM public.holdings 
    WHERE user_id = p_user_id AND creator_id = p_creator_id;
    
    -- Get user's subscription status
    SELECT can_use_clone, active INTO v_can_use_clone, v_subscription_active
    FROM public.investor_subscriptions 
    WHERE user_id = p_user_id AND active = true;
    
    -- Return true if user has 10+ tokens AND active premium subscription
    RETURN (v_tokens_owned >= 10 AND v_can_use_clone AND v_subscription_active);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_platform_fees(p_fee_amount numeric, p_fee_type text, p_creator_id text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_current_breakdown JSONB;
BEGIN
    -- Get current fee breakdown
    SELECT fee_breakdown_by_creator INTO v_current_breakdown
    FROM public.platform_wallet
    LIMIT 1;
    
    -- Update the platform wallet
    UPDATE public.platform_wallet SET
        total_fees_collected = total_fees_collected + p_fee_amount,
        total_buy_fees = total_buy_fees + (CASE WHEN p_fee_type = 'buy' THEN p_fee_amount ELSE 0 END),
        total_sell_fees = total_sell_fees + (CASE WHEN p_fee_type = 'sell' THEN p_fee_amount ELSE 0 END),
        fee_breakdown_by_creator = jsonb_set(
            COALESCE(v_current_breakdown, '{}'::jsonb),
            ('{' || p_creator_id || '}')::text[],
            (COALESCE((v_current_breakdown->>p_creator_id)::decimal, 0) + p_fee_amount)::text::jsonb
        ),
        last_updated = NOW();
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, joined)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'unassigned',
    NOW()
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Check if profile exists, if not create one
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, email, username, role, joined)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(COALESCE(NEW.email, ''), '@', 1)),
      'unassigned',
      NOW()
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block the user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$function$;