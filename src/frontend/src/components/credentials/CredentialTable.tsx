import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Credential } from '../../types/credentials';
import PasswordCell from './PasswordCell';
import CopyButton from './CopyButton';
import DeleteCredentialConfirm from './DeleteCredentialConfirm';
import { useState } from 'react';

interface CredentialTableProps {
  data: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  startIndex: number;
}

export default function CredentialTable({ data, onEdit, onDelete, startIndex }: CredentialTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100 dark:bg-slate-700 z-10">
            <TableRow>
              <TableHead className="w-16">Sr No</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Ranges</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Login ID</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email/URL</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="w-24 print:hidden">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cred, index) => (
              <TableRow
                key={cred.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 even:bg-slate-50/50 dark:even:bg-slate-800/50"
              >
                <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                <TableCell>{cred.category}</TableCell>
                <TableCell className="font-medium">{cred.name}</TableCell>
                <TableCell>{cred.designation}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cred.ranges.map(range => (
                      <Badge key={range} variant="secondary" className="text-xs">
                        {range}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cred.branch.map(branch => (
                      <Badge key={branch} variant="outline" className="text-xs">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{cred.loginId}</span>
                    <CopyButton text={cred.loginId} label="Login ID" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PasswordCell password={cred.password} />
                    <CopyButton text={cred.password} label="Password" />
                  </div>
                </TableCell>
                <TableCell>{cred.mobile}</TableCell>
                <TableCell className="max-w-xs truncate">{cred.emailUrl}</TableCell>
                <TableCell className="max-w-xs truncate">{cred.remarks}</TableCell>
                <TableCell className="print:hidden">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cred)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(cred.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteCredentialConfirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}
