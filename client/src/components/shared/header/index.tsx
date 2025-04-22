import Container from "../container";
import { Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Container className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-75 blur"></div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NepalPortfolio</h1>
        </div>
      </Container>
    </header>
  );
};

export default Header;
