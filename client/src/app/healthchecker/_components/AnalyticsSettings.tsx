import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

const AnalyticsSettings = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-none flex gap-1 items-center text-xs hover:text-blue-500 hover:underline  outline-none text-gray-500 data-[state=open]:text-blue-500 data-[state=open]:underline">
          <Settings className="w-4 h-4" />
          <p>analytics settings</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 hover:bg-none text-white border ">
        <div>
          profile
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

};

export default AnalyticsSettings;
