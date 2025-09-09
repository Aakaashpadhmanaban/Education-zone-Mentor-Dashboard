import { Bell, RefreshCw, Maximize2 } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">
        SHREEJI Education zone Power Pack
      </h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Maximize2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}