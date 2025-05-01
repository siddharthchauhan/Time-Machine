
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetFieldsProps {
  budgetHours: number | undefined;
  budgetAmount: number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BudgetFields = ({ budgetHours, budgetAmount, onChange }: BudgetFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="budgetHours">Budget (Hours)</Label>
        <Input
          id="budgetHours"
          name="budgetHours"
          type="number"
          min="0"
          step="0.5"
          value={budgetHours || ""}
          onChange={onChange}
          placeholder="0.0"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="budgetAmount">Budget (Amount)</Label>
        <Input
          id="budgetAmount"
          name="budgetAmount"
          type="number"
          min="0"
          step="0.01"
          value={budgetAmount || ""}
          onChange={onChange}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default BudgetFields;
