
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
}

const DescriptionField = ({ description, setDescription }: DescriptionFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Describe the work you did..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default DescriptionField;
