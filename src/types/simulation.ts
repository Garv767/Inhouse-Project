export type CompartmentId = 'A1' | 'A2' | 'A3' | 'A4';

export type DoseStatus = 'SCHEDULED' | 'DUE' | 'REMINDER' | 'PENDING' | 'TAKEN' | 'MISSED';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type AlertCategory = 'MEDICATION' | 'ENVIRONMENT' | 'HARDWARE';

export type HardwareLedState = 'OFF' | 'NORMAL' | 'WARNING';
export type HardwareBuzzerState = 'OFF' | 'REMINDER' | 'WARNING';

export interface MedicationItem {
  id: string;
  name: string;
  compartmentId: CompartmentId;
  dosage: string;
  scheduledTime: string; // "08:00 AM", "02:00 PM", "08:00 PM"
  gracePeriodMinutes: number;
  expectedWeight: number; // in grams e.g. 52.4
  instructions: string;
}

export interface DoseRecord {
  id: string;
  medicationId: string;
  medicationName: string;
  compartmentId: CompartmentId;
  scheduledTime: string;
  actualTime?: string;
  status: DoseStatus;
  delayMinutes: number;
  date: string; // YYYY-MM-DD
  weightBefore: number;
  weightAfter: number;
  doorOpenedAt?: string;
}

export interface SensorReading {
  timestamp: string; // ISO or HH:mm:ss
  temperature: number;
  humidity: number;
  weight: number;
  doorOpen: boolean;
  medicinePresent: boolean;
  battery: number;
  wifiConnected: boolean;
}

export interface SignalEvent {
  id: string;
  source: string; // e.g. "REED_SWITCH", "LOAD_CELL", "DHT22", "RTC"
  destination: string; // e.g. "ESP32", "BUZZER", "LED"
  signalType: 'GPIO' | 'I2C' | 'ADC' | 'Wi-Fi';
  pin?: string; // e.g. "GPIO 18"
  timestamp: number; // Date.now()
  formattedTime: string;
  payload: string;
  status: 'TRAVELLING' | 'RECEIVED' | 'PROCESSED';
  progress: number; // 0 to 100 for animation
}

export interface AlertRecord {
  id: string;
  timestamp: string;
  category: AlertCategory;
  type: string; // e.g. "MISSED_DOSE", "TEMPERATURE_HIGH", "DOOR_LEFT_OPEN"
  severity: AlertSeverity;
  title: string;
  description: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  source: string;
  relatedComponent: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  eventType: string; // e.g. "DOOR_OPENED", "MEDICINE_REMOVED", "DOSE_TAKEN", "TEMP_VIOLATION"
  source: string;
  description: string;
  severity: AlertSeverity;
  relatedComponent: string;
  gpioOrProtocol?: string;
  firmwareFunction?: string;
}

export interface FailureState {
  tempSensorFailed: boolean;
  humiditySensorFailed: boolean;
  doorSensorFailed: boolean;
  medicineSensorFailed: boolean;
  lowBattery: boolean;
  wifiDisconnected: boolean;
  powerFailed: boolean;
  doorLeftOpenTimer: number; // seconds door has been left open
}

export interface DemoStep {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  highlightedComponent: string;
  firmwareFunction: string;
  actionSummary: string;
  expectedState: string;
}

export interface SimulationState {
  deviceId: string;
  temperature: number;
  humidity: number;
  doorOpen: boolean;
  medicinePresent: boolean;
  weight: number;
  battery: number;
  wifiConnected: boolean;
  rtcSynchronized: boolean;
  
  currentSimulationTime: Date;
  simulationRunning: boolean;
  simulationSpeed: number; // 1, 5, 10, 50
  
  sensorsOnline: boolean;
  
  compartments: Record<CompartmentId, {
    medicineName: string;
    present: boolean;
    weight: number;
  }>;
  
  medicationSchedule: MedicationItem[];
  doseHistory: DoseRecord[];
  alerts: AlertRecord[];
  events: SystemEvent[];
  sensorHistory: SensorReading[];
  
  compliance: number; // 0 - 100
  storageHealth: number; // 0 - 100
  
  hardwareOutputs: {
    led: HardwareLedState;
    buzzer: HardwareBuzzerState;
  };
  
  activeSignals: SignalEvent[];
  
  currentDataPacket: SensorReading | null;
  currentFirmwareFunction: string | null;
  highlightedHardwareComponent: string | null;
  
  failures: FailureState;
  
  // Settings & Limits
  settings: {
    tempMin: number;
    tempMax: number;
    humidityMin: number;
    humidityMax: number;
    gracePeriodMinutes: number;
    doorOpenWarningSeconds: number;
    samplingIntervalMs: number;
    deviceName: string;
  };
  
  // Demo Runner State
  isDemoRunning: boolean;
  currentDemoStep: number;
  
  // View options
  isVivaMode: boolean;
  isPresentationMode: boolean;
}
