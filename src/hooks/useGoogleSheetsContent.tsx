import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentItem {
  id: string;
  status: string;
  date: string;
  format: string;
  url: string;
  socialMedia: string;
  client: string;
}

interface SheetsResponse {
  items: ContentItem[];
  fetchedAt: string;
}

async function fetchSheetsContent(): Promise<SheetsResponse> {
  const { data, error } = await supabase.functions.invoke('fetch-sheets-content');
  
  if (error) {
    console.error('Error fetching sheets content:', error);
    throw new Error(error.message || 'Failed to fetch content');
  }
  
  return data as SheetsResponse;
}

export function useGoogleSheetsContent() {
  return useQuery({
    queryKey: ['google-sheets-content'],
    queryFn: fetchSheetsContent,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
