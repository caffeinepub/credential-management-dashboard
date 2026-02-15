import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordCellProps {
  password: string;
}

export default function PasswordCell({ password }: PasswordCellProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {visible ? password : '••••••••'}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setVisible(!visible)}
        className="h-7 w-7 print:hidden"
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}
