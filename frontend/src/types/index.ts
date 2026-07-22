// ─── AUTH ────────────────────────────────────────────────────────────────────
export interface AuthSession {
  chassisNumber: string;
  vehicleId:     string;
  ownerName:     string;
  maskedMobile:  string;
  expiresAt:     number; // unix timestamp
}

export interface OTPResponse {
  success:      boolean;
  sessionId:    string;
  maskedMobile: string;
  testOtp?:     string; // only in TEST_MODE
  message:      string;
}

// ─── VEHICLE ─────────────────────────────────────────────────────────────────
export interface Vehicle {
  chassisNumber:    string;
  registrationNo:   string;
  make:             string;
  model:            string;
  variant:          string;
  year:             number;
  color:            string;
  purchaseDate:     string;
  ownerName:        string;
  ownerMobile:      string; // masked in API response
  registeredCity:   string;
  registeredState:  string;
  batteryCapacityKwh: number;
  batteryChemistry: "LFP" | "NMC" | "NCA" | "LTO";
  motorPowerKw:     number;
  ratedRangeKm:     number;
  status:           "online" | "offline" | "charging" | "parked";
  lastSeenAt:       string;
}

// ─── HEALTH & TELEMETRY ──────────────────────────────────────────────────────
export interface HealthScore {
  overall:          number; // 0-100
  batteryHealth:    number;
  mechanicalHealth: number;
  chargingSystem:   number;
  softwareStatus:   number;
  tyresBrakes:      number;
  grade:            "excellent" | "good" | "attention" | "critical";
  gradeLabel:       string;
}

export interface LiveTelemetry {
  soc:              number; // State of Charge 0-100 %
  soh:              number; // State of Health 0-100 %
  estimatedRangeKm: number;
  isCharging:       boolean;
  chargingRateKw:   number;
  timeToFullCharge: string; // "2h 15m"
  recommendedChargeTarget: number; // typically 80%
  currentSpeedKmh:  number;
  odometreKm:       number;
  cabinTempC:       number;
  ambientTempC:     number;
  lastUpdatedAt:    string;
}

export interface SOHTrend {
  date:    string; // "YYYY-MM-DD"
  soh:     number;
  cycleCount: number;
  event?:  "stress" | "service" | "update";
  eventLabel?: string;
}

export interface StressEvent {
  id:         string;
  type:       "deep_discharge" | "high_temp_park" | "dc_fast_charge" | "complete_discharge" | "cold_charge";
  date:       string;
  severity:   "low" | "medium" | "high" | "critical";
  sohImpact:  number; // negative number, e.g. -0.08
  description: string;
  recommendation: string;
}

export interface RULEstimate {
  estimatedYears70Soh:  number; // years until 70% SOH
  estimatedYears50Soh:  number; // years until 50% SOH
  confidenceLow:        number;
  confidenceHigh:       number;
  primaryDegradationFactor: string;
  projectedSoh1Year:   number;
  projectedSoh3Year:   number;
  projectedSoh5Year:   number;
}

// ─── BATTERY PASSPORT ───────────────────────────────────────────────────────
export interface BatteryPassport {
  batteryId:           string;
  serialNumber:        string;
  manufacturer:        string;
  manufacturingDate:   string;
  manufacturingPlant:  string;
  chemistry:           string;
  nominalCapacityKwh:  number;
  nominalVoltageV:     number;
  weightKg:            number;
  // Submodels
  materialComposition: MaterialComposition;
  productCarbonFootprint: CarbonFootprint;
  circularity:         Circularity;
  supplyChain:         SupplyChainInfo;
  qualityCertification: QualityCert;
}

export interface MaterialComposition {
  lithium:   number; // percentage
  cobalt:    number;
  nickel:    number;
  manganese: number;
  iron:      number;
  graphite:  number;
  other:     number;
  ethicalSourcingScore: number; // 1-100
}

export interface CarbonFootprint {
  manufacturingCo2eKg:  number;
  lifetimeSavingsKg:    number; // vs ICE equivalent
  carbonPaybackYears:   number;
  currentTotalEmissionsKg: number; // accumulated since ownership
}

export interface Circularity {
  secondLifeSuitabilityScore: number; // 0-100
  recommendedSecondLifeUse:   string;
  estimatedSecondLifeValueRs: number;
  recyclingPartner:           string;
}

export interface SupplyChainInfo {
  cellSupplier:       string;
  cellOriginCountry:  string;
  packAssembler:      string;
  lithiumSource:      string;
  supplyChainScore:   number; // 1-5 stars
}

export interface QualityCert {
  qcPassDate:         string;
  certificationBody:  string;
  testReportNumber:   string;
  warrantyYears:      number;
  warrantyKm:         number;
}

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────
export interface MaintenanceItem {
  id:           string;
  title:        string;
  description:  string;
  urgency:      "critical" | "high" | "medium" | "low";
  dueDate?:     string;
  dueKm?:       number;
  currentKm?:   number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  triggerReason: string;
  isOverdue:    boolean;
}

export interface ServiceRecord {
  id:           string;
  date:         string;
  type:         "routine" | "condition_based" | "emergency" | "warranty";
  dealerName:   string;
  dealerCity:   string;
  description:  string;
  partsReplaced: string[];
  totalCostRs:  number;
  nextServiceKm?: number;
  nextServiceDate?: string;
}

// ─── INSURANCE ────────────────────────────────────────────────────────────────
export interface InsurancePolicy {
  id:              string;
  policyNumber:    string;
  provider:        string;
  providerLogo:    string;
  type:            "comprehensive" | "third_party" | "zero_dep";
  startDate:       string;
  endDate:         string;
  sumInsuredRs:    number;
  idvRs:           number;
  premiumRs:       number;
  networkGarages:  number;
  hasBatteryProtect: boolean;
  hasRoadsideAssist: boolean;
  hasZeroDepreciation: boolean;
  status:          "active" | "expired" | "expiring_soon";
  daysToRenewal:   number;
}

export interface Claim {
  id:             string;
  claimNumber:    string;
  date:           string;
  incidentType:   string;
  description:    string;
  claimedAmountRs: number;
  settledAmountRs?: number;
  status:         "submitted" | "surveyor_assigned" | "inspection_done" | "approved" | "settled" | "rejected";
  surveyorName?:  string;
  surveyorPhone?: string;
  statusHistory:  { status: string; date: string; note: string }[];
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export interface DueItem {
  id:           string;
  category:     "road_tax" | "insurance" | "emi" | "charging_sub" | "service_invoice" | "permit";
  title:        string;
  amountRs:     number;
  dueDate:      string;
  status:       "overdue" | "due_soon" | "upcoming" | "auto_debit" | "paid";
  isAutoDebit:  boolean;
  paymentLink?: string;
}

export interface Transaction {
  id:           string;
  date:         string;
  category:     string;
  description:  string;
  amountRs:     number;
  type:         "debit" | "credit";
  status:       "success" | "pending" | "failed";
  receiptUrl?:  string;
}

// ─── DEALERS ─────────────────────────────────────────────────────────────────
export interface Dealer {
  id:           string;
  name:         string;
  type:         "sales" | "service" | "both";
  address:      string;
  city:         string;
  state:        string;
  phone:        string;
  email:        string;
  latitude:     number;
  longitude:    number;
  distanceKm:   number;
  rating:       number; // 1-5
  totalReviews: number;
  openNow:      boolean;
  openHours:    string;
  services:     string[];
  nextAvailableSlot?: string;
}

// ─── CARBON ──────────────────────────────────────────────────────────────────
export interface CarbonData {
  todayCo2Kg:        number;
  monthCo2Kg:        number;
  yearCo2Kg:         number;
  lifetimeSavedKg:   number;
  currentGridFactor: number; // gCO2/kWh
  optimalChargingWindow: { start: string; end: string; factor: number };
  monthlyCarbonHistory: { month: string; co2Kg: number; savedKg: number }[];
}

// ─── ALERTS ──────────────────────────────────────────────────────────────────
export interface Alert {
  id:       string;
  type:     "battery" | "maintenance" | "insurance" | "security" | "charging" | "software";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title:    string;
  message:  string;
  timestamp: string;
  isRead:   boolean;
  actionLabel?: string;
  actionHref?:  string;
}

// ─── TRIPS ───────────────────────────────────────────────────────────────────
export interface Trip {
  id:              string;
  date:            string;
  startLocation:   string;
  endLocation:     string;
  distanceKm:      number;
  durationMinutes: number;
  energyKwh:       number;
  efficiencyWhKm:  number;
  avgSpeedKmh:     number;
  co2Kg:           number;
  costRs:          number;
}
