// Care Agent Data Configuration
export interface CareAgent {
  id: string;
  name: string;
  type: 'finance' | 'wellness' | 'alpha' | 'custom';
  description: string;
  capabilities: string[];
  pricing: {
    mintCost: number;
    monthlyFee: number;
    currency: string;
  };
  status: 'active' | 'inactive' | 'beta';
  xp: number;
  level: number;
  tasksCompleted: number;
  successRate: number;
  totalEarnings: number;
  avatar: string;
  color: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'monitoring' | 'critical';
  lastVisit: string;
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Appointment {
  id: string;
  patientId: number;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reason: string;
  notes: string;
  urgency: 'normal' | 'high' | 'urgent';
}

export interface HospitalConfig {
  slug: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  departments: string[];
  doctors: Doctor[];
  services: string[];
  operatingHours: {
    weekdays: string;
    weekends: string;
    emergency: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  experience: number;
  rating: number;
  availability: {
    weekdays: string[];
    weekends: string[];
  };
  bio: string;
  avatar: string;
}

// Mock Data
export const careAgents: CareAgent[] = [
  {
    id: 'finance-agent',
    name: 'Autonomous CFO',
    type: 'finance',
    description: 'AI-powered financial intelligence and treasury management',
    capabilities: ['Portfolio Analysis', 'Risk Assessment', 'Yield Optimization', 'Tax Planning', 'DeFi Strategies'],
    pricing: {
      mintCost: 100,
      monthlyFee: 25,
      currency: 'DMT'
    },
    status: 'active',
    xp: 2450,
    level: 4,
    tasksCompleted: 127,
    successRate: 94,
    totalEarnings: 1850,
    avatar: '🧠',
    color: 'emerald'
  },
  {
    id: 'wellness-agent',
    name: 'Care Orchestrator',
    type: 'wellness',
    description: 'Comprehensive health & wellness management',
    capabilities: ['Health Monitoring', 'Mood Tracking', 'Medication Reminders', 'Wellness Tips', 'Health Analytics'],
    pricing: {
      mintCost: 80,
      monthlyFee: 20,
      currency: 'DMT'
    },
    status: 'active',
    xp: 1200,
    level: 3,
    tasksCompleted: 85,
    successRate: 88,
    totalEarnings: 1200,
    avatar: '❤️',
    color: 'rose'
  },
  {
    id: 'alpha-agent',
    name: 'Crypto Alpha Assistant',
    type: 'alpha',
    description: 'Advanced crypto market analysis and alpha generation',
    capabilities: ['Token Analytics', 'Market Research', 'Alpha Signals', 'Portfolio Optimization', 'Risk Management'],
    pricing: {
      mintCost: 150,
      monthlyFee: 35,
      currency: 'DMT'
    },
    status: 'active',
    xp: 3200,
    level: 5,
    tasksCompleted: 203,
    successRate: 91,
    totalEarnings: 2400,
    avatar: '📈',
    color: 'purple'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    condition: 'Diabetes Type 2',
    status: 'stable',
    lastVisit: '2024-01-15',
    medicalHistory: ['Hypertension', 'High Cholesterol'],
    medications: ['Metformin', 'Lisinopril', 'Atorvastatin'],
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 123-4567',
      relationship: 'Spouse'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    condition: 'Hypertension',
    status: 'monitoring',
    lastVisit: '2024-01-14',
    medicalHistory: ['Pregnancy (2020)', 'Anxiety'],
    medications: ['Amlodipine', 'Lorazepam'],
    allergies: ['Latex'],
    emergencyContact: {
      name: 'Mike Smith',
      phone: '(555) 234-5678',
      relationship: 'Husband'
    }
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 58,
    condition: 'Coronary Artery Disease',
    status: 'critical',
    lastVisit: '2024-01-13',
    medicalHistory: ['Heart Attack (2022)', 'Diabetes', 'Smoking History'],
    medications: ['Aspirin', 'Metoprolol', 'Atorvastatin', 'Clopidogrel'],
    allergies: ['Contrast Dye'],
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '(555) 345-6789',
      relationship: 'Daughter'
    }
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 1,
    doctorId: 'dr-sarah-johnson',
    department: 'Endocrinology',
    date: '2024-01-20',
    time: '10:00 AM',
    duration: 30,
    status: 'scheduled',
    reason: 'Diabetes follow-up',
    notes: 'Patient reports good glucose control',
    urgency: 'normal'
  },
  {
    id: 'apt-002',
    patientId: 2,
    doctorId: 'dr-michael-chen',
    department: 'Cardiology',
    date: '2024-01-18',
    time: '02:30 PM',
    duration: 45,
    status: 'scheduled',
    reason: 'Blood pressure check',
    notes: 'Monitor medication effectiveness',
    urgency: 'high'
  }
];

export const hospitalConfigs: HospitalConfig[] = [
  {
    slug: 'general-hospital',
    name: 'General Hospital',
    address: '123 Medical Center Dr, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@generalhospital.com',
    departments: ['Cardiology', 'Emergency', 'Internal Medicine', 'Pediatrics', 'Surgery'],
    doctors: [
      {
        id: 'dr-sarah-johnson',
        name: 'Dr. Sarah Johnson',
        specialization: 'Endocrinology',
        department: 'Internal Medicine',
        experience: 15,
        rating: 4.8,
        availability: {
          weekdays: ['09:00-17:00'],
          weekends: ['10:00-14:00']
        },
        bio: 'Specialized in diabetes management and endocrine disorders',
        avatar: '👩‍⚕️'
      },
      {
        id: 'dr-michael-chen',
        name: 'Dr. Michael Chen',
        specialization: 'Cardiology',
        department: 'Cardiology',
        experience: 20,
        rating: 4.9,
        availability: {
          weekdays: ['08:00-16:00'],
          weekends: []
        },
        bio: 'Expert in cardiovascular diseases and preventive care',
        avatar: '👨‍⚕️'
      }
    ],
    services: ['Emergency Care', 'Surgery', 'Diagnostics', 'Rehabilitation', 'Mental Health'],
    operatingHours: {
      weekdays: '6:00 AM - 10:00 PM',
      weekends: '8:00 AM - 6:00 PM',
      emergency: '24/7'
    }
  }
];

// Utility Functions
export const getAgentById = (id: string): CareAgent | undefined => {
  return careAgents.find(agent => agent.id === id);
};

export const getPatientById = (id: number): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find(appointment => appointment.id === id);
};

export const getHospitalBySlug = (slug: string): HospitalConfig | undefined => {
  return hospitalConfigs.find(hospital => hospital.slug === slug);
};

export const getTotalXP = (): number => {
  return careAgents.reduce((total, agent) => total + agent.xp, 0);
};

export const getTotalEarnings = (): number => {
  return careAgents.reduce((total, agent) => total + agent.totalEarnings, 0);
};

export const getGlobalLevel = (): number => {
  const totalXP = getTotalXP();
  return Math.floor(totalXP / 1000) + 1;
};

export const getAgentStats = (agentId: string) => {
  const agent = getAgentById(agentId);
  if (!agent) return null;

  return {
    xp: agent.xp,
    level: agent.level,
    tasksCompleted: agent.tasksCompleted,
    successRate: agent.successRate,
    totalEarnings: agent.totalEarnings,
    nextLevelXP: (agent.level + 1) * 1000 - agent.xp
  };
};

export const formatCurrency = (amount: number, currency: string = 'DMT'): string => {
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString: string): string => {
  return timeString;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'stable':
    case 'active':
    case 'completed':
    case 'online':
      return 'text-green-400 bg-green-500/20';
    case 'monitoring':
    case 'warning':
    case 'scheduled':
      return 'text-yellow-400 bg-yellow-500/20';
    case 'critical':
    case 'offline':
    case 'cancelled':
      return 'text-red-400 bg-red-500/20';
    case 'inactive':
    case 'rescheduled':
      return 'text-gray-400 bg-gray-500/20';
    default:
      return 'text-gray-400 bg-gray-500/20';
  }
};

export const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'urgent':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 'high':
      return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    case 'normal':
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  }
};
