import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Position = Database["public"]["Tables"]["positions"]["Row"];
type TeamType = Database["public"]["Enums"]["team_type"];

const TEAMS: TeamType[] = ["Creative", "Marketing", "Client Services", "Operations"];

const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  position_id: z.string().nullable(),
  team: z.enum(["Creative", "Marketing", "Client Services", "Operations"]).nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: {
    full_name: string;
    email: string;
    position_id: string | null;
    team: TeamType | null;
  };
  positions: Position[];
  userRole: string;
  onSubmit: (data: ProfileFormData) => void;
  isSubmitting: boolean;
}

export function ProfileForm({
  initialData,
  positions,
  userRole,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData.full_name,
      position_id: initialData.position_id,
      team: initialData.team,
    },
  });

  const handleSubmit = (data: ProfileFormData) => {
    onSubmit({
      ...data,
      position_id: data.position_id === "none" ? null : data.position_id,
      team: data.team === null ? null : data.team,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Input value={initialData.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <FormField
          control={form.control}
          name="position_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No position</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                defaultValue={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No team</SelectItem>
                  {TEAMS.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Role</FormLabel>
          <div className="flex items-center gap-2">
            <Badge variant={userRole === "admin" ? "default" : "secondary"}>
              {userRole === "admin" ? "Admin" : "User"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Role is managed by administrators
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
