import type {
  Vehicle, HealthScore, LiveTelemetry, SOHTrend, StressEvent,
  RULEstimate, BatteryPassport, MaintenanceItem, ServiceRecord,
  InsurancePolicy, Claim, DueItem, Transaction, Dealer,
  CarbonData, Alert, Trip,
} from "@/types";

// ─── TEST CREDENTIALS ────────────────────────────────────────────────────────
export const TEST_CHASSIS = "AEGIS2024TEST001";
export const TEST_OTP     = "123456";
export const TEST_MOBILE  = "+91 98XXXX7890";

// ─── VEHICLE ─────────────────────────────────────────────────────────────────
export const mockVehicle: Vehicle = {
  chassisNumber:       "AEGIS2024TEST001",
  registrationNo:      "TN 33 EV 2024",
  make:                "Tata",
  model:               "Nexon EV Max",
  variant:             "XZ+ LUX",
  year:                2023,
  color:               "Pristine White",
  purchaseDate:        "2023-04-15",
  ownerName:           "Gowtham R",
  ownerMobile:         TEST_MOBILE,
  registeredCity:      "Erode",
  registeredState:     "Tamil Nadu",
  batteryCapacityKwh:  40.5,
  batteryChemistry:    "LFP",
  motorPowerKw:        143,
  ratedRangeKm:        437,
  status:              "online",
  lastSeenAt:          new Date().toISOString(),
};

// ─── HEALTH SCORE ────────────────────────────────────────────────────────────
export const mockHealthScore: HealthScore = {
  overall:          78,
  batteryHealth:    87,
  mechanicalHealth: 82,
  chargingSystem:   91,
  softwareStatus:   95,
  tyresBrakes:      70,
  grade:            "good",
  gradeLabel:       "Good — Monitor Tyres & Brakes",
};

// ─── LIVE TELEMETRY ──────────────────────────────────────────────────────────
export const mockTelemetry: LiveTelemetry = {
  soc:               72,
  soh:               87,
  estimatedRangeKm:  274,
  isCharging:        false,
  chargingRateKw:    0,
  timeToFullCharge:  "—",
  recommendedChargeTarget: 80,
  currentSpeedKmh:   0,
  odometreKm:        18420,
  cabinTempC:        32,
  ambientTempC:      34,
  lastUpdatedAt:     new Date().toISOString(),
};

// ─── SOH TREND (24 months) ───────────────────────────────────────────────────
export const mockSOHTrend: SOHTrend[] = [
  { date: "2023-05-01", soh: 100.0, cycleCount: 0 },
  { date: "2023-07-01", soh: 99.1,  cycleCount: 18 },
  { date: "2023-09-01", soh: 98.2,  cycleCount: 41, event: "stress", eventLabel: "High-temp park" },
  { date: "2023-11-01", soh: 97.4,  cycleCount: 67 },
  { date: "2024-01-01", soh: 96.5,  cycleCount: 94 },
  { date: "2024-03-01", soh: 95.1,  cycleCount: 121, event: "stress", eventLabel: "Deep discharge" },
  { date: "2024-05-01", soh: 93.8,  cycleCount: 149 },
  { date: "2024-07-01", soh: 92.3,  cycleCount: 178, event: "service", eventLabel: "Annual service" },
  { date: "2024-09-01", soh: 90.9,  cycleCount: 208 },
  { date: "2024-11-01", soh: 89.5,  cycleCount: 237 },
  { date: "2025-01-01", soh: 88.4,  cycleCount: 268 },
  { date: "2025-03-01", soh: 87.8,  cycleCount: 291, event: "update", eventLabel: "BMS v2.4 update" },
  { date: "2025-05-01", soh: 87.0,  cycleCount: 312 },
];

// ─── STRESS EVENTS ───────────────────────────────────────────────────────────
export const mockStressEvents: StressEvent[] = [
  {
    id: "se001",
    type: "high_temp_park",
    date: "2023-09-04",
    severity: "medium",
    sohImpact: -0.04,
    description: "Vehicle parked in direct sunlight for 6+ hours, battery temp reached 48°C",
    recommendation: "Enable cabin pre-cool 10 min before parking to reduce thermal load",
  },
  {
    id: "se002",
    type: "deep_discharge",
    date: "2024-03-12",
    severity: "high",
    sohImpact: -0.08,
    description: "Battery depleted to 4% SOC — below the recommended 10% floor",
    recommendation: "Set a low-charge reminder at 20% to avoid deep discharge events",
  },
  {
    id: "se003",
    type: "dc_fast_charge",
    date: "2024-06-18",
    severity: "low",
    sohImpact: -0.02,
    description: "DC fast charging used 5 times in one week at >80% SOC",
    recommendation: "Limit DC fast charging to once per week and stop at 80% SOC",
  },
  {
    id: "se004",
    type: "cold_charge",
    date: "2025-01-08",
    severity: "low",
    sohImpact: -0.01,
    description: "Charging initiated at 6°C ambient temperature without pre-conditioning",
    recommendation: "Pre-condition battery for 15 min before cold-weather charging",
  },
];

// ─── RUL ESTIMATE ────────────────────────────────────────────────────────────
export const mockRUL: RULEstimate = {
  estimatedYears70Soh:  4.8,
  estimatedYears50Soh:  9.2,
  confidenceLow:        4.2,
  confidenceHigh:       5.6,
  primaryDegradationFactor: "Frequent high-temperature parking accelerates cell ageing",
  projectedSoh1Year:    84.5,
  projectedSoh3Year:    79.1,
  projectedSoh5Year:    73.8,
};

// ─── BATTERY PASSPORT ─────────────────────────────────────────────────────────
export const mockPassport: BatteryPassport = {
  batteryId:          "AGSBTRY-LFP-2023-00742",
  serialNumber:       "TT-NX-LFP-40-23-004421",
  manufacturer:       "Tata AutoComp Energy Storage",
  manufacturingDate:  "2023-02-12",
  manufacturingPlant: "Pune, Maharashtra",
  chemistry:          "Lithium Iron Phosphate (LFP)",
  nominalCapacityKwh: 40.5,
  nominalVoltageV:    355,
  weightKg:           318,
  materialComposition: {
    lithium: 5.8, cobalt: 0, nickel: 0, manganese: 0,
    iron: 22.4, graphite: 15.6, other: 56.2,
    ethicalSourcingScore: 91,
  },
  productCarbonFootprint: {
    manufacturingCo2eKg:     8420,
    lifetimeSavingsKg:       32000,
    carbonPaybackYears:      1.8,
    currentTotalEmissionsKg: 1240,
  },
  circularity: {
    secondLifeSuitabilityScore: 88,
    recommendedSecondLifeUse:   "Grid-scale stationary energy storage",
    estimatedSecondLifeValueRs: 85000,
    recyclingPartner:           "Attero Recycling Pvt Ltd",
  },
  supplyChain: {
    cellSupplier:       "CATL (Contemporary Amperex Technology)",
    cellOriginCountry:  "China",
    packAssembler:      "Tata AutoComp, Pune",
    lithiumSource:      "Chile (SQM) — IRMA certified",
    supplyChainScore:   4,
  },
  qualityCertification: {
    qcPassDate:        "2023-02-28",
    certificationBody: "Bureau Veritas India",
    testReportNumber:  "BV-IND-2023-EV-004421",
    warrantyYears:     8,
    warrantyKm:        160000,
  },
};

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────
export const mockMaintenanceItems: MaintenanceItem[] = [
  {
    id: "m001",
    title: "Tyre Rotation",
    description: "Front and rear tyres should be rotated to ensure even wear pattern",
    urgency: "high",
    dueKm: 20000,
    currentKm: 18420,
    estimatedCostMin: 400,
    estimatedCostMax: 800,
    triggerReason: "Due in 1,580 km — tyre wear sensor shows 22% higher wear on front left",
    isOverdue: false,
  },
  {
    id: "m002",
    title: "Brake Fluid Replacement",
    description: "Hydraulic brake fluid degrades and absorbs moisture over time",
    urgency: "medium",
    dueDate: "2025-09-01",
    estimatedCostMin: 800,
    estimatedCostMax: 1200,
    triggerReason: "Last replaced 18 months ago — manufacturer recommends every 2 years",
    isOverdue: false,
  },
  {
    id: "m003",
    title: "Cabin Air Filter Replacement",
    description: "Replace HEPA cabin filter for optimal air quality",
    urgency: "low",
    dueKm: 20000,
    currentKm: 18420,
    estimatedCostMin: 600,
    estimatedCostMax: 900,
    triggerReason: "Filter approaching 15,000 km service interval",
    isOverdue: false,
  },
  {
    id: "m004",
    title: "Coolant System Inspection",
    description: "Thermal management coolant level and quality check",
    urgency: "low",
    dueDate: "2025-12-01",
    estimatedCostMin: 300,
    estimatedCostMax: 600,
    triggerReason: "Annual inspection due",
    isOverdue: false,
  },
];

export const mockServiceHistory: ServiceRecord[] = [
  {
    id: "sr001",
    date: "2024-07-15",
    type: "routine",
    dealerName: "Tata Motors EV Hub — Erode",
    dealerCity: "Erode",
    description: "Annual Service — 15,000 km service with battery diagnostic",
    partsReplaced: ["Cabin air filter", "Wiper blades", "Tyre rotation"],
    totalCostRs: 4200,
    nextServiceKm: 20000,
    nextServiceDate: "2025-07-01",
  },
  {
    id: "sr002",
    date: "2023-10-20",
    type: "routine",
    dealerName: "Tata Motors EV Hub — Coimbatore",
    dealerCity: "Coimbatore",
    description: "7,500 km First Service",
    partsReplaced: ["Cabin air filter", "Software update v2.1"],
    totalCostRs: 1800,
    nextServiceKm: 15000,
  },
];

// ─── INSURANCE ───────────────────────────────────────────────────────────────
export const mockPolicy: InsurancePolicy = {
  id:              "pol001",
  policyNumber:    "BAJAJ/EV/2024/****7823",
  provider:        "Bajaj Allianz General Insurance",
  providerLogo:    "/logos/bajaj.png",
  type:            "comprehensive",
  startDate:       "2024-04-15",
  endDate:         "2025-04-14",
  sumInsuredRs:    1450000,
  idvRs:           1280000,
  premiumRs:       24800,
  networkGarages:  4200,
  hasBatteryProtect:    true,
  hasRoadsideAssist:    true,
  hasZeroDepreciation:  false,
  status:          "expiring_soon",
  daysToRenewal:   42,
};

export const mockClaims: Claim[] = [
  {
    id: "cl001",
    claimNumber: "BAJAJ-CLM-2024-****112",
    date: "2024-02-10",
    incidentType: "Own Damage (Accident)",
    description: "Minor dent on rear bumper in parking lot",
    claimedAmountRs: 18500,
    settledAmountRs: 16200,
    status: "settled",
    statusHistory: [
      { status: "submitted",          date: "2024-02-10", note: "Claim raised online" },
      { status: "surveyor_assigned",  date: "2024-02-11", note: "Surveyor Ramesh K. assigned" },
      { status: "inspection_done",    date: "2024-02-13", note: "Physical inspection completed" },
      { status: "approved",           date: "2024-02-16", note: "Claim approved for ₹16,200" },
      { status: "settled",            date: "2024-02-20", note: "Amount credited to workshop directly" },
    ],
  },
];

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const mockDues: DueItem[] = [
  {
    id: "d001", category: "road_tax", title: "Vehicle Road Tax — TN",
    amountRs: 0, dueDate: "2026-04-14", status: "upcoming", isAutoDebit: false,
  },
  {
    id: "d002", category: "insurance", title: "Insurance Premium Renewal — Bajaj Allianz",
    amountRs: 24800, dueDate: "2025-04-14", status: "due_soon", isAutoDebit: false,
  },
  {
    id: "d003", category: "emi", title: "Vehicle Loan EMI — SBI",
    amountRs: 18450, dueDate: "2025-06-05", status: "upcoming", isAutoDebit: true,
  },
  {
    id: "d004", category: "charging_sub", title: "Tata Power EZ Charge — Monthly",
    amountRs: 999, dueDate: "2025-06-01", status: "auto_debit", isAutoDebit: true,
  },
  {
    id: "d005", category: "service_invoice", title: "Service Invoice — EV Hub Erode",
    amountRs: 4200, dueDate: "2024-07-15", status: "paid", isAutoDebit: false,
  },
];

export const mockTransactions: Transaction[] = [
  { id: "t001", date: "2024-07-15", category: "Maintenance", description: "Annual Service — Tata EV Hub Erode", amountRs: 4200, type: "debit", status: "success" },
  { id: "t002", date: "2024-06-05", category: "Loan EMI",     description: "Vehicle Loan EMI — SBI May 2024", amountRs: 18450, type: "debit", status: "success" },
  { id: "t003", date: "2024-05-01", category: "Charging",     description: "Tata Power EZ Charge — May 2024", amountRs: 999,   type: "debit", status: "success" },
  { id: "t004", date: "2024-02-20", category: "Insurance",    description: "Claim Settlement Credit",          amountRs: 16200, type: "credit", status: "success" },
  { id: "t005", date: "2024-04-14", category: "Insurance",    description: "Comprehensive Policy Premium",     amountRs: 24800, type: "debit", status: "success" },
];

// ─── DEALERS ─────────────────────────────────────────────────────────────────
export const mockDealers: Dealer[] = [
  {
    id: "dl001", name: "Tata Motors EV Hub — Erode",
    type: "both", address: "No. 42, Perundurai Road", city: "Erode", state: "Tamil Nadu",
    phone: "0424-2225566", email: "erode.ev@tatamotors.com",
    latitude: 11.3410, longitude: 77.7172,
    distanceKm: 2.4, rating: 4.6, totalReviews: 184, openNow: true,
    openHours: "Mon–Sat: 9:00 AM – 7:00 PM",
    services: ["Routine Service", "Battery Diagnostic", "Software Update", "Accident Repair"],
    nextAvailableSlot: "Tomorrow 10:30 AM",
  },
  {
    id: "dl002", name: "Tata EV Service Centre — Coimbatore",
    type: "service", address: "18/2, Avinashi Road", city: "Coimbatore", state: "Tamil Nadu",
    phone: "0422-4455678", email: "cbe.ev@tatamotors.com",
    latitude: 11.0168, longitude: 76.9558,
    distanceKm: 78.2, rating: 4.4, totalReviews: 312, openNow: true,
    openHours: "Mon–Sat: 8:30 AM – 6:30 PM",
    services: ["Battery Pack Replacement", "Motor Service", "Warranty Claims", "Routine Service"],
    nextAvailableSlot: "15 Jun 9:00 AM",
  },
  {
    id: "dl003", name: "Tata Motors — Salem EV",
    type: "both", address: "87, Omalur Main Road", city: "Salem", state: "Tamil Nadu",
    phone: "0427-2244900", email: "salem.ev@tatamotors.com",
    latitude: 11.6643, longitude: 78.1460,
    distanceKm: 65.5, rating: 4.3, totalReviews: 97, openNow: false,
    openHours: "Mon–Sat: 9:00 AM – 6:00 PM",
    services: ["Routine Service", "Battery Diagnostic", "Charging Infra Installation"],
    nextAvailableSlot: "16 Jun 11:00 AM",
  },
];

// ─── CARBON ──────────────────────────────────────────────────────────────────
export const mockCarbon: CarbonData = {
  todayCo2Kg:    1.24,
  monthCo2Kg:   28.4,
  yearCo2Kg:   312.8,
  lifetimeSavedKg: 3840,
  currentGridFactor: 620, // gCO2/kWh — Tamil Nadu grid
  optimalChargingWindow: { start: "10:30 PM", end: "6:00 AM", factor: 480 },
  monthlyCarbonHistory: [
    { month: "Jun 2024", co2Kg: 29.1, savedKg: 198 },
    { month: "Jul 2024", co2Kg: 31.4, savedKg: 214 },
    { month: "Aug 2024", co2Kg: 28.8, savedKg: 196 },
    { month: "Sep 2024", co2Kg: 26.2, savedKg: 178 },
    { month: "Oct 2024", co2Kg: 24.9, savedKg: 169 },
    { month: "Nov 2024", co2Kg: 22.8, savedKg: 155 },
    { month: "Dec 2024", co2Kg: 20.1, savedKg: 137 },
    { month: "Jan 2025", co2Kg: 19.4, savedKg: 132 },
    { month: "Feb 2025", co2Kg: 21.2, savedKg: 144 },
    { month: "Mar 2025", co2Kg: 25.8, savedKg: 176 },
    { month: "Apr 2025", co2Kg: 27.4, savedKg: 187 },
    { month: "May 2025", co2Kg: 28.4, savedKg: 194 },
  ],
};

// ─── ALERTS ──────────────────────────────────────────────────────────────────
export const mockAlerts: Alert[] = [
  {
    id: "al001", type: "insurance", severity: "high",
    title: "Insurance Renewal Due in 42 Days",
    message: "Your Bajaj Allianz comprehensive policy expires on 14 Apr 2025. Renew early to avoid coverage gap.",
    timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false,
    actionLabel: "Renew Now", actionHref: "/insurance",
  },
  {
    id: "al002", type: "maintenance", severity: "medium",
    title: "Tyre Rotation Due Soon",
    message: "Front tyres showing 22% higher wear than rear. Rotation recommended within 1,580 km.",
    timestamp: new Date(Date.now() - 7200000).toISOString(), isRead: false,
    actionLabel: "Book Service", actionHref: "/dealers",
  },
  {
    id: "al003", type: "software", severity: "low",
    title: "BMS Software Update Available — v2.5.1",
    message: "New update improves cold-weather charging speed by 12% and optimises regen braking algorithm.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: true,
    actionLabel: "View Update", actionHref: "/dashboard",
  },
  {
    id: "al004", type: "battery", severity: "info",
    title: "Monthly Battery Health Report",
    message: "Your battery lost 0.6% SOH in May 2025 — better than 71% of Nexon EV owners. Keep it up!",
    timestamp: new Date(Date.now() - 172800000).toISOString(), isRead: true,
  },
];

// ─── TRIPS ───────────────────────────────────────────────────────────────────
export const mockTrips: Trip[] = [
  { id: "tr001", date: "2025-05-30", startLocation: "Erode", endLocation: "Coimbatore",
    distanceKm: 78, durationMinutes: 72, energyKwh: 14.2, efficiencyWhKm: 182,
    avgSpeedKmh: 65, co2Kg: 8.8, costRs: 89 },
  { id: "tr002", date: "2025-05-28", startLocation: "Home", endLocation: "Erode Market",
    distanceKm: 12, durationMinutes: 18, energyKwh: 2.4, efficiencyWhKm: 200,
    avgSpeedKmh: 40, co2Kg: 1.5, costRs: 15 },
  { id: "tr003", date: "2025-05-26", startLocation: "Erode", endLocation: "Salem",
    distanceKm: 65, durationMinutes: 68, energyKwh: 11.8, efficiencyWhKm: 181,
    avgSpeedKmh: 57, co2Kg: 7.3, costRs: 74 },
  { id: "tr004", date: "2025-05-24", startLocation: "Erode", endLocation: "Tirupur",
    distanceKm: 45, durationMinutes: 52, energyKwh: 8.6, efficiencyWhKm: 191,
    avgSpeedKmh: 52, co2Kg: 5.3, costRs: 54 },
  { id: "tr005", date: "2025-05-22", startLocation: "Home", endLocation: "Bhavani",
    distanceKm: 28, durationMinutes: 34, energyKwh: 5.2, efficiencyWhKm: 186,
    avgSpeedKmh: 49, co2Kg: 3.2, costRs: 33 },
];

// ─── HELPER TO SIMULATE LIVE SOC CHANGES ─────────────────────────────────────
let currentSoc = mockTelemetry.soc;
export function getLiveSoc(): number {
  // Simulates slow SOC drain over time (test mode only)
  currentSoc = Math.max(5, currentSoc - 0.05);
  return parseFloat(currentSoc.toFixed(1));
}
