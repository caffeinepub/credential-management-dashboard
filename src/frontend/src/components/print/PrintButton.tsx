import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Credential } from '../../types/credentials';

interface PrintButtonProps {
  data: Credential[];
}

export default function PrintButton({ data }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint} className="gap-2">
      <Printer className="h-4 w-4" />
      Print
    </Button>
  );
}
