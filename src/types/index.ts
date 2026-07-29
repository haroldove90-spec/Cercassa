export type UserRole = 'admin' | 'sales' | 'warehouse' | 'field';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  phone: string;
  avatar?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
}

export type FenceSystemType = 
  | 'malla_ciclonica' 
  | 'cerca_electrificada' 
  | 'concertina' 
  | 'reja_acero' 
  | 'cinta_privacidad';

export interface BasePriceItem {
  id: string;
  code: string;
  name: string;
  systemType: FenceSystemType;
  unit: string;
  costPerUnit: number;
  salePricePerUnit: number;
  specs: string;
}

export interface PricingConfig {
  basePrices: BasePriceItem[];
  inputParams: {
    postDistanceMeters: number; // e.g. 2.5m between posts
    topTubeLengthMeters: number; // e.g. 6m per tube
    concreteBucketsPerPost: number; // e.g. 1 bucket per post
    tieWireKgPer100m: number; // e.g. 2.5 kg
    barbedWireLinesDefault: number; // e.g. 3 lines on top
  };
  laborRates: {
    malla_ciclonica: number; // $/m
    cerca_electrificada: number; // $/m
    concertina: number; // $/m
    reja_acero: number; // $/m
    cinta_privacidad: number; // $/m
  };
  freightRates: {
    pricePerKm: number;
    zoneAFlat: number; // Local 0-15km
    zoneBFlat: number; // Regional 15-40km
    zoneCFlat: number; // Distante 40km+
  };
}

export type PropertyType = 'residencial' | 'industrial' | 'terreno' | 'comercial' | 'ejidal';

export type ClientStatus = 'prospecto' | 'cotizado' | 'en_negociacion' | 'cerrado' | 'perdido';

export interface ClientNote {
  id: string;
  text: string;
  createdAt: string;
  authorName: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  address: string;
  propertyType: PropertyType;
  status: ClientStatus;
  createdAt: string;
  notes: ClientNote[];
}

export interface BOMItem {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  unitPrice: number;
  totalPrice: number;
  category: 'mallas' | 'tubos' | 'alambres' | 'accesorios' | 'cemento' | 'electrificacion';
}

export type QuoteStatus = 'borrador' | 'enviada' | 'aprobada' | 'vencida' | 'cancelada';

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  clientWhatsapp: string;
  address: string;
  totalMeters: number;
  height: number;
  systemTypes: FenceSystemType[];
  notes: string;
  bom: BOMItem[];
  materialCost: number;
  laborCost: number;
  freightCost: number;
  subtotal: number;
  discount: number;
  total: number;
  advancePaid: number;
  remainingBalance: number;
  status: QuoteStatus;
  validUntil: string; // ISO Date string
  createdAt: string;
  freightZone?: 'Zone A' | 'Zone B' | 'Zone C';
  paymentReceiptUrl?: string;
  paymentMethod?: string;
}

export type InventoryCategory = 'mallas' | 'tubos' | 'alambres' | 'accesorios' | 'cemento' | 'electrificacion';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  stock: number;
  reserved: number;
  available: number;
  minThreshold: number;
  unitCost: number;
  supplier: string;
  location: string;
}

export interface DispatchItem {
  code: string;
  name: string;
  quantity: number;
  unit: string;
  verified: boolean;
}

export type DispatchStatus = 'pendiente' | 'entregado' | 'en_transito' | 'completado';

export interface DispatchSheet {
  id: string;
  quoteId: string;
  clientName: string;
  address: string;
  date: string;
  crewLeaderId: string;
  crewLeaderName: string;
  items: DispatchItem[];
  status: DispatchStatus;
  signedByCrewLeader: boolean;
  signatureTimestamp?: string;
}

export type ProjectStatus = 'programada' | 'en_sitio' | 'en_proceso' | 'completada' | 'incidencia';

export interface SitePhoto {
  id: string;
  stage: 'antes' | 'durante' | 'despues';
  url: string;
  timestamp: string;
  caption?: string;
}

export interface SiteIncident {
  id: string;
  timestamp: string;
  description: string;
  resolved: boolean;
}

export interface SiteMaterialCheck {
  name: string;
  requiredQty: number;
  unit: string;
  verified: boolean;
}

export interface WorkProject {
  id: string;
  quoteId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  address: string;
  totalMeters: number;
  height: number;
  systemTypes: FenceSystemType[];
  scheduledDate: string;
  scheduledTime: string;
  crewLeaderId: string;
  crewLeaderName: string;
  status: ProjectStatus;
  checkinTime?: string;
  materialChecklist: SiteMaterialCheck[];
  photos: SitePhoto[];
  incidents: SiteIncident[];
  customerSignature?: string;
  customerNameSigned?: string;
  finalCollectedAmount: number;
  finalPaymentMethod?: 'efectivo' | 'transferencia' | 'tarjeta';
  receiptGenerated: boolean;
  completedAt?: string;
}
