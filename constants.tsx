
import React from 'react';
import { LeadStatus } from './types';

export const COLORS = {
  primary: '#0f172a',
  secondary: '#334155',
  accent: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const MOCK_CUSTOMERS = [
  { id: 'C1', name: 'St. Mary\'s General Hospital', contactPerson: 'Dr. Sarah Wilson', email: 'wilson@stmarys.org', phone: '+1 555-0101', type: 'Hospital', address: '123 Medical Plaza, NY' },
  { id: 'C2', name: 'HealthFirst Pharmacy', contactPerson: 'Mark Miller', email: 'mark@healthfirst.com', phone: '+1 555-0102', type: 'Pharmacy', address: '456 Main St, CA' },
  { id: 'C3', name: 'Global Pharma Distributors', contactPerson: 'Emma Davis', email: 'e.davis@globaldist.com', phone: '+1 555-0103', type: 'Distributor', address: '789 Logistics Way, NJ' },
];

export const MOCK_PRODUCTS = [
  { id: 'P1', name: 'Amoxicillin 500mg', dosageForm: 'Capsule', strength: '500mg', packSize: '10x10', unitPrice: 12.50, category: 'Antibiotics', stock: 1250 },
  { id: 'P2', name: 'Paracetamol 650mg', dosageForm: 'Tablet', strength: '650mg', packSize: '10x10', unitPrice: 5.20, category: 'OTC', stock: 5000 },
  { id: 'P3', name: 'Omeprazole 20mg', dosageForm: 'Delayed-Release', strength: '20mg', packSize: '14s', unitPrice: 8.75, category: 'Chronic', stock: 840 },
  { id: 'P4', name: 'Metformin 500mg', dosageForm: 'Tablet', strength: '500mg', packSize: '30s', unitPrice: 4.50, category: 'Chronic', stock: 2100 },
  { id: 'P5', name: 'Azithromycin 250mg', dosageForm: 'Tablet', strength: '250mg', packSize: '6s', unitPrice: 15.00, category: 'Antibiotics', stock: 450 },
  { id: 'P6', name: 'Insulin Glargine', dosageForm: 'Injection', strength: '100U/ml', packSize: '3ml Pen', unitPrice: 45.00, category: 'Specialty', stock: 120 },
];

export const MOCK_LEADS = [
  { id: 'LD-001', companyName: 'City Children\'s Clinic', contactPerson: 'Dr. Liam Neeson', email: 'liam@citykids.med', phone: '555-9001', estimatedValue: 12000, status: LeadStatus.PROSPECT, source: 'Website', createdAt: '2023-11-15' },
  { id: 'LD-002', companyName: 'MediTrust Pharmacies', contactPerson: 'Susan Bones', email: 's.bones@meditrust.com', phone: '555-9002', estimatedValue: 45000, status: LeadStatus.NEGOTIATION, source: 'Referral', createdAt: '2023-11-18' },
  { id: 'LD-003', companyName: 'North Star Hospital', contactPerson: 'James Gordon', email: 'gordon@nstar.org', phone: '555-9003', estimatedValue: 85000, status: LeadStatus.WON, source: 'Trade Show', createdAt: '2023-11-10', outcomeReason: 'Strategic partnership discount' },
];
