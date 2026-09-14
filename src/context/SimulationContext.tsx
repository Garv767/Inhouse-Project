import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  SimulationState,
  CompartmentId,
  MedicationItem,
  DoseRecord,
  AlertRecord,
  SystemEvent,
  SignalEvent,
  SensorReading,
  FailureState,
  HardwareLedState,
  HardwareBuzzerState
} from '../types/simulation';
import {
  calculateCompliance,
  calculateStorageHealth,
  DEMO_STEPS
} from './simulationLogic';

const INITIAL_SCHEDULE: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Medicine A (Blood Pressure)',
    compartmentId: 'A1',
    dosage: '10mg Tablet',
    scheduledTime: '08:00 AM',
    gracePeriodMinutes: 15,
    expectedWeight: 52.4,
    instructions: 'Take 1 tablet daily with water.'
  },
  {
    id: 'med-2',
    name: 'Medicine B (Cholesterol)',
    compartmentId: 'A2',
    dosage: '20mg Capsule',
    scheduledTime: '02:00 PM',
    gracePeriodMinutes: 15,
    expectedWeight: 44.1,
    instructions: 'Take after meals.'
  },
  {
    id: 'med-3',
    name: 'Medicine C (Diabetes)',
    compartmentId: 'A3',
    dosage: '500mg Tablet',
    scheduledTime: '08:00 PM',
    gracePeriodMinutes: 15,
    expectedWeight: 61.8,
    instructions: 'Take 1 tablet before bedtime.'
  },
  {
    id: 'med-4',
    name: 'Medicine D (Vitamin D3)',
    compartmentId: 'A4',
    dosage: '1000 IU',
    scheduledTime: '08:00 AM',
    gracePeriodMinutes: 30,
    expectedWeight: 38.0,
    instructions: 'Daily supplement.'
  }
];

const INITIAL_DOSE_HISTORY: DoseRecord[] = [
  {
    id: 'dose-hist-1',
    medicationId: 'med-1',
    medicationName: 'Medicine A (Blood Pressure)',
    compartmentId: 'A1',
    scheduledTime: '08:00 AM',
    actualTime: '08:04 AM',
    status: 'TAKEN',
    delayMinutes: 4,
    date: new Date().toISOString().split('T')[0],
    weightBefore: 52.4,
    weightAfter: 0.0,
    doorOpenedAt: '08:03:52 AM'
  },
  {
    id: 'dose-hist-2',
    medicationId: 'med-2',
    medicationName: 'Medicine B (Cholesterol)',
    compartmentId: 'A2',
    scheduledTime: '02:00 PM',
    actualTime: '02:02 PM',
    status: 'TAKEN',
    delayMinutes: 2,
    date: new Date().toISOString().split('T')[0],
    weightBefore: 44.1,
    weightAfter: 0.0,
    doorOpenedAt: '02:01:40 PM'
  },
  {
    id: 'dose-hist-3',
    medicationId: 'med-3',
    medicationName: 'Medicine C (Diabetes)',
    compartmentId: 'A3',
    scheduledTime: '08:00 PM',
    status: 'PENDING',
    delayMinutes: 0,
    date: new Date().toISOString().split('T')[0],
    weightBefore: 61.8,
    weightAfter: 61.8
  }
];

const INITIAL_SETTINGS = {
  tempMin: 15,
  tempMax: 25,
  humidityMin: 30,
  humidityMax: 60,
  gracePeriodMinutes: 15,
  doorOpenWarningSeconds: 30,
  samplingIntervalMs: 1000,
  deviceName: 'MED-ESP32-001'
};

const INITIAL_FAILURES: FailureState = {
  tempSensorFailed: false,
  humiditySensorFailed: false,
  doorSensorFailed: false,
  medicineSensorFailed: false,
  lowBattery: false,
  wifiDisconnected: false,
  powerFailed: false,
  doorLeftOpenTimer: 0
};

interface SimulationContextType {
  state: SimulationState;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
  
  // Physical Actions
  openDoor: () => void;
  closeDoor: () => void;
  removeMedicine: (compartmentId?: CompartmentId) => void;
  restoreMedicine: (compartmentId?: CompartmentId) => void;
  
  // Environmental Adjustments
  raiseTemperature: (val?: number) => void;
  lowerTemperature: (val?: number) => void;
  raiseHumidity: (val?: number) => void;
  lowerHumidity: (val?: number) => void;
  
  // Failure Controls
  toggleSensorFailure: (type: 'temp' | 'humidity' | 'door' | 'medicine') => void;
  toggleWifi: () => void;
  togglePower: () => void;
  toggleLowBattery: () => void;
  
  // Scenario Triggers
  simulateMissedDose: () => void;
  runCompleteDemo: () => void;
  stopDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  setDemoStep: (stepIndex: number) => void;
  
  // Selection & Mode
  selectHardwareComponent: (compName: string | null) => void;
  selectFirmwareFunction: (fnName: string | null) => void;
  toggleVivaMode: () => void;
  togglePresentationMode: () => void;
  
  // Settings & Storage
  updateSettings: (newSettings: Partial<typeof INITIAL_SETTINGS>) => void;
  saveLocalState: () => void;
  clearSavedState: () => void;
  acknowledgeAlert: (alertId: string) => void;
  
  // Signal Dispatcher
  triggerSignal: (
    source: string,
    destination: string,
    signalType: 'GPIO' | 'I2C' | 'ADC' | 'Wi-Fi',
    pin?: string,
    payload?: string
  ) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(() => {
    const saved = localStorage.getItem('ESP32_MED_DIGITAL_TWIN_STATE');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.currentSimulationTime = new Date(parsed.currentSimulationTime);
        return parsed;
      } catch (e) {
        console.error('Failed to load saved state, using default', e);
      }
    }
    return {
      deviceId: 'MED-ESP32-001',
      temperature: 24.0,
      humidity: 48,
      doorOpen: false,
      medicinePresent: true,
      weight: 52.4,
      battery: 87,
      wifiConnected: true,
      rtcSynchronized: true,
      
      currentSimulationTime: new Date(),
      simulationRunning: true,
      simulationSpeed: 1,
      
      sensorsOnline: true,
      
      compartments: {
        A1: { medicineName: 'Medicine A (BP)', present: true, weight: 52.4 },
        A2: { medicineName: 'Medicine B (Cholesterol)', present: true, weight: 44.1 },
        A3: { medicineName: 'Medicine C (Diabetes)', present: true, weight: 61.8 },
        A4: { medicineName: 'Medicine D (Vitamin D3)', present: true, weight: 38.0 }
      },
      
      medicationSchedule: INITIAL_SCHEDULE,
      doseHistory: INITIAL_DOSE_HISTORY,
      alerts: [
        {
          id: 'alert-init-1',
          timestamp: new Date().toLocaleTimeString(),
          category: 'HARDWARE',
          type: 'SYSTEM_STARTUP',
          severity: 'INFO',
          title: 'ESP32 Digital Twin Online',
          description: 'System powered on. Sensors and Web Server initialized.',
          status: 'ACTIVE',
          source: 'ESP32',
          relatedComponent: 'ESP32'
        }
      ],
      events: [
        {
          id: 'evt-init-1',
          timestamp: new Date().toLocaleTimeString(),
          eventType: 'SYSTEM_STARTUP',
          source: 'ESP32',
          description: 'ESP32 RTOS core initialized at 115200 baud.',
          severity: 'INFO',
          relatedComponent: 'ESP32',
          gpioOrProtocol: 'UART 115200',
          firmwareFunction: 'setup()'
        }
      ],
      sensorHistory: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString(),
        temperature: 24.0 + (Math.random() * 0.4 - 0.2),
        humidity: 48 + Math.round(Math.random() * 2 - 1),
        weight: 52.4,
        doorOpen: false,
        medicinePresent: true,
        battery: 87,
        wifiConnected: true
      })),
      
      compliance: 91,
      storageHealth: 94,
      
      hardwareOutputs: {
        led: 'NORMAL',
        buzzer: 'OFF'
      },
      
      activeSignals: [],
      currentDataPacket: null,
      currentFirmwareFunction: 'loop()',
      highlightedHardwareComponent: null,
      
      failures: INITIAL_FAILURES,
      settings: INITIAL_SETTINGS,
      
      isDemoRunning: false,
      currentDemoStep: 0,
      
      isVivaMode: false,
      isPresentationMode: false
    };
  });

  // Signal Trigger Helper
  const triggerSignal = useCallback((
    source: string,
    destination: string,
    signalType: 'GPIO' | 'I2C' | 'ADC' | 'Wi-Fi',
    pin?: string,
    payload?: string
  ) => {
    const newSignal: SignalEvent = {
      id: 'sig-' + Math.random().toString(36).substring(2, 9),
      source,
      destination,
      signalType,
      pin,
      timestamp: Date.now(),
      formattedTime: new Date().toLocaleTimeString(),
      payload: payload || `${signalType} pulse (${source} -> ${destination})`,
      status: 'TRAVELLING',
      progress: 0
    };

    setState((prev) => ({
      ...prev,
      activeSignals: [...prev.activeSignals.slice(-5), newSignal]
    }));
  }, []);

  // Event Log Helper
  const logEvent = useCallback((
    eventType: string,
    source: string,
    description: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    relatedComponent: string,
    gpioOrProtocol?: string,
    firmwareFunction?: string
  ) => {
    const newEvt: SystemEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      eventType,
      source,
      description,
      severity,
      relatedComponent,
      gpioOrProtocol,
      firmwareFunction
    };

    setState((prev) => ({
      ...prev,
      events: [newEvt, ...prev.events].slice(0, 100)
    }));
  }, []);

  // Alert Engine Helper (With Deduplication)
  const addAlert = useCallback((
    category: 'MEDICATION' | 'ENVIRONMENT' | 'HARDWARE',
    type: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    title: string,
    description: string,
    source: string,
    relatedComponent: string
  ) => {
    setState((prev) => {
      const existing = prev.alerts.find(
        (a) => a.type === type && a.status === 'ACTIVE'
      );
      if (existing) return prev;

      const newAlert: AlertRecord = {
        id: 'alert-' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        category,
        type,
        severity,
        title,
        description,
        status: 'ACTIVE',
        source,
        relatedComponent
      };

      return {
        ...prev,
        alerts: [newAlert, ...prev.alerts].slice(0, 50)
      };
    });
  }, []);

  // Main Simulation Tick Loop
  useEffect(() => {
    if (!state.simulationRunning) return;

    const intervalTime = 1000 / state.simulationSpeed;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.failures.powerFailed) {
          return {
            ...prev,
            temperature: 0,
            humidity: 0,
            sensorsOnline: false,
            wifiConnected: false,
            hardwareOutputs: { led: 'OFF', buzzer: 'OFF' }
          };
        }

        const nextTime = new Date(prev.currentSimulationTime.getTime() + 1000 * prev.simulationSpeed);

        let nextTemp = prev.temperature;
        if (!prev.failures.tempSensorFailed && prev.temperature > 0) {
          const delta = (Math.random() - 0.5) * 0.1;
          nextTemp = Number((prev.temperature + delta).toFixed(1));
        }

        let nextHum = prev.humidity;
        if (!prev.failures.humiditySensorFailed && prev.humidity > 0) {
          const delta = Math.round((Math.random() - 0.5) * 0.4);
          nextHum = Math.max(20, Math.min(90, prev.humidity + delta));
        }

        const updatedSignals = prev.activeSignals
          .map((sig) => ({
            ...sig,
            progress: Math.min(100, sig.progress + 25)
          }))
          .filter((sig) => sig.progress < 100);

        const newReading: SensorReading = {
          timestamp: nextTime.toLocaleTimeString(),
          temperature: nextTemp,
          humidity: nextHum,
          weight: prev.weight,
          doorOpen: prev.doorOpen,
          medicinePresent: prev.medicinePresent,
          battery: prev.battery,
          wifiConnected: prev.wifiConnected
        };

        const updatedHistory = [...prev.sensorHistory.slice(-49), newReading];

        const health = calculateStorageHealth(
          nextTemp,
          nextHum,
          prev.settings,
          prev.failures
        );

        let updatedLed: HardwareLedState = prev.hardwareOutputs.led;
        let updatedBuzzer: HardwareBuzzerState = prev.hardwareOutputs.buzzer;

        if (nextTemp > prev.settings.tempMax || nextTemp < prev.settings.tempMin) {
          updatedLed = 'WARNING';
        } else if (prev.hardwareOutputs.led !== 'WARNING') {
          updatedLed = 'NORMAL';
        }

        let doorTimer = prev.failures.doorLeftOpenTimer;
        if (prev.doorOpen) {
          doorTimer += 1;
        } else {
          doorTimer = 0;
        }

        return {
          ...prev,
          currentSimulationTime: nextTime,
          temperature: nextTemp,
          humidity: nextHum,
          activeSignals: updatedSignals,
          sensorHistory: updatedHistory,
          currentDataPacket: newReading,
          storageHealth: health,
          hardwareOutputs: {
            led: updatedLed,
            buzzer: updatedBuzzer
          },
          failures: {
            ...prev.failures,
            doorLeftOpenTimer: doorTimer
          }
        };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [state.simulationRunning, state.simulationSpeed]);

  // Handle Environmental Threshold Alerts
  useEffect(() => {
    if (state.temperature > state.settings.tempMax && !state.failures.tempSensorFailed) {
      addAlert(
        'ENVIRONMENT',
        'TEMPERATURE_HIGH',
        'WARNING',
        'Storage Temperature High Warning',
        `Chamber temperature reached ${state.temperature}°C (Limit: ${state.settings.tempMax}°C). Risk of medication degradation.`,
        'DHT22 Sensor',
        'TEMPERATURE SENSOR'
      );
      logEvent(
        'TEMPERATURE_VIOLATION',
        'DHT22 Sensor',
        `Temperature exceeded upper limit: ${state.temperature}°C`,
        'WARNING',
        'TEMPERATURE SENSOR',
        'GPIO 4 / DHT22',
        'checkEnvironmentalLimits()'
      );
    }
  }, [state.temperature, state.settings.tempMax, state.failures.tempSensorFailed, addAlert, logEvent]);

  // Door Left Open Warning Alert
  useEffect(() => {
    if (state.failures.doorLeftOpenTimer >= state.settings.doorOpenWarningSeconds) {
      addAlert(
        'HARDWARE',
        'DOOR_LEFT_OPEN',
        'WARNING',
        'Medicine Box Door Left Open',
        `Storage door has remained open for over ${state.settings.doorOpenWarningSeconds} seconds.`,
        'Reed Switch',
        'DOOR / REED SWITCH'
      );
    }
  }, [state.failures.doorLeftOpenTimer, state.settings.doorOpenWarningSeconds, addAlert]);

  // PHYSICAL ACTIONS
  const openDoor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      doorOpen: true,
      highlightedHardwareComponent: 'DOOR / REED SWITCH',
      currentFirmwareFunction: 'digitalRead(DOOR_PIN)'
    }));

    triggerSignal('DOOR / REED SWITCH', 'ESP32', 'GPIO', 'GPIO 18', 'Door state: OPEN (LOW)');
    logEvent(
      'DOOR_OPENED',
      'Reed Switch',
      'Medicine box compartment door opened.',
      'INFO',
      'DOOR / REED SWITCH',
      'GPIO 18',
      'handleDoorOpenEvent()'
    );
  }, [triggerSignal, logEvent]);

  const closeDoor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      doorOpen: false,
      hardwareOutputs: {
        ...prev.hardwareOutputs,
        buzzer: 'OFF'
      },
      highlightedHardwareComponent: 'DOOR / REED SWITCH',
      currentFirmwareFunction: 'digitalRead(DOOR_PIN)'
    }));

    triggerSignal('DOOR / REED SWITCH', 'ESP32', 'GPIO', 'GPIO 18', 'Door state: CLOSED (HIGH)');
    logEvent(
      'DOOR_CLOSED',
      'Reed Switch',
      'Medicine box door closed and secured.',
      'INFO',
      'DOOR / REED SWITCH',
      'GPIO 18',
      'handleDoorCloseEvent()'
    );
  }, [triggerSignal, logEvent]);

  const removeMedicine = useCallback((compartmentId: CompartmentId = 'A1') => {
    setState((prev) => {
      const targetComp = prev.compartments[compartmentId];
      if (!targetComp) return prev;

      const updatedCompartments = {
        ...prev.compartments,
        [compartmentId]: { ...targetComp, present: false, weight: 0.0 }
      };

      const totalWeight = Object.values(updatedCompartments).reduce(
        (acc, c) => acc + c.weight,
        0
      );

      const activeSchedule = prev.medicationSchedule.find(
        (s) => s.compartmentId === compartmentId
      );

      let updatedDoses = [...prev.doseHistory];

      if (activeSchedule) {
        const existingIdx = updatedDoses.findIndex(
          (d) => d.medicationId === activeSchedule.id && d.status !== 'TAKEN'
        );

        if (existingIdx !== -1) {
          updatedDoses[existingIdx] = {
            ...updatedDoses[existingIdx],
            status: 'TAKEN',
            actualTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            weightAfter: 0.0,
            doorOpenedAt: new Date().toLocaleTimeString()
          };
        } else {
          updatedDoses.unshift({
            id: 'dose-' + Math.random().toString(36).substring(2, 9),
            medicationId: activeSchedule.id,
            medicationName: activeSchedule.name,
            compartmentId,
            scheduledTime: activeSchedule.scheduledTime,
            actualTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'TAKEN',
            delayMinutes: 3,
            date: new Date().toISOString().split('T')[0],
            weightBefore: targetComp.weight,
            weightAfter: 0.0,
            doorOpenedAt: new Date().toLocaleTimeString()
          });
        }
      }

      const newCompliance = calculateCompliance(updatedDoses);

      return {
        ...prev,
        medicinePresent: false,
        weight: totalWeight,
        compartments: updatedCompartments,
        doseHistory: updatedDoses,
        compliance: newCompliance,
        hardwareOutputs: {
          led: 'NORMAL',
          buzzer: 'OFF'
        },
        highlightedHardwareComponent: 'LOAD CELL',
        currentFirmwareFunction: 'detectDoseEvent()'
      };
    });

    triggerSignal('LOAD CELL', 'ESP32', 'ADC', 'GPIO 34', `Weight drop -> 0.0g (${compartmentId})`);
    logEvent(
      'MEDICINE_REMOVED',
      'Load Cell / Proximity',
      `Medicine container removed from Compartment ${compartmentId}. Valid dose detected.`,
      'INFO',
      'Compartment ' + compartmentId,
      'GPIO 34 / ADC',
      'detectDoseEvent()'
    );

    logEvent(
      'DOSE_TAKEN',
      'Medication Engine',
      `Dose marked TAKEN for Compartment ${compartmentId}. Compliance updated.`,
      'INFO',
      'Medication Engine',
      'RTOS Task',
      'updateDoseStatus()'
    );
  }, [triggerSignal, logEvent]);

  const restoreMedicine = useCallback((compartmentId: CompartmentId = 'A1') => {
    setState((prev) => {
      const defaultWeight = INITIAL_SCHEDULE.find((s) => s.compartmentId === compartmentId)?.expectedWeight || 50;

      const updatedCompartments = {
        ...prev.compartments,
        [compartmentId]: {
          ...prev.compartments[compartmentId],
          present: true,
          weight: defaultWeight
        }
      };

      const totalWeight = Object.values(updatedCompartments).reduce(
        (acc, c) => acc + c.weight,
        0
      );

      return {
        ...prev,
        medicinePresent: true,
        weight: totalWeight,
        compartments: updatedCompartments,
        highlightedHardwareComponent: 'Compartment ' + compartmentId,
        currentFirmwareFunction: 'checkMedicinePresence()'
      };
    });

    triggerSignal('LOAD CELL', 'ESP32', 'ADC', 'GPIO 34', `Weight restored -> Compartment ${compartmentId}`);
    logEvent(
      'MEDICINE_RESTORED',
      'Load Cell',
      `Medicine container restored to Compartment ${compartmentId}.`,
      'INFO',
      'Compartment ' + compartmentId,
      'GPIO 34',
      'readLoadCell()'
    );
  }, [triggerSignal, logEvent]);

  // ENVIRONMENTAL ADJUSTMENTS
  const raiseTemperature = useCallback((val: number = 3.0) => {
    setState((prev) => {
      const nextTemp = Number((prev.temperature + val).toFixed(1));
      return {
        ...prev,
        temperature: nextTemp,
        highlightedHardwareComponent: 'TEMPERATURE SENSOR',
        currentFirmwareFunction: 'readSensors()'
      };
    });
    triggerSignal('TEMPERATURE SENSOR', 'ESP32', 'I2C', 'GPIO 4', `Temp rise -> ${state.temperature + val}°C`);
  }, [state.temperature, triggerSignal]);

  const lowerTemperature = useCallback((val: number = 3.0) => {
    setState((prev) => ({
      ...prev,
      temperature: Math.max(10, Number((prev.temperature - val).toFixed(1))),
      highlightedHardwareComponent: 'TEMPERATURE SENSOR',
      currentFirmwareFunction: 'readSensors()'
    }));
  }, []);

  const raiseHumidity = useCallback((val: number = 10) => {
    setState((prev) => ({
      ...prev,
      humidity: Math.min(95, prev.humidity + val),
      highlightedHardwareComponent: 'HUMIDITY SENSOR',
      currentFirmwareFunction: 'readSensors()'
    }));
  }, []);

  const lowerHumidity = useCallback((val: number = 10) => {
    setState((prev) => ({
      ...prev,
      humidity: Math.max(20, prev.humidity - val),
      highlightedHardwareComponent: 'HUMIDITY SENSOR',
      currentFirmwareFunction: 'readSensors()'
    }));
  }, []);

  // FAILURE CONTROLS
  const toggleSensorFailure = useCallback((type: 'temp' | 'humidity' | 'door' | 'medicine') => {
    setState((prev) => {
      const key = type === 'temp' ? 'tempSensorFailed'
        : type === 'humidity' ? 'humiditySensorFailed'
        : type === 'door' ? 'doorSensorFailed'
        : 'medicineSensorFailed';

      const newVal = !prev.failures[key];
      const updatedFailures = { ...prev.failures, [key]: newVal };

      return {
        ...prev,
        failures: updatedFailures,
        sensorsOnline: !updatedFailures.tempSensorFailed && !updatedFailures.humiditySensorFailed
      };
    });

    logEvent(
      'SENSOR_FAILURE',
      'Hardware Fault Injection',
      `Sensor fault toggled for ${type.toUpperCase()}`,
      'WARNING',
      `${type.toUpperCase()} SENSOR`,
      'GPIO',
      'checkSensorHealth()'
    );
  }, [logEvent]);

  const toggleWifi = useCallback(() => {
    setState((prev) => {
      const nextWifi = !prev.wifiConnected;
      return {
        ...prev,
        wifiConnected: nextWifi,
        failures: { ...prev.failures, wifiDisconnected: !nextWifi }
      };
    });

    logEvent(
      state.wifiConnected ? 'WIFI_DISCONNECTED' : 'WIFI_CONNECTED',
      'Wi-Fi Stack',
      state.wifiConnected ? 'Wi-Fi interface disconnected. Local edge buffering active.' : 'Wi-Fi reconnected to local network.',
      state.wifiConnected ? 'WARNING' : 'INFO',
      'WIFI',
      'Wi-Fi',
      'checkWiFiConnection()'
    );
  }, [state.wifiConnected, logEvent]);

  const togglePower = useCallback(() => {
    setState((prev) => {
      const nextPower = !prev.failures.powerFailed;
      return {
        ...prev,
        failures: { ...prev.failures, powerFailed: nextPower },
        hardwareOutputs: { led: nextPower ? 'OFF' : 'NORMAL', buzzer: 'OFF' }
      };
    });

    logEvent(
      'POWER_FAILURE',
      'Power Supply',
      'Main power supply interrupted. Local system offline.',
      'CRITICAL',
      'POWER SUPPLY',
      'VCC 5V',
      'powerFailureISR()'
    );
  }, [logEvent]);

  const toggleLowBattery = useCallback(() => {
    setState((prev) => ({
      ...prev,
      battery: prev.battery > 20 ? 12 : 87,
      failures: { ...prev.failures, lowBattery: prev.battery > 20 }
    }));
  }, []);

  // SCENARIOS & MISSED DOSE
  const simulateMissedDose = useCallback(() => {
    setState((prev) => {
      const targetSchedule = prev.medicationSchedule[1];
      
      const newDoseRecord: DoseRecord = {
        id: 'dose-miss-' + Math.random().toString(36).substring(2, 9),
        medicationId: targetSchedule.id,
        medicationName: targetSchedule.name,
        compartmentId: targetSchedule.compartmentId,
        scheduledTime: targetSchedule.scheduledTime,
        status: 'MISSED',
        delayMinutes: 0,
        date: new Date().toISOString().split('T')[0],
        weightBefore: targetSchedule.expectedWeight,
        weightAfter: targetSchedule.expectedWeight
      };

      const updatedHistory = [newDoseRecord, ...prev.doseHistory];
      const newCompliance = calculateCompliance(updatedHistory);

      return {
        ...prev,
        doseHistory: updatedHistory,
        compliance: newCompliance,
        hardwareOutputs: {
          led: 'WARNING',
          buzzer: 'REMINDER'
        },
        highlightedHardwareComponent: 'BUZZER',
        currentFirmwareFunction: 'recordMissedDose()'
      };
    });

    triggerSignal('RTC', 'ESP32', 'I2C', 'GPIO 21', 'Grace period expired -> MISSED DOSE');
    logEvent(
      'DOSE_MISSED',
      'Medication Scheduler',
      'Grace period expired for Medicine B (02:00 PM). Dose marked MISSED.',
      'CRITICAL',
      'Medication Engine',
      'I2C RTC',
      'recordMissedDose()'
    );

    addAlert(
      'MEDICATION',
      'MISSED_DOSE',
      'CRITICAL',
      'Missed Medication Alert - Medicine B',
      'Scheduled dose at 02:00 PM was not taken within 15 minute grace period.',
      'Medication Engine',
      'Compartment A2'
    );
  }, [triggerSignal, logEvent, addAlert]);

  // DEMO STEP RUNNER
  const setDemoStep = useCallback((stepIndex: number) => {
    const clampedIndex = Math.max(1, Math.min(DEMO_STEPS.length, stepIndex));
    const stepDef = DEMO_STEPS[clampedIndex - 1];

    setState((prev) => {
      let newTemp = prev.temperature;
      let newDoor = prev.doorOpen;
      let newPresent = prev.medicinePresent;
      let newWeight = prev.weight;
      let newLed: HardwareLedState = prev.hardwareOutputs.led;
      let newBuzzer: HardwareBuzzerState = prev.hardwareOutputs.buzzer;

      if (clampedIndex === 1 || clampedIndex === 2) {
        newTemp = 24.0;
        newDoor = false;
        newPresent = true;
        newWeight = 52.4;
        newLed = 'NORMAL';
        newBuzzer = 'OFF';
      } else if (clampedIndex === 8) {
        newLed = 'WARNING';
        newBuzzer = 'REMINDER';
      } else if (clampedIndex === 9 || clampedIndex === 10) {
        newDoor = true;
      } else if (clampedIndex === 12 || clampedIndex === 13 || clampedIndex === 14) {
        newPresent = false;
        newWeight = 0.0;
      } else if (clampedIndex === 16) {
        newLed = 'NORMAL';
        newBuzzer = 'OFF';
      } else if (clampedIndex === 21) {
        newLed = 'WARNING';
        newBuzzer = 'REMINDER';
      } else if (clampedIndex === 22 || clampedIndex === 23) {
        newTemp = 28.5;
        newLed = 'WARNING';
      }

      return {
        ...prev,
        isDemoRunning: true,
        currentDemoStep: clampedIndex,
        temperature: newTemp,
        doorOpen: newDoor,
        medicinePresent: newPresent,
        weight: newWeight,
        hardwareOutputs: { led: newLed, buzzer: newBuzzer },
        highlightedHardwareComponent: stepDef.highlightedComponent,
        currentFirmwareFunction: stepDef.firmwareFunction
      };
    });

    logEvent(
      'DEMO_STEP',
      'Complete Demo Runner',
      `Demo Step ${clampedIndex}: ${stepDef.title}`,
      'INFO',
      stepDef.highlightedComponent,
      'Demo Controller',
      stepDef.firmwareFunction
    );
  }, [logEvent]);

  const runCompleteDemo = useCallback(() => {
    setDemoStep(1);
  }, [setDemoStep]);

  const stopDemo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDemoRunning: false,
      currentDemoStep: 0,
      highlightedHardwareComponent: null,
      currentFirmwareFunction: 'loop()'
    }));
  }, []);

  const nextDemoStep = useCallback(() => {
    if (state.currentDemoStep < DEMO_STEPS.length) {
      setDemoStep(state.currentDemoStep + 1);
    }
  }, [state.currentDemoStep, setDemoStep]);

  const prevDemoStep = useCallback(() => {
    if (state.currentDemoStep > 1) {
      setDemoStep(state.currentDemoStep - 1);
    }
  }, [state.currentDemoStep, setDemoStep]);

  // CONTROLS & SELECTION
  const startSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, simulationRunning: true }));
  }, []);

  const pauseSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, simulationRunning: false }));
  }, []);

  const resetSimulation = useCallback(() => {
    localStorage.removeItem('ESP32_MED_DIGITAL_TWIN_STATE');
    setState({
      deviceId: 'MED-ESP32-001',
      temperature: 24.0,
      humidity: 48,
      doorOpen: false,
      medicinePresent: true,
      weight: 52.4,
      battery: 87,
      wifiConnected: true,
      rtcSynchronized: true,
      currentSimulationTime: new Date(),
      simulationRunning: true,
      simulationSpeed: 1,
      sensorsOnline: true,
      compartments: {
        A1: { medicineName: 'Medicine A (BP)', present: true, weight: 52.4 },
        A2: { medicineName: 'Medicine B (Cholesterol)', present: true, weight: 44.1 },
        A3: { medicineName: 'Medicine C (Diabetes)', present: true, weight: 61.8 },
        A4: { medicineName: 'Medicine D (Vitamin D3)', present: true, weight: 38.0 }
      },
      medicationSchedule: INITIAL_SCHEDULE,
      doseHistory: INITIAL_DOSE_HISTORY,
      alerts: [
        {
          id: 'alert-reset-1',
          timestamp: new Date().toLocaleTimeString(),
          category: 'HARDWARE',
          type: 'SYSTEM_RESET',
          severity: 'INFO',
          title: 'System Reset Completed',
          description: 'Simulation state restored to baseline operational defaults.',
          status: 'ACTIVE',
          source: 'ESP32 Controller',
          relatedComponent: 'ESP32'
        }
      ],
      events: [],
      sensorHistory: [],
      compliance: 91,
      storageHealth: 94,
      hardwareOutputs: { led: 'NORMAL', buzzer: 'OFF' },
      activeSignals: [],
      currentDataPacket: null,
      currentFirmwareFunction: 'loop()',
      highlightedHardwareComponent: null,
      failures: INITIAL_FAILURES,
      settings: INITIAL_SETTINGS,
      isDemoRunning: false,
      currentDemoStep: 0,
      isVivaMode: false,
      isPresentationMode: false
    });
  }, []);

  const stepSimulation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentSimulationTime: new Date(prev.currentSimulationTime.getTime() + 5000)
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, simulationSpeed: speed }));
  }, []);

  const selectHardwareComponent = useCallback((compName: string | null) => {
    setState((prev) => ({ ...prev, highlightedHardwareComponent: compName }));
  }, []);

  const selectFirmwareFunction = useCallback((fnName: string | null) => {
    setState((prev) => ({ ...prev, currentFirmwareFunction: fnName }));
  }, []);

  const toggleVivaMode = useCallback(() => {
    setState((prev) => ({ ...prev, isVivaMode: !prev.isVivaMode }));
  }, []);

  const togglePresentationMode = useCallback(() => {
    setState((prev) => ({ ...prev, isPresentationMode: !prev.isPresentationMode }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<typeof INITIAL_SETTINGS>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const saveLocalState = useCallback(() => {
    localStorage.setItem('ESP32_MED_DIGITAL_TWIN_STATE', JSON.stringify(state));
    logEvent(
      'DATABASE_SAVE',
      'Local Storage',
      'Simulation state saved to browser localStorage.',
      'INFO',
      'LOCAL STORAGE',
      'Indexed DB / LocalStorage',
      'saveStateToNVS()'
    );
  }, [state, logEvent]);

  const clearSavedState = useCallback(() => {
    localStorage.removeItem('ESP32_MED_DIGITAL_TWIN_STATE');
    resetSimulation();
  }, [resetSimulation]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
      )
    }));
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        state,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        stepSimulation,
        setSpeed,
        openDoor,
        closeDoor,
        removeMedicine,
        restoreMedicine,
        raiseTemperature,
        lowerTemperature,
        raiseHumidity,
        lowerHumidity,
        toggleSensorFailure,
        toggleWifi,
        togglePower,
        toggleLowBattery,
        simulateMissedDose,
        runCompleteDemo,
        stopDemo,
        nextDemoStep,
        prevDemoStep,
        setDemoStep,
        selectHardwareComponent,
        selectFirmwareFunction,
        toggleVivaMode,
        togglePresentationMode,
        updateSettings,
        saveLocalState,
        clearSavedState,
        acknowledgeAlert,
        triggerSignal
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
