
-- Remover handle_new_auth_user com CASCADE (remove trigger on_auth_user_created em auth.users)
DROP FUNCTION IF EXISTS handle_new_auth_user CASCADE;
