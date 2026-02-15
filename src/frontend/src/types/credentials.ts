export interface Credential {
  id: string;
  category: string;
  name: string;
  designation: string;
  ranges: string[];
  branch: string[];
  loginId: string;
  password: string;
  mobile: string;
  emailUrl: string;
  remarks: string;
  createdAt: number;
  updatedAt: number;
}

export type CredentialFormData = Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>;
