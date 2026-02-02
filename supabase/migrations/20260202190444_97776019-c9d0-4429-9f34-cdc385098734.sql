-- Upsert client scopes from CSV data

-- A Grande Mesa: IG=30, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'A Grande Mesa'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Agroadvance: IG=8, LI=4, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 8, 4, 0, 0, 1 FROM clients WHERE name = 'Agroadvance'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Alex Moro: IG=22, LI=4, YT=4, TT=0, Rec=2
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 22, 4, 4, 0, 2 FROM clients WHERE name = 'Alex Moro'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Anny Meisler: IG=20, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 1 FROM clients WHERE name = 'Anny Meisler'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ariane Abdallah: IG=20, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 1 FROM clients WHERE name = 'Ariane Abdallah'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Bruno de Oliveira (CSV: Bruno Oliveira): IG=12, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 1 FROM clients WHERE name = 'Bruno de Oliveira'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Cubo Itaú: IG=18, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 18, 0, 0, 0, 0 FROM clients WHERE name = 'Cubo Itaú'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Danielle de Jesus: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Danielle de Jesus'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Dennis Wang: IG=12, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 1 FROM clients WHERE name = 'Dennis Wang'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Efeito Empreendedor: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Efeito Empreendedor'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ekoa: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Ekoa'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Fábio Müller (CSV: Fabio Müller): IG=22, LI=0, YT=8, TT=8, Rec=2
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 22, 0, 8, 8, 2 FROM clients WHERE name = 'Fábio Müller'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Felipe Pacheco: IG=16, LI=0, YT=4, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 16, 0, 4, 0, 1 FROM clients WHERE name = 'Felipe Pacheco'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Giovanni Colacicco: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Giovanni Colacicco'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Gustavo Martins: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Gustavo Martins'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Hendel Favarin: IG=15, LI=0, YT=4, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 15, 0, 4, 0, 1 FROM clients WHERE name = 'Hendel Favarin'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Henri Zylberstajn: IG=20, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 1 FROM clients WHERE name = 'Henri Zylberstajn'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Housi: IG=12, LI=8, YT=4, TT=0, Rec=2
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 8, 4, 0, 2 FROM clients WHERE name = 'Housi'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Jacque Boesso: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Jacque Boesso'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lazo: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Lazo'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lincoln Fracari: IG=12, LI=0, YT=4, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 4, 0, 1 FROM clients WHERE name = 'Lincoln Fracari'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Lucas André (CSV: Lucas André (Fast)): IG=15, LI=4, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 15, 4, 0, 0, 1 FROM clients WHERE name = 'Lucas André'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Luis Wulff: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Luis Wulff'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Mara Cakes: IG=30, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0 FROM clients WHERE name = 'Mara Cakes'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Márcio Zarzur (CSV: Marcio Zarzur): IG=12, LI=4, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 4, 0, 0, 1 FROM clients WHERE name = 'Márcio Zarzur'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Natalia Beauty: IG=20, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 1 FROM clients WHERE name = 'Natalia Beauty'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Nelson Lins: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Nelson Lins'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Nêmora (CSV: Nêmora (Mest)): IG=8, LI=8, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 8, 8, 0, 0, 1 FROM clients WHERE name = 'Nêmora'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Ouro Câmbio: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Ouro Câmbio'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Peguei Bode: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Peguei Bode'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Raphael Soares: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Raphael Soares'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Reinaldo Boesso: IG=16, LI=0, YT=4, TT=4, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 16, 0, 4, 4, 1 FROM clients WHERE name = 'Reinaldo Boesso'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Renata Pocztaruk: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Renata Pocztaruk'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Renato Torres: IG=15, LI=0, YT=0, TT=0, Rec=1
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 15, 0, 0, 0, 1 FROM clients WHERE name = 'Renato Torres'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Rony Meisler: IG=20, LI=0, YT=0, TT=0, Rec=2
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 20, 0, 0, 0, 2 FROM clients WHERE name = 'Rony Meisler'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Rubens Inácio: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Rubens Inácio'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Sandra Chayo: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Sandra Chayo'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Signal 55: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Signal 55'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;

-- Tony Bernardini: IG=12, LI=0, YT=0, TT=0, Rec=0
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 12, 0, 0, 0, 0 FROM clients WHERE name = 'Tony Bernardini'
ON CONFLICT (client_id) DO UPDATE SET instagram = EXCLUDED.instagram, linkedin_posts = EXCLUDED.linkedin_posts, youtube = EXCLUDED.youtube, tiktok_posts = EXCLUDED.tiktok_posts, recordings = EXCLUDED.recordings;