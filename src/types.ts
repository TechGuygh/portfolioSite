export type Role = 'Admin' | 'Salesperson' | 'InventoryManager';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface ProductVariant {
  id: string;
  attributes: Record<string, string>;
  price: number;
  stock_quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  cost_price: number;
  retail_price: number;
  wholesale_price: number;
  stock_quantity: number;
  min_stock_level: number;
  expiry_date?: string;
  barcode?: string;
  image_url?: string;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface Incident {
  id: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  type_id: string;
  type_name: string;
  createdBy: string;
  createdAt: string;
}

export interface IncidentType {
  id: string;
  name: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  date: string;
  total_amount: number;
  type: 'retail' | 'wholesale' | 'credit';
  payment_method: 'cash' | 'online' | 'pos';
  customer_name: string;
  customer_id?: string | null;
  salesperson_id: string;
  items?: SaleItem[];
}

export interface ProductPerformance {
  name: string;
  category: string;
  quantity_sold: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  profit_margin: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  credit_limit: number;
  outstanding_balance: number;
  created_at: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact_info?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  balance: number;
}

export interface SupplierInvoice {
  id: string;
  supplier_id: string;
  supplier_name?: string;
  invoice_number: string;
  date: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'partial';
}

export interface SupplierPayment {
  id: string;
  supplier_id: string;
  invoice_id: string;
  amount: number;
  date: string;
  payment_method: string;
  invoice_number?: string;
}

export interface CustomerCreditTransaction {
  id: string;
  customer_id: string;
  sale_id?: string | null;
  type: 'debt' | 'payment';
  amount: number;
  date: string;
  description: string;
}

export interface SavedReport {
  id: string;
  name: string;
  filters: any;
  created_at: string;
}

