import { ContentItem } from "@/hooks/useGoogleSheetsContent";
import { getStageConfig, getPlatformConfig } from "@/lib/contentStages";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Calendar, User } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContentCardProps {
  item: ContentItem;
  variant?: "grid" | "list";
}

export function ContentCard({ item, variant = "grid" }: ContentCardProps) {
  const stageConfig = getStageConfig(item.status);
  const platformConfig = getPlatformConfig(item.socialMedia);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    
    // Try different date formats
    let date: Date | null = null;
    
    // Try ISO format
    try {
      date = parseISO(dateStr);
      if (!isValid(date)) date = null;
    } catch {}
    
    // Try DD/MM/YYYY format
    if (!date && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isValid(date)) date = null;
      }
    }
    
    if (date && isValid(date)) {
      return format(date, "dd MMM", { locale: ptBR });
    }
    
    return dateStr;
  };

  if (variant === "list") {
    return (
      <div className="flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-muted/30 cursor-pointer">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{item.id || "Sem título"}</h3>
          {item.client && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.client}
            </p>
          )}
        </div>
        
        {platformConfig && (
          <Badge variant="secondary" className={cn(platformConfig.bgColor, platformConfig.color)}>
            {platformConfig.label}
          </Badge>
        )}
        
        {stageConfig && (
          <Badge variant="outline" className={cn(stageConfig.bgColor, stageConfig.color, stageConfig.borderColor)}>
            {stageConfig.label}
          </Badge>
        )}
        
        {item.date && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(item.date)}
          </span>
        )}
        
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          {platformConfig && (
            <Badge variant="secondary" className={cn(platformConfig.bgColor, platformConfig.color, "text-xs")}>
              {platformConfig.label}
            </Badge>
          )}
          {stageConfig && (
            <Badge variant="outline" className={cn(stageConfig.bgColor, stageConfig.color, stageConfig.borderColor, "text-xs")}>
              {stageConfig.label}
            </Badge>
          )}
        </div>
        
        <h3 className="mt-4 font-medium text-foreground line-clamp-2">
          {item.id || "Sem título"}
        </h3>
        
        {item.client && (
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {item.client}
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          {item.format && (
            <Badge variant="secondary" className="text-xs">
              {item.format}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            {item.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.date)}
              </span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
