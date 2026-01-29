import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Team data from CSV - embedded for one-time import
const teamData = [
  { name: "Paulo Gomes", email: "paulo@blankschool.com.br", birthDate: "07/06/2001", startDate: "13/01/2025", area: "Social Media", position: "Líder de Social Media", seniority: "Sênior", leader: "Micael Crasto", squad: "7", clients: ["Cubo Itaú", "Henri Zylberstajn", "Giovanni Colacicco"] },
  { name: "Lucas Bolda", email: "lucas@blankschool.com.br", birthDate: "16/06/2005", startDate: "19/03/2002", area: "Criação", position: "Designer", seniority: "", leader: "Gabriel Weizmann", squad: "5 e 7", clients: ["Cubo Itaú", "Felipe Pacheco", "Rubens Inácio", "Ekoa", "Renata Pocztaruk", "Raphael Soares", "Henri Zylberstajn", "Giovanni Colacicco", "Gustavo Martins", "Dennis Wang", "Blank School"] },
  { name: "Miguel Crasto", email: "miguel@blankschool.com.br", birthDate: "11/02/2006", startDate: "", area: "Operações", position: "Analista de Tecnologia", seniority: "", leader: "Pedro Bonzanini", squad: "", clients: [] },
  { name: "Victor Negrene", email: "victor@blankschool.com.br", birthDate: "10/09/2000", startDate: "28/07/2025", area: "Social Media", position: "Social Media", seniority: "Pleno", leader: "Paulo Gomes", squad: "", clients: ["Tallis Gomes"] },
  { name: "Daniel Bittencourt", email: "daniel@blankschool.com.br", birthDate: "28/06/2005", startDate: "21/11/2024", area: "Criação", position: "Editor de Vídeos", seniority: "Júnior", leader: "Vinicius Crasto", squad: "3", clients: ["Ale Frankel", "Peguei Bode", "Housi", "Danielle de Jesus", "Fábio Muller"] },
  { name: "Henrique Ikeda", email: "h.ikeda@blankschool.com.br", birthDate: "15/11/1998", startDate: "13/11/2025", area: "Criação", position: "Designer", seniority: "", leader: "Gabriel Weizmann", squad: "1 e 3", clients: ["Hendel Favarin", "A Grande Mesa", "Nêmora", "Lincoln Farani", "Tony Bernardini", "Reinaldo Boesso", "Signal", "Peguei Bode", "Housi", "Danielle de Jesus", "Fábio Muller"] },
  { name: "José Paixão", email: "jose@blankschool.com.br", birthDate: "17/01/2006", startDate: "07/03/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "2", clients: ["Renata Vichi", "Anny Meisler", "Efeito Empreendedor", "Natalia Beauty", "Bruno de Oliveira", "Lazo"] },
  { name: "Luiz Alves", email: "luiz@blankschool.com.br", birthDate: "27/08/1997", startDate: "14/04/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "1", clients: ["Hendel Favarin", "A Grande Mesa", "Nêmora", "Lincoln Farani", "Tony Bernardini", "Reinaldo Boesso"] },
  { name: "Letícia Gussão", email: "leticia@blankschool.com.br", birthDate: "11/10/2005", startDate: "05/03/2024", area: "Social Media", position: "Líder de Social Media", seniority: "Sênior", leader: "Micael Crasto", squad: "2", clients: ["Renata Vichi"] },
  { name: "Giovana Palomares", email: "giovana@blankschool.com.br", birthDate: "26/08/2005", startDate: "12/05/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Letícia Gussão", squad: "1", clients: ["A Grande Mesa", "Nêmora", "Hendel Favarin"] },
  { name: "Giulia Sivera", email: "g.sivera@blankschool.com.br", birthDate: "18/06/2003", startDate: "06/10/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Letícia Gussão", squad: "2", clients: ["Anny Meisler", "Bruno de Oliveira", "Lazo", "Blank School"] },
  { name: "Maria Luisa Brito", email: "maria@blankschool.com.br", birthDate: "09/06/2005", startDate: "24/07/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Letícia Gussão", squad: "3", clients: ["Ale Frankel", "Danielle de Jesus", "Fábio Müller"] },
  { name: "Maria Eduarda Sena", email: "eduardasena@blankschool.com.br", birthDate: "31/05/2004", startDate: "18/08/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Letícia Gussão", squad: "3", clients: ["Peguei Bode", "Signal 55", "Housi", "Natalia Beauty"] },
  { name: "Mariane Kamata", email: "m.kamata@blankschool.com.br", birthDate: "05/11/1995", startDate: "04/12/2025", area: "Social Media", position: "Social Media", seniority: "Pleno", leader: "Letícia Gussão", squad: "2", clients: ["Natalia Beauty"] },
  { name: "Vitor Camacho", email: "v.camacho@blankschool.com.br", birthDate: "30/05/2007", startDate: "30/10/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Letícia Gussão", squad: "1", clients: ["Tony Bernardini", "Lincoln Fracari", "Reinaldo Boesso"] },
  { name: "Alisson Sampaio", email: "a.sampaio@blankschool.com.br", birthDate: "25/12/1999", startDate: "03/11/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "4", clients: ["Ouro Câmbio", "Nelson Lins", "Alfredo Jr", "Mara Cakes", "Jacque Boesso", "Sandra Chayo"] },
  { name: "Gabriel de Oliveira", email: "oliveira@blankschool.com.br", birthDate: "30/11/1999", startDate: "03/06/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "6", clients: ["Lucas Freitas", "Micael Crasto", "Lucas André", "Alex Moro", "Agroadvance", "Luiz Wulff", "Renato Torres", "Arinae Abdallah", "Robson Harada"] },
  { name: "Guilherme Monteiro", email: "guilherme@blankschool.com.br", birthDate: "06/02/2005", startDate: "22/04/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "5", clients: ["Raphael Soares", "Rony Meisler", "Lord"] },
  { name: "Luis André", email: "luisandre@blankschool.com.br", birthDate: "24/09/1996", startDate: "13/05/2025", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "5", clients: ["Renata Pocztaruk", "Felipe Pacheco", "Rubens Inácio"] },
  { name: "Thayna Cavalari", email: "cavalari@blankschool.com.br", birthDate: "20/03/2000", startDate: "30/06/2025", area: "Criação", position: "Designer", seniority: "", leader: "Gabriel Weizmann", squad: "4 e 6", clients: ["Ouro Câmbio", "Nelson Lins", "Alfredo Jr", "Mara Cakes", "Jacque Boesso", "Sandra Chayo"] },
  { name: "Larissa Oliviera", email: "larissa@blankschool.com.br", birthDate: "28/02/1999", startDate: "06/05/2024", area: "Social Media", position: "Líder de Social Media", seniority: "Sênior", leader: "Micael Crasto", squad: "", clients: ["Raphael Soares"] },
  { name: "Beatriz Papa", email: "b.papa@blankschool.com.br", birthDate: "06/01/2003", startDate: "29/09/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Larissa Oliviera", squad: "5", clients: ["Ekoa", "Felipe Pacheco", "Rubens Inácio"] },
  { name: "Caroline Antunes", email: "c.antunes@blankschool.com.br", birthDate: "24/10/2000", startDate: "26/12/2000", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Larissa Oliviera", squad: "4", clients: ["Mara Cakes", "Sandra Chayo", "Jacque Boesso"] },
  { name: "Leonardo Matos", email: "leonardomatos@blankschool.com.br", birthDate: "19/03/2007", startDate: "12/06/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Larissa Oliviera", squad: "6", clients: ["Alex Moro", "Lucas André", "Robson Harada", "Lucas Freitas", "Micael Crasto"] },
  { name: "Eduarda Santos", email: "eduarda@blankschool.com.br", birthDate: "26/11/2000", startDate: "07/08/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Larissa Oliviera", squad: "6", clients: ["Agroadvance", "Luis Wulff", "Renato Torres", "Ariane Abdallah"] },
  { name: "Gustavo Salustiano", email: "g.salustiano@blankschool.com.br", birthDate: "13/10/2005", startDate: "29/09/2025", area: "Social Media", position: "Estagiário", seniority: "Júnior", leader: "Larissa Oliviera", squad: "5", clients: ["Renata Pocztaruk"] },
  { name: "Inara Alves", email: "inara@blankschool.com.br", birthDate: "12/03/2001", startDate: "25/08/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Larissa Oliviera", squad: "4", clients: ["Alfredo Júnior", "Nelson Lins", "Ouro Câmbio"] },
  { name: "Lucas Freitas", email: "freitas@blankschool.com.br", birthDate: "12/04/2002", startDate: "", area: "Diretoria", position: "Fundador", seniority: "Sênior", leader: "-", squad: "", clients: [] },
  { name: "Micael Crasto", email: "crasto@blankschool.com.br", birthDate: "26/01/2001", startDate: "", area: "Diretoria", position: "Fundador", seniority: "Sênior", leader: "-", squad: "", clients: [] },
  { name: "Pedro Bonzanini", email: "pedro@blankschool.com.br", birthDate: "03/07/2004", startDate: "18/03/2024", area: "Operações", position: "Coordenador de Operações", seniority: "Sênior", leader: "Micael Crasto", squad: "", clients: [] },
  { name: "André Bittencourt", email: "andre@blankschool.com.br", birthDate: "28/03/1999", startDate: "15/04/2024", area: "Social Media", position: "Coordenador de Social Media", seniority: "Sênior", leader: "Micael Crasto", squad: "", clients: [] },
  { name: "Vinicius Crasto", email: "vinicius@blankschool.com.br", birthDate: "08/11/2000", startDate: "", area: "Criação", position: "Coordenador de Criação", seniority: "Sênior", leader: "Micael Crasto", squad: "", clients: ["Ekoa"] },
  { name: "Gabriel Weizmann", email: "gabrielweizmann@blankschool.com.br", birthDate: "08/05/1999", startDate: "24/02/2025", area: "Criação", position: "Líder de Design", seniority: "Sênior", leader: "Micael Crasto", squad: "2", clients: ["Anny Meisler", "Natalia Beauty", "Efeito Empreendedor", "Lazo", "Bruno de Oliveira"] },
  { name: "Rillary Oliveira", email: "rillary@blankschool.com.br", birthDate: "05/02/2003", startDate: "10/10/2024", area: "Social Media", position: "Estrategista", seniority: "Sênior", leader: "Micael Crasto", squad: "", clients: ["Márcio Zarzur", "Dennis Wang", "Gustavo Martins"] },
  { name: "Mateus Brito", email: "m.martins@blankschool.com.br", birthDate: "16/11/2004", startDate: "27/10/2025", area: "Operações", position: "Account Manager", seniority: "Júnior", leader: "Pedro Bonzanini", squad: "", clients: [] },
  { name: "Lívia Barbosa", email: "l.barbosa@blankschool.com.br", birthDate: "21/01/2003", startDate: "10/11/2025", area: "Social Media", position: "Social Media", seniority: "Júnior", leader: "Paulo Gomes", squad: "7", clients: ["Tallis Gomes"] },
  { name: "Lorenzo Barros", email: "lorenzo@blankschool.com.br", birthDate: "10/03/2000", startDate: "16/06/2024", area: "Comercial", position: "Vendedor", seniority: "", leader: "Lucas Freitas", squad: "", clients: [] },
  { name: "Willian Lopes", email: "w.lopes@blankschool.com.br", birthDate: "02/10/1998", startDate: "07/01/2026", area: "Criação", position: "Editor de Vídeos", seniority: "", leader: "Vinicius Crasto", squad: "", clients: ["Henri Zylberstajn", "Giovanni Colacicco", "Gustavo Martins", "Dennis Wang", "Cubo Itaú"] },
  { name: "Gustavo Oliveira", email: "gustavo@blankschool.com.br", birthDate: "11/06/2001", startDate: "14/01/2026", area: "Operações", position: "", seniority: "", leader: "", squad: "", clients: [] },
];

// Map area names to team_type enum values
function mapArea(area: string): string | null {
  const areaMap: Record<string, string> = {
    "Social Media": "Social Media",
    "Criação": "Criação",
    "Operações": "Operations",
    "Diretoria": "Diretoria",
    "Comercial": "Comercial",
  };
  return areaMap[area] || null;
}

// Map seniority to enum values
function mapSeniority(seniority: string): string | null {
  const seniorityMap: Record<string, string> = {
    "Júnior": "Júnior",
    "Pleno": "Pleno",
    "Sênior": "Sênior",
  };
  return seniorityMap[seniority] || null;
}

// Parse date from DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === "") return null;
  
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  
  let day = parts[0].padStart(2, "0");
  let month = parts[1].padStart(2, "0");
  let year = parts[2];
  
  // Handle 2-digit years
  if (year.length === 2) {
    const yearNum = parseInt(year);
    year = yearNum > 50 ? `19${year}` : `20${year}`;
  }
  
  return `${year}-${month}-${day}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting team data import...');

    // Step 1: Extract and insert unique clients
    const allClients = new Set<string>();
    teamData.forEach(member => {
      member.clients.forEach(client => {
        if (client && client.trim()) {
          allClients.add(client.trim());
        }
      });
    });

    console.log(`Found ${allClients.size} unique clients`);

    const clientsArray = Array.from(allClients).map(name => ({ name }));
    
    const { data: insertedClients, error: clientsError } = await supabase
      .from('clients')
      .upsert(clientsArray, { onConflict: 'name', ignoreDuplicates: true })
      .select();

    if (clientsError) {
      console.error('Error inserting clients:', clientsError);
      throw clientsError;
    }

    // Fetch all clients to build name->id map
    const { data: allClientsData, error: fetchClientsError } = await supabase
      .from('clients')
      .select('id, name');

    if (fetchClientsError) throw fetchClientsError;

    const clientNameToId = new Map<string, string>();
    allClientsData?.forEach(c => clientNameToId.set(c.name, c.id));

    console.log(`Clients map built with ${clientNameToId.size} entries`);

    // Step 2: Insert team members (first pass - without leader_id)
    const membersToInsert = teamData.map(member => ({
      full_name: member.name,
      email: member.email,
      birth_date: parseDate(member.birthDate),
      start_date: parseDate(member.startDate),
      area: mapArea(member.area),
      position: member.position || null,
      seniority: mapSeniority(member.seniority),
      squad: member.squad || null,
      leader_id: null, // Will be updated in second pass
    }));

    const { data: insertedMembers, error: membersError } = await supabase
      .from('team_members')
      .upsert(membersToInsert, { onConflict: 'email', ignoreDuplicates: false })
      .select();

    if (membersError) {
      console.error('Error inserting team members:', membersError);
      throw membersError;
    }

    console.log(`Inserted ${insertedMembers?.length || 0} team members`);

    // Build name->id map for leaders
    const memberNameToId = new Map<string, string>();
    insertedMembers?.forEach(m => memberNameToId.set(m.full_name, m.id));

    // Step 3: Update leader references
    let leaderUpdates = 0;
    for (const member of teamData) {
      if (member.leader && member.leader !== "-" && member.leader.trim() !== "") {
        const leaderId = memberNameToId.get(member.leader);
        const memberId = memberNameToId.get(member.name);
        
        if (leaderId && memberId) {
          const { error: updateError } = await supabase
            .from('team_members')
            .update({ leader_id: leaderId })
            .eq('id', memberId);
          
          if (!updateError) leaderUpdates++;
        }
      }
    }

    console.log(`Updated ${leaderUpdates} leader references`);

    // Step 4: Create client assignments
    const clientAssignments: { team_member_id: string; client_id: string }[] = [];
    
    for (const member of teamData) {
      const memberId = memberNameToId.get(member.name);
      if (!memberId) continue;
      
      for (const clientName of member.clients) {
        const clientId = clientNameToId.get(clientName);
        if (clientId) {
          clientAssignments.push({
            team_member_id: memberId,
            client_id: clientId,
          });
        }
      }
    }

    if (clientAssignments.length > 0) {
      const { error: assignmentsError } = await supabase
        .from('team_member_clients')
        .upsert(clientAssignments, { ignoreDuplicates: true });

      if (assignmentsError) {
        console.error('Error creating client assignments:', assignmentsError);
        throw assignmentsError;
      }
    }

    console.log(`Created ${clientAssignments.length} client assignments`);

    const summary = {
      success: true,
      clientsInserted: allClients.size,
      membersInserted: insertedMembers?.length || 0,
      leaderUpdates,
      clientAssignments: clientAssignments.length,
    };

    console.log('Import completed:', summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in import-team-data:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
