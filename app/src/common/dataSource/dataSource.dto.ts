export interface StoreDataSourceDTO {
  id: string;
  cnpj: string;
  email: string;
  name: string;
  fantasy_name: string;
  phone: string;
  salt: string;
  password_hash: string;
  created_at: string;
}

export interface StoreWithTotemsDataSourceDTO {
  id: string;
  cnpj: string;
  email: string;
  name: string;
  fantasy_name: string;
  phone: string;
  salt: string;
  password_hash: string;
  created_at: string;
  totems: TotemDataSourceDTO[];
}

export interface TotemDataSourceDTO {
  id: string;
  store_id: string;
  name: string;
  token_access: string;
  created_at: string;
}
