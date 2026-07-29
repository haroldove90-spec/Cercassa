import { 
  User, 
  PricingConfig, 
  Client, 
  Quote, 
  InventoryItem, 
  DispatchSheet, 
  WorkProject, 
  AuditLog,
  UserRole
} from '../types';

import { 
  initialUsers, 
  initialPricingConfig, 
  initialClients, 
  initialQuotes, 
  initialInventory, 
  initialDispatchSheets, 
  initialProjects, 
  initialAuditLogs 
} from '../data/initialData';

const KEYS = {
  CURRENT_ROLE: 'cercassa_current_role',
  USERS: 'cercassa_users',
  PRICING_CONFIG: 'cercassa_pricing_config',
  CLIENTS: 'cercassa_clients',
  QUOTES: 'cercassa_quotes',
  INVENTORY: 'cercassa_inventory',
  DISPATCH_SHEETS: 'cercassa_dispatch_sheets',
  PROJECTS: 'cercassa_projects',
  AUDIT_LOGS: 'cercassa_audit_logs',
};

// Listeners for reactive state
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((fn) => fn());
}

// Current Active Role
export function getCurrentRole(): UserRole {
  const saved = localStorage.getItem(KEYS.CURRENT_ROLE);
  return (saved as UserRole) || 'admin';
}

export function setCurrentRole(role: UserRole): void {
  localStorage.setItem(KEYS.CURRENT_ROLE, role);
  notify();
}

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(KEYS.USERS);
  if (!data) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(data);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  notify();
}

// Pricing Config
export function getPricingConfig(): PricingConfig {
  const data = localStorage.getItem(KEYS.PRICING_CONFIG);
  if (!data) {
    localStorage.setItem(KEYS.PRICING_CONFIG, JSON.stringify(initialPricingConfig));
    return initialPricingConfig;
  }
  return JSON.parse(data);
}

export function savePricingConfig(config: PricingConfig): void {
  localStorage.setItem(KEYS.PRICING_CONFIG, JSON.stringify(config));
  addAuditLog('Actualización Motor de Cotización', 'Configuración', 'Se actualizaron precios base o parámetros de insumos');
  notify();
}

// Clients
export function getClients(): Client[] {
  const data = localStorage.getItem(KEYS.CLIENTS);
  if (!data) {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(initialClients));
    return initialClients;
  }
  return JSON.parse(data);
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  notify();
}

export function addClient(client: Omit<Client, 'id' | 'createdAt' | 'notes'>): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: `cli-${Date.now()}`,
    createdAt: new Date().toISOString(),
    notes: [],
  };
  clients.unshift(newClient);
  saveClients(clients);
  addAuditLog('Alta de Prospecto', 'CRM', `Se registró el cliente ${newClient.name}`);
  return newClient;
}

// Quotes
export function getQuotes(): Quote[] {
  const data = localStorage.getItem(KEYS.QUOTES);
  if (!data) {
    localStorage.setItem(KEYS.QUOTES, JSON.stringify(initialQuotes));
    return initialQuotes;
  }
  return JSON.parse(data);
}

export function saveQuotes(quotes: Quote[]): void {
  localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
  notify();
}

export function saveQuote(quote: Quote): void {
  const quotes = getQuotes();
  const index = quotes.findIndex((q) => q.id === quote.id);
  if (index >= 0) {
    quotes[index] = quote;
  } else {
    quotes.unshift(quote);
  }
  saveQuotes(quotes);
  addAuditLog('Cotización Guardada', 'Ventas', `Cotización ${quote.id} de $${quote.total.toLocaleString()} MXN`);
}

// Reserve Inventory when quote is approved / advance paid
export function approveQuoteAndReserveMaterial(quoteId: string, advanceAmount: number, paymentMethod: string, receiptUrl?: string): void {
  const quotes = getQuotes();
  const quote = quotes.find((q) => q.id === quoteId);
  if (!quote) return;

  quote.status = 'aprobada';
  quote.advancePaid = advanceAmount;
  quote.remainingBalance = quote.total - advanceAmount;
  quote.paymentMethod = paymentMethod;
  if (receiptUrl) quote.paymentReceiptUrl = receiptUrl;

  saveQuotes(quotes);

  // Reserve items in inventory
  const inventory = getInventory();
  quote.bom.forEach((bomItem) => {
    const invItem = inventory.find((i) => i.code === bomItem.code);
    if (invItem) {
      invItem.reserved += bomItem.quantity;
      invItem.available = Math.max(0, invItem.stock - invItem.reserved);
    }
  });
  saveInventory(inventory);

  // Update client status
  const clients = getClients();
  const client = clients.find((c) => c.id === quote.clientId);
  if (client) {
    client.status = 'cerrado';
    client.notes.unshift({
      id: `note-${Date.now()}`,
      text: `Cotización ${quote.id} APROBADA con anticipo de $${advanceAmount.toLocaleString()} MXN vía ${paymentMethod}.`,
      createdAt: new Date().toISOString(),
      authorName: 'Sistema Automático',
    });
    saveClients(clients);
  }

  // Create dispatch sheet in warehouse
  const dispatchSheets = getDispatchSheets();
  const newDispatch: DispatchSheet = {
    id: `HOJA-2026-${Math.floor(100 + Math.random() * 900)}`,
    quoteId: quote.id,
    clientName: quote.clientName,
    address: quote.address,
    date: new Date().toISOString().split('T')[0],
    crewLeaderId: 'u-4',
    crewLeaderName: 'Ing. Fernando Torres',
    items: quote.bom.map((item) => ({
      code: item.code,
      name: item.description,
      quantity: item.quantity,
      unit: item.unit,
      verified: false,
    })),
    status: 'pendiente',
    signedByCrewLeader: false,
  };
  dispatchSheets.unshift(newDispatch);
  saveDispatchSheets(dispatchSheets);

  // Create Field Work Project
  const projects = getWorkProjects();
  const newProject: WorkProject = {
    id: `OBRA-2026-${Math.floor(100 + Math.random() * 900)}`,
    quoteId: quote.id,
    clientId: quote.clientId,
    clientName: quote.clientName,
    clientPhone: quote.clientWhatsapp,
    address: quote.address,
    totalMeters: quote.totalMeters,
    height: quote.height,
    systemTypes: quote.systemTypes,
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: '09:00 AM',
    crewLeaderId: 'u-4',
    crewLeaderName: 'Ing. Fernando Torres',
    status: 'programada',
    materialChecklist: quote.bom.map((b) => ({
      name: b.description,
      requiredQty: b.quantity,
      unit: b.unit,
      verified: false,
    })),
    photos: [],
    incidents: [],
    finalCollectedAmount: quote.remainingBalance,
    receiptGenerated: false,
  };
  projects.unshift(newProject);
  saveWorkProjects(projects);

  addAuditLog('Anticipo Registrado & Reserva de Stock', 'Ventas/Almacén', `Cotización ${quote.id} aprobada, material reservado en almacén y obra agendada.`);
}

// Inventory
export function getInventory(): InventoryItem[] {
  const data = localStorage.getItem(KEYS.INVENTORY);
  if (!data) {
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(initialInventory));
    return initialInventory;
  }
  return JSON.parse(data);
}

export function saveInventory(items: InventoryItem[]): void {
  localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  notify();
}

export function addInventoryStock(itemId: string, addQuantity: number, supplierInvoiceNote: string): void {
  const inventory = getInventory();
  const item = inventory.find((i) => i.id === itemId);
  if (item) {
    item.stock += addQuantity;
    item.available = Math.max(0, item.stock - item.reserved);
    saveInventory(inventory);
    addAuditLog('Entrada de Proveedor', 'Almacén', `+${addQuantity} ${item.unit} de ${item.name}. Ref: ${supplierInvoiceNote}`);
  }
}

// Dispatch Sheets
export function getDispatchSheets(): DispatchSheet[] {
  const data = localStorage.getItem(KEYS.DISPATCH_SHEETS);
  if (!data) {
    localStorage.setItem(KEYS.DISPATCH_SHEETS, JSON.stringify(initialDispatchSheets));
    return initialDispatchSheets;
  }
  return JSON.parse(data);
}

export function saveDispatchSheets(sheets: DispatchSheet[]): void {
  localStorage.setItem(KEYS.DISPATCH_SHEETS, JSON.stringify(sheets));
  notify();
}

export function signDispatchSheet(sheetId: string): void {
  const sheets = getDispatchSheets();
  const sheet = sheets.find((s) => s.id === sheetId);
  if (sheet) {
    sheet.status = 'entregado';
    sheet.signedByCrewLeader = true;
    sheet.signatureTimestamp = new Date().toISOString();
    sheet.items.forEach((i) => (i.verified = true));
    saveDispatchSheets(sheets);

    // Deduct stock real and decrease reserved
    const inventory = getInventory();
    sheet.items.forEach((item) => {
      const inv = inventory.find((i) => i.code === item.code);
      if (inv) {
        inv.stock = Math.max(0, inv.stock - item.quantity);
        inv.reserved = Math.max(0, inv.reserved - item.quantity);
        inv.available = Math.max(0, inv.stock - inv.reserved);
      }
    });
    saveInventory(inventory);

    addAuditLog('Firma de Hoja de Salida', 'Almacén', `Cuadrilla recibió materiales de ${sheet.id} para ${sheet.clientName}`);
  }
}

// Work Projects (Field)
export function getWorkProjects(): WorkProject[] {
  const data = localStorage.getItem(KEYS.PROJECTS);
  if (!data) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(initialProjects));
    return initialProjects;
  }
  return JSON.parse(data);
}

export function saveWorkProjects(projects: WorkProject[]): void {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  notify();
}

export function checkinProject(projectId: string): void {
  const projects = getWorkProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.status = 'en_sitio';
    project.checkinTime = new Date().toISOString();
    saveWorkProjects(projects);
    addAuditLog('Check-in en Obra', 'Campo', `Cuadrilla en sitio para ${project.clientName} (${project.id})`);
  }
}

export function addProjectPhoto(projectId: string, photo: { stage: 'antes' | 'durante' | 'despues'; url: string; caption?: string }): void {
  const projects = getWorkProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.photos.push({
      id: `ph-${Date.now()}`,
      stage: photo.stage,
      url: photo.url,
      caption: photo.caption,
      timestamp: new Date().toISOString(),
    });
    if (project.status === 'en_sitio') {
      project.status = 'en_proceso';
    }
    saveWorkProjects(projects);
    addAuditLog('Evidencia Fotográfica', 'Campo', `Foto [${photo.stage.toUpperCase()}] agregada a ${project.id}`);
  }
}

export function addProjectIncident(projectId: string, description: string): void {
  const projects = getWorkProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.incidents.push({
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      resolved: false,
    });
    project.status = 'incidencia';
    saveWorkProjects(projects);
    addAuditLog('Incidencia en Obra', 'Campo', `Incidencia en ${project.id}: ${description}`);
  }
}

export function completeProject(
  projectId: string, 
  signatureDataUrl: string, 
  customerNameSigned: string, 
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta'
): void {
  const projects = getWorkProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.status = 'completada';
    project.customerSignature = signatureDataUrl;
    project.customerNameSigned = customerNameSigned;
    project.finalPaymentMethod = paymentMethod;
    project.receiptGenerated = true;
    project.completedAt = new Date().toISOString();
    saveWorkProjects(projects);

    // Mark quote as fully paid / completed
    const quotes = getQuotes();
    const quote = quotes.find((q) => q.id === project.quoteId);
    if (quote) {
      quote.remainingBalance = 0;
      saveQuotes(quotes);
    }

    addAuditLog('Obra Finalizada & Cierre de Conformidad', 'Campo', `Obra ${project.id} concluida. Firma de conformidad recibida de ${customerNameSigned}. Recibo generado.`);
  }
}

// Audit Logs
export function getAuditLogs(): AuditLog[] {
  const data = localStorage.getItem(KEYS.AUDIT_LOGS);
  if (!data) {
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(initialAuditLogs));
    return initialAuditLogs;
  }
  return JSON.parse(data);
}

export function addAuditLog(action: string, module: string, details: string): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'u-current',
    userName: getCurrentRoleLabel(),
    action,
    module,
    details,
  };
  logs.unshift(newLog);
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100))); // Keep last 100
  notify();
}

export function getCurrentRoleLabel(): string {
  const role = getCurrentRole();
  switch (role) {
    case 'admin': return 'Ing. Carlos Mendoza (Admin)';
    case 'sales': return 'Lic. Sofía Ramírez (Ventas)';
    case 'warehouse': return 'Don Roberto Hernández (Almacén)';
    case 'field': return 'Ing. Fernando Torres (Cuadrilla)';
  }
}

// Reset System to Initial Demo Data
export function resetSystemData(): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  localStorage.setItem(KEYS.PRICING_CONFIG, JSON.stringify(initialPricingConfig));
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(initialClients));
  localStorage.setItem(KEYS.QUOTES, JSON.stringify(initialQuotes));
  localStorage.setItem(KEYS.INVENTORY, JSON.stringify(initialInventory));
  localStorage.setItem(KEYS.DISPATCH_SHEETS, JSON.stringify(initialDispatchSheets));
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(initialProjects));
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(initialAuditLogs));
  notify();
}
