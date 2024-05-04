export interface WalletData {
    id: string;
    label_wallet: string;
    description_wallet: string | null;
    isActive: boolean;
    meta: any | null;
    balance: number;
    createDate: Date;
    updateDate: Date;
    type: string | null;
  }