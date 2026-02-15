import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_OPTIONS, RANGES_OPTIONS, BRANCH_OPTIONS } from '../../constants/credentialOptions';
import { CredentialFormData } from '../../types/credentials';
import { Eye, EyeOff } from 'lucide-react';
import BadgeMultiSelect from './BadgeMultiSelect';

interface CredentialFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CredentialFormData) => void;
  initialData?: any;
  mode: 'add' | 'edit';
}

export default function CredentialFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: CredentialFormModalProps) {
  const [formData, setFormData] = useState<CredentialFormData>({
    category: '',
    name: '',
    designation: '',
    ranges: [],
    branch: [],
    loginId: '',
    password: '',
    mobile: '',
    emailUrl: '',
    remarks: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || '',
        name: initialData.name || '',
        designation: initialData.designation || '',
        ranges: initialData.ranges || [],
        branch: initialData.branch || [],
        loginId: initialData.loginId || '',
        password: initialData.password || '',
        mobile: initialData.mobile || '',
        emailUrl: initialData.emailUrl || '',
        remarks: initialData.remarks || '',
      });
    } else {
      setFormData({
        category: '',
        name: '',
        designation: '',
        ranges: [],
        branch: [],
        loginId: '',
        password: '',
        mobile: '',
        emailUrl: '',
        remarks: '',
      });
    }
    setShowPassword(false);
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Credential' : 'Edit Credential'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ranges *</Label>
              <BadgeMultiSelect
                options={RANGES_OPTIONS}
                selected={formData.ranges}
                onChange={(ranges) => setFormData({ ...formData, ranges })}
                placeholder="Select ranges"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Branch *</Label>
              <BadgeMultiSelect
                options={BRANCH_OPTIONS}
                selected={formData.branch}
                onChange={(branch) => setFormData({ ...formData, branch })}
                placeholder="Select branch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginId">Login ID *</Label>
              <Input
                id="loginId"
                value={formData.loginId}
                onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailUrl">Email/URL</Label>
              <Input
                id="emailUrl"
                value={formData.emailUrl}
                onChange={(e) => setFormData({ ...formData, emailUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Credential' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
