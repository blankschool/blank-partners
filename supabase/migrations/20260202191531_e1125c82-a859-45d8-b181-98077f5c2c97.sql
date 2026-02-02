-- Passo 1: Criar os 4 novos clientes
INSERT INTO clients (name) VALUES 
  ('O Corpo Explica'),
  ('Josef Rubin'),
  ('Rogério Melzi'),
  ('Luiz Ramalho')
ON CONFLICT DO NOTHING;

-- Passo 2: Upsert de todos os 44 escopos de clientes

-- Reinaldo Boesso
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Reinaldo Boesso'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Sandra Chayo
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Sandra Chayo'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Fábio Müller
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 8, 0, 0, 0 FROM clients WHERE name = 'Fábio Müller'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Tony Bernardini
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Tony Bernardini'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- O Corpo Explica
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'O Corpo Explica'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Signal 55
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Signal 55'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Nêmora
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Nêmora'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Rony Meisler
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Rony Meisler'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Anny Meisler
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Anny Meisler'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ouro Câmbio
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Ouro Câmbio'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Renata Pocztaruk
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Renata Pocztaruk'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Agroadvance
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 45, 0, 0, 0, 0 FROM clients WHERE name = 'Agroadvance'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Peguei Bode
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 2 FROM clients WHERE name = 'Peguei Bode'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Luis Wulff
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 2 FROM clients WHERE name = 'Luis Wulff'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Raphael Soares
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Raphael Soares'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Bruno de Oliveira
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 4 FROM clients WHERE name = 'Bruno de Oliveira'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ale Frankel (mapeado de Alexandre)
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Ale Frankel'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Housi
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Housi'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Renato Torres
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Renato Torres'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Jacque Boesso
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Jacque Boesso'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- A Grande Mesa
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'A Grande Mesa'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Nelson Lins
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 15, 4, 0, 0, 0 FROM clients WHERE name = 'Nelson Lins'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Natalia Beauty
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 60, 0, 4, 30, 0 FROM clients WHERE name = 'Natalia Beauty'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Mara Cakes
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 2 FROM clients WHERE name = 'Mara Cakes'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lincoln Fracari
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 2 FROM clients WHERE name = 'Lincoln Fracari'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lucas André
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 2, 0, 0, 2 FROM clients WHERE name = 'Lucas André'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Rubens Inácio
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 2 FROM clients WHERE name = 'Rubens Inácio'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Cubo Itaú
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 60, 21, 0, 0, 0 FROM clients WHERE name = 'Cubo Itaú'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ariane Abdallah
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 0, 0, 0, 0, 2 FROM clients WHERE name = 'Ariane Abdallah'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ekoa
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 0 FROM clients WHERE name = 'Ekoa'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lazo
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 0 FROM clients WHERE name = 'Lazo'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Felipe Pacheco
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Felipe Pacheco'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Dennis Wang
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Dennis Wang'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Giovanni Colacicco
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Giovanni Colacicco'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Henri Zylberstajn
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Henri Zylberstajn'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Danielle de Jesus
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 16, 0, 0, 0, 0 FROM clients WHERE name = 'Danielle de Jesus'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Hendel Favarin
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 0 FROM clients WHERE name = 'Hendel Favarin'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Gustavo Martins
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Gustavo Martins'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Josef Rubin (novo cliente)
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 0, 0, 0 FROM clients WHERE name = 'Josef Rubin'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Rogério Melzi (novo cliente)
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Rogério Melzi'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Luiz Ramalho (novo cliente)
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 16, 8, 0, 0, 2 FROM clients WHERE name = 'Luiz Ramalho'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Efeito Empreendedor
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 4, 0, 4 FROM clients WHERE name = 'Efeito Empreendedor'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Alex Moro
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 8, 4, 0, 4 FROM clients WHERE name = 'Alex Moro'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Márcio Zarzur
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Márcio Zarzur'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;