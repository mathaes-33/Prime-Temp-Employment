
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
export type JobCategory = 'Technology' | 'Design' | 'Administrative' | 'Management' | 'Marketing' | 'Finance' | 'Healthcare';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  category: JobCategory;
  description: string;
  responsibilities: string[];
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    visible: boolean;
  };
  featured: boolean;
  postedDate: string; // ISO 8601 date string
  applicationDeadline: string; // ISO 8601 date string
}

export type NewJob = Omit<Job, 'id' | 'postedDate'>;

export interface EmployeeFormData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  availability: string[];
  desiredIndustries: string;
  skills: string;
  workHistory: string;
  resume: string;
  coverLetter: string;
  jobTitle: string;
  dataConsent: boolean;
  resumeFilename?: string;
  submittedAt?: string;
}

export interface EmployerFormData {
  id?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  staffingNeed: string;
  submittedAt?: string;
}

export type NotificationType = {
  message: string;
  type: 'success' | 'error';
};
