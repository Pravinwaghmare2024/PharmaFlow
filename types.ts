
export enum InquiryStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  QUOTED = 'QUOTED',
  FOLLOW_UP = 'FOLLOW_UP',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export enum LeadStatus {
  PROSPECT = 'PROSPECT',
  QUALIFIED = 'QUALIFIED',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST'
}

export enum BatchStatus {
  PLANNED = 'PLANNED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  QC_PENDING = 'QC_PENDING',
  RELEASED = 'RELEASED',
  REJECTED = 'REJECTED'
}

export type UnitType = 'KG' | 'BOX' | 'DRUM' | 'PACKET';

export interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: UnitType;
  status: BatchStatus;
  manufacturingDate: string;
  expiryDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Raw Material' | 'Packaging' | 'Finished Good';
  quantity: number;
  unit: UnitType;
  minThreshold: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  uploadedBy: string;
  uploadedAt: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  estimatedValue: number;
  status: LeadStatus;
  source: string;
  outcomeReason?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  type: 'Hospital' | 'Pharmacy' | 'Distributor' | 'Clinic';
  address: string;
}

export interface Product {
  id: string;
  name: string;
  dosageForm: string;
  strength: string;
  packSize: string;
  unitPrice: number;
  category: 'Antibiotics' | 'Chronic' | 'OTC' | 'Specialty';
  stock: number;
}

export interface FollowUp {
  id: string;
  date: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  summary: string;
  outcome: string;
  nextStepDate?: string;
}

export interface Inquiry {
  id: string;
  customerId: string;
  customerName: string;
  status: InquiryStatus;
  date: string;
  products: string[]; 
  notes: string;
  assignedTo: string;
  followUps?: FollowUp[];
}

export interface Quotation {
  id: string;
  inquiryId: string;
  customerId: string;
  customerName: string;
  date: string;
  expiryDate: string;
  items: QuotationItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired' | 'Pending Approval' | 'Approved';
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}
