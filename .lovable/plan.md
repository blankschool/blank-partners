

# Importar Escopos de Clientes via CSV (Atualizado)

## Resumo da Análise

O CSV contém **44 clientes** que serão processados da seguinte forma:

| Tipo | Quantidade |
|------|------------|
| Match exato | 36 clientes |
| Match com ajuste de acentuação | 4 clientes |
| Mapeamento especial | 1 cliente (Alexandre → Ale Frankel) |
| Novos clientes a criar | 4 clientes |
| **Total** | **45 operações** |

## Mapeamentos de Nomes

| Nome no CSV | Nome no Banco |
|-------------|---------------|
| Fabio Müller | Fábio Müller |
| Nemora | Nêmora |
| Bruno Oliveira | Bruno de Oliveira |
| Marcio Zarzur | Márcio Zarzur |
| Alexandre | Ale Frankel |

## Novos Clientes a Criar

1. O Corpo Explica
2. Josef Rubin
3. Rogério Melzi
4. Luiz Ramalho

## Execução

### Passo 1: Criar os 4 novos clientes

```sql
INSERT INTO clients (name) VALUES 
  ('O Corpo Explica'),
  ('Josef Rubin'),
  ('Rogério Melzi'),
  ('Luiz Ramalho');
```

### Passo 2: Inserir/Atualizar escopos

Executar upserts para todos os 44 clientes usando os nomes corretos do banco de dados.

### Exemplo de Upsert

```sql
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0
FROM clients WHERE name = 'Reinaldo Boesso'
ON CONFLICT (client_id) DO UPDATE SET
  instagram = EXCLUDED.instagram,
  linkedin_posts = EXCLUDED.linkedin_posts,
  youtube = EXCLUDED.youtube,
  tiktok_posts = EXCLUDED.tiktok_posts,
  recordings = EXCLUDED.recordings;
```

## Dados a Importar (44 clientes)

| Cliente (Nome Banco) | Instagram | LinkedIn | YouTube | TikTok | Gravações |
|---------------------|-----------|----------|---------|--------|-----------|
| Reinaldo Boesso | 30 | 0 | 0 | 0 | 0 |
| Sandra Chayo | 30 | 0 | 0 | 0 | 0 |
| Fábio Müller | 12 | 8 | 0 | 0 | 0 |
| Tony Bernardini | 30 | 0 | 0 | 0 | 0 |
| O Corpo Explica | 30 | 0 | 0 | 0 | 0 |
| Signal 55 | 30 | 0 | 0 | 0 | 0 |
| Nêmora | 30 | 0 | 0 | 0 | 0 |
| Rony Meisler | 30 | 0 | 0 | 0 | 0 |
| Anny Meisler | 30 | 0 | 0 | 0 | 0 |
| Ouro Câmbio | 30 | 0 | 0 | 0 | 0 |
| Renata Pocztaruk | 30 | 0 | 0 | 0 | 0 |
| Agroadvance | 45 | 0 | 0 | 0 | 0 |
| Peguei Bode | 30 | 0 | 0 | 0 | 2 |
| Luis Wulff | 30 | 8 | 0 | 0 | 2 |
| Raphael Soares | 30 | 0 | 0 | 0 | 0 |
| Bruno de Oliveira | 30 | 8 | 0 | 0 | 4 |
| Ale Frankel | 30 | 0 | 0 | 0 | 0 |
| Housi | 30 | 0 | 0 | 0 | 0 |
| Renato Torres | 30 | 0 | 0 | 0 | 0 |
| Jacque Boesso | 30 | 0 | 0 | 0 | 0 |
| A Grande Mesa | 30 | 0 | 0 | 0 | 0 |
| Nelson Lins | 15 | 4 | 0 | 0 | 0 |
| Natalia Beauty | 60 | 0 | 4 | 30 | 0 |
| Mara Cakes | 30 | 0 | 0 | 0 | 2 |
| Lincoln Fracari | 30 | 8 | 0 | 0 | 2 |
| Lucas André | 30 | 2 | 0 | 0 | 2 |
| Rubens Inácio | 30 | 8 | 0 | 0 | 2 |
| Cubo Itaú | 60 | 21 | 0 | 0 | 0 |
| Ariane Abdallah | 0 | 0 | 0 | 0 | 2 |
| Ekoa | 20 | 0 | 0 | 0 | 0 |
| Lazo | 20 | 0 | 0 | 0 | 0 |
| Felipe Pacheco | 30 | 0 | 0 | 0 | 0 |
| Dennis Wang | 12 | 4 | 0 | 0 | 1 |
| Giovanni Colacicco | 12 | 4 | 0 | 0 | 1 |
| Henri Zylberstajn | 12 | 4 | 0 | 0 | 1 |
| Danielle de Jesus | 16 | 0 | 0 | 0 | 0 |
| Hendel Favarin | 30 | 8 | 0 | 0 | 0 |
| Gustavo Martins | 12 | 4 | 0 | 0 | 1 |
| Josef Rubin | 30 | 8 | 0 | 0 | 0 |
| Rogério Melzi | 12 | 4 | 0 | 0 | 1 |
| Luiz Ramalho | 16 | 8 | 0 | 0 | 2 |
| Efeito Empreendedor | 30 | 8 | 4 | 0 | 4 |
| Alex Moro | 30 | 8 | 4 | 0 | 4 |
| Márcio Zarzur | 30 | 0 | 0 | 0 | 0 |

## Resultado Esperado

- **4 novos clientes** serão criados no sistema
- **44 escopos** serão inseridos/atualizados
- Os escopos aparecerão automaticamente na aba Clientes no Admin

