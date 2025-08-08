import { LampData } from '../types';

const lampsDatabase: LampData[] = [
  {
    id: 'TUV-T5-31.3W',
    model: 'TUV T5 31.3W UV-C',
    manufacturer: 'Philips',
    power: 75,  // Potencia total de la lámpara
    uvcOutput: 31.3,  // 31.3W de salida UV-C
    length: 120,
    diameter: 1.6,
    lifetime: 9000,
    price: 85,
    efficiency: 41.7,  // 31.3/75 = 41.7% de eficiencia UV-C
    spectrum: 253.7,
    degradationRate: 0.15
  },
  {
    id: 'TUV-31W',
    model: 'TUV T5 HO 31W',
    manufacturer: 'Philips',
    power: 31,
    uvcOutput: 11.5,
    length: 120,
    diameter: 1.6,
    lifetime: 9000,
    price: 45,
    efficiency: 37.1,
    spectrum: 253.7,
    degradationRate: 0.15
  },
  {
    id: 'TUV-55W',
    model: 'TUV T8 55W HO',
    manufacturer: 'Philips',
    power: 55,
    uvcOutput: 18,
    length: 90,
    diameter: 2.6,
    lifetime: 9000,
    price: 65,
    efficiency: 32.7,
    spectrum: 253.7,
    degradationRate: 0.15
  },
  {
    id: 'TUV-75W',
    model: 'TUV T8 75W HO',
    manufacturer: 'Philips',
    power: 75,
    uvcOutput: 25.5,
    length: 120,
    diameter: 2.6,
    lifetime: 9000,
    price: 85,
    efficiency: 34,
    spectrum: 253.7,
    degradationRate: 0.15
  },
  {
    id: 'PURITEC-24W',
    model: 'PURITEC HNS 24W',
    manufacturer: 'OSRAM',
    power: 24,
    uvcOutput: 7.7,
    length: 32,
    diameter: 1.6,
    lifetime: 8000,
    price: 38,
    efficiency: 32.1,
    spectrum: 253.7,
    degradationRate: 0.18
  },
  {
    id: 'PURITEC-36W',
    model: 'PURITEC HNS 36W',
    manufacturer: 'OSRAM',
    power: 36,
    uvcOutput: 13.5,
    length: 120,
    diameter: 2.6,
    lifetime: 8000,
    price: 52,
    efficiency: 37.5,
    spectrum: 253.7,
    degradationRate: 0.18
  },
  {
    id: 'PURITEC-95W',
    model: 'PURITEC HNS XPT 95W',
    manufacturer: 'OSRAM',
    power: 95,
    uvcOutput: 32,
    length: 150,
    diameter: 3.8,
    lifetime: 12000,
    price: 125,
    efficiency: 33.7,
    spectrum: 253.7,
    degradationRate: 0.12
  },
  {
    id: 'GHO-287',
    model: 'GHO64T5L/4P',
    manufacturer: 'Atlantic UV',
    power: 287,
    uvcOutput: 95,
    length: 150,
    diameter: 3.8,
    lifetime: 10000,
    price: 285,
    efficiency: 33.1,
    spectrum: 253.7,
    degradationRate: 0.20
  },
  {
    id: 'STERIL-AIRE-UVC-36',
    model: 'UVC Emitter 36"',
    manufacturer: 'Steril-Aire',
    power: 105,
    uvcOutput: 36,
    length: 91.4,
    diameter: 3.8,
    lifetime: 9000,
    price: 195,
    efficiency: 34.3,
    spectrum: 253.7,
    degradationRate: 0.15
  },
  {
    id: 'UV-GUARD-50W',
    model: 'UV-GUARD T5 50W',
    manufacturer: 'UV Guard',
    power: 50,
    uvcOutput: 16.5,
    length: 100,
    diameter: 1.6,
    lifetime: 8500,
    price: 58,
    efficiency: 33,
    spectrum: 253.7,
    degradationRate: 0.17
  },
  {
    id: 'SANKYO-G40T10',
    model: 'G40T10',
    manufacturer: 'Sankyo Denki',
    power: 40,
    uvcOutput: 13.4,
    length: 120,
    diameter: 2.5,
    lifetime: 8000,
    price: 48,
    efficiency: 33.5,
    spectrum: 253.7,
    degradationRate: 0.16
  }
];

export function getLampsList(): LampData[] {
  return lampsDatabase;
}

export function getLampData(lampId: string): LampData {
  const lamp = lampsDatabase.find(l => l.id === lampId);
  if (!lamp) {
    return lampsDatabase[0];
  }
  return lamp;
}

export function calculateLampDegradation(
  initialOutput: number,
  hoursUsed: number,
  degradationRate: number
): number {
  const degradationFactor = Math.exp(-degradationRate * (hoursUsed / 1000));
  return initialOutput * degradationFactor;
}

export function calculateReplacementSchedule(
  lamp: LampData,
  hoursPerDay: number,
  targetEfficiency: number = 0.7
): {
  replacementHours: number;
  replacementDays: number;
  replacementMonths: number;
} {
  const replacementHours = -Math.log(targetEfficiency) / lamp.degradationRate * 1000;
  const effectiveReplacementHours = Math.min(replacementHours, lamp.lifetime);
  
  return {
    replacementHours: effectiveReplacementHours,
    replacementDays: effectiveReplacementHours / hoursPerDay,
    replacementMonths: (effectiveReplacementHours / hoursPerDay) / 30
  };
}

export function calculateOperatingCost(
  lamp: LampData,
  numberOfLamps: number,
  hoursPerDay: number,
  electricityCostPerKWh: number,
  daysPerYear: number = 365
): {
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  lampReplacementCostPerYear: number;
  totalAnnualCost: number;
} {
  const dailyEnergy = (lamp.power / 1000) * hoursPerDay * numberOfLamps;
  const dailyCost = dailyEnergy * electricityCostPerKWh;
  const monthlyCost = dailyCost * 30;
  const annualCost = dailyCost * daysPerYear;
  
  const replacementSchedule = calculateReplacementSchedule(lamp, hoursPerDay);
  const replacementsPerYear = daysPerYear / replacementSchedule.replacementDays;
  const lampReplacementCostPerYear = replacementsPerYear * lamp.price * numberOfLamps;
  
  return {
    dailyCost,
    monthlyCost,
    annualCost,
    lampReplacementCostPerYear,
    totalAnnualCost: annualCost + lampReplacementCostPerYear
  };
}