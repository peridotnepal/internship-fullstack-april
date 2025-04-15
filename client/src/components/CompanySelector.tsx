
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanySelectorProps {
  companies: string[];
  selectedCompany: string;
  onSelectCompany: (company: string) => void;
}

export const CompanySelector = ({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanySelectorProps) => {
  return (
    <Select value={selectedCompany} onValueChange={onSelectCompany}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company} value={company}>
            {company}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
