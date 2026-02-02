
# Importar Escopos de Clientes via CSV

## Análise do CSV

O arquivo contém 44 clientes com os seguintes campos:
- **Cliente**: Nome do cliente
- **Posts Insta**: Mapeado para `instagram`
- **Posts LinkedIn**: Mapeado para `linkedin_posts`
- **Posts Youtube**: Mapeado para `youtube`
- **Posts TikTok**: Mapeado para `tiktok_posts`
- **Captações**: Mapeado para `recordings`

## Mapeamento de Nomes

Alguns nomes no CSV diferem levemente dos cadastrados no banco. Aqui está o mapeamento que será usado:

| CSV | Banco de Dados |
|-----|----------------|
| Fabio Müller | Fábio Müller |
| Bruno Oliveira | Bruno de Oliveira |
| Alê (Housi) | *(não encontrado)* |
| Nêmora (Mest) | Nêmora |
| Lucas André (Fast) | Lucas André |
| Rogério Melzi | *(não encontrado)* |
| Josef Rubin | *(não encontrado)* |
| Luiz Ramalho | *(não encontrado)* |
| Marcio Zarzur | Márcio Zarzur |
| O Corpo Explica | *(não encontrado)* |

## Clientes a Importar (38 encontrados)

Clientes com match exato ou mapeável:
- A Grande Mesa, Agroadvance, Alex Moro, Anny Meisler, Ariane Abdallah
- Bruno de Oliveira, Cubo Itaú, Danielle de Jesus, Dennis Wang
- Efeito Empreendedor, Ekoa, Fábio Müller, Felipe Pacheco
- Giovanni Colacicco, Gustavo Martins, Hendel Favarin, Henri Zylberstajn
- Housi, Jacque Boesso, Lazo, Lincoln Fracari, Lucas André, Luis Wulff
- Mara Cakes, Márcio Zarzur, Natalia Beauty, Nelson Lins, Nêmora
- Ouro Câmbio, Peguei Bode, Raphael Soares, Reinaldo Boesso
- Renata Pocztaruk, Renato Torres, Rony Meisler, Rubens Inácio
- Sandra Chayo, Signal 55, Tony Bernardini

## Clientes sem Match (6)

Estes clientes do CSV não foram encontrados no banco:
1. **Alê (Housi)** - existe "Ale Frankel", pode ser diferente
2. **O Corpo Explica** - não existe
3. **Rogério Melzi** - não existe  
4. **Josef Rubin** - não existe
5. **Luiz Ramalho** - não existe (existe "Luis Wulff" e "Luiz Wulff")

## Solução Técnica

Criar uma série de comandos SQL para inserir os escopos usando `INSERT ... ON CONFLICT DO UPDATE` (upsert) para cada cliente encontrado.

### Exemplo de Comando SQL

```sql
INSERT INTO client_scopes (client_id, instagram, linkedin_posts, youtube, tiktok_posts, recordings)
SELECT id, 30, 0, 0, 0, 0
FROM clients WHERE name = 'A Grande Mesa'
ON CONFLICT (client_id) DO UPDATE SET
  instagram = EXCLUDED.instagram,
  linkedin_posts = EXCLUDED.linkedin_posts,
  youtube = EXCLUDED.youtube,
  tiktok_posts = EXCLUDED.tiktok_posts,
  recordings = EXCLUDED.recordings;
```

## Execução

Executarei múltiplos comandos INSERT para atualizar os escopos de todos os 38 clientes encontrados no banco de dados.

## Resultado Esperado

Após a execução:
- 38 clientes terão seus escopos atualizados
- 6 clientes do CSV serão ignorados por não existirem no banco
- Os escopos aparecerão automaticamente na lista de clientes no Admin
