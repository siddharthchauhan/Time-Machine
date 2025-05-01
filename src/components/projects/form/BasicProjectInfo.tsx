
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicProjectInfoProps {
  name: string;
  description: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicProjectInfo = ({ name, description, onChange }: BasicProjectInfoProps) => {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">Project Name*</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description || ""}
          onChange={onChange}
          rows={3}
        />
      </div>
    </>
  );
};

export default BasicProjectInfo;
