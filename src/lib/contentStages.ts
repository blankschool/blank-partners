export interface ContentStage {
  key: string;
  label: string;
  category: 'todo' | 'inProgress' | 'final';
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CONTENT_STAGES: ContentStage[] = [
  // A fazer (To do)
  { key: 'backlog', label: 'Backlog', category: 'todo', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-muted' },
  { key: 'rascunho', label: 'Rascunho', category: 'todo', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  
  // Em andamento (In progress)
  { key: 'escrita', label: 'Escrita', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { key: 'aprovacao escrita', label: 'Aprovação escrita', category: 'inProgress', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  { key: 'em briefing', label: 'Em briefing', category: 'inProgress', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  { key: 'ajustes escrita', label: 'Ajustes Escrita', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { key: 'gravacao de video', label: 'Gravação de vídeo', category: 'inProgress', color: 'text-pink-600', bgColor: 'bg-pink-100', borderColor: 'border-pink-200' },
  { key: 'gravacao de audio', label: 'Gravação de áudio', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { key: 'edicao de video', label: 'Edição de vídeo', category: 'inProgress', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
  { key: 'criacao design', label: 'Criação Design', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { key: 'aprovacao post', label: 'Aprovação post', category: 'inProgress', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  { key: 'ajustes edicao de video', label: 'Ajustes edição de vídeo', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  { key: 'ajustes criacao design', label: 'Ajustes criação design', category: 'inProgress', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  
  // Final
  { key: 'pronto para postar', label: 'Pronto para postar', category: 'final', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
  { key: 'publicado', label: 'Publicado', category: 'final', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
  { key: 'cancelado', label: 'Cancelado', category: 'final', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
];

export const SOCIAL_MEDIA_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { key: 'linkedin', label: 'LinkedIn', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { key: 'youtube', label: 'YouTube', color: 'text-red-600', bgColor: 'bg-red-100' },
  { key: 'tiktok', label: 'TikTok', color: 'text-foreground', bgColor: 'bg-muted' },
];

export function normalizeStatus(status: string): string {
  return status
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')     // Remove emojis
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/gi, '')   // Remove special chars
    .normalize('NFD')                            // Decompose accents
    .replace(/[\u0300-\u036f]/g, '')            // Remove accent marks
    .toLowerCase()
    .trim();
}

export function getStageConfig(status: string): ContentStage | undefined {
  const cleanedStatus = normalizeStatus(status);
  return CONTENT_STAGES.find(stage => stage.key === cleanedStatus);
}

export function getPlatformConfig(platform: string) {
  const normalizedPlatform = platform.toLowerCase().trim();
  return SOCIAL_MEDIA_PLATFORMS.find(p => p.key === normalizedPlatform);
}

export interface StageGroup {
  key: string;
  label: string;
  stages: string[];
  color: string;
  bgColor: string;
  borderColor: string;
}

export const STAGE_GROUPS: StageGroup[] = [
  {
    key: 'escrevendo',
    label: 'Escrevendo',
    stages: ['backlog', 'rascunho', 'escrita', 'aprovacao escrita', 'em briefing', 'ajustes escrita'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  {
    key: 'criacao',
    label: 'Criação',
    stages: ['gravacao de video', 'gravacao de audio', 'edicao de video', 'criacao design', 'ajustes edicao de video', 'ajustes criacao design'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    key: 'aprovacao',
    label: 'Aprovação',
    stages: ['aprovacao post'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    key: 'pronto',
    label: 'Pronto para postar',
    stages: ['pronto para postar'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  {
    key: 'publicado',
    label: 'Publicado',
    stages: ['publicado'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    key: 'cancelado',
    label: 'Cancelado',
    stages: ['cancelado'],
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  }
];

export function getStageGroup(status: string): StageGroup | undefined {
  const normalizedStatus = normalizeStatus(status);
  return STAGE_GROUPS.find(group => group.stages.includes(normalizedStatus));
}
