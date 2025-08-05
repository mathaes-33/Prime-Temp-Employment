
import { Job, NewJob, EmployeeFormData, EmployerFormData } from '../../types';

// --- INITIAL DATA & SEEDING ---
const initialJobs: Job[] = [
    {
      "id": "1",
      "title": "Senior Frontend Developer",
      "company": "Innovatech Solutions",
      "location": "Toronto, ON",
      "employmentType": "Full-time",
      "category": "Technology",
      "description": "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the \"client-side\" of our web applications.",
      "responsibilities": ["Develop new user-facing features", "Build reusable code and libraries for future use", "Ensure the technical feasibility of UI/UX designs"],
      "requirements": ["React", "TypeScript", "Tailwind CSS", "5+ years of experience"],
      "salary": { "min": 120000, "max": 150000, "currency": "CAD", "visible": true },
      "featured": true,
      "postedDate": "2024-07-22T12:00:00.000Z",
      "applicationDeadline": "2024-08-21T12:00:00.000Z"
    },
    {
      "id": "2",
      "title": "UX/UI Designer",
      "company": "Creative Minds Inc.",
      "location": "Mississauga, ON",
      "employmentType": "Contract",
      "category": "Design",
      "description": "Seeking a talented UX/UI designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design.",
      "responsibilities": ["Gather and evaluate user requirements in collaboration with product managers and engineers", "Illustrate design ideas using storyboards, process flows and sitemaps", "Design graphic user interface elements, like menus, tabs and widgets"],
      "requirements": ["Figma", "Sketch", "Prototyping", "User Research"],
      "salary": { "min": 75, "max": 95, "currency": "CAD/hr", "visible": true },
      "featured": false,
      "postedDate": "2024-07-20T12:00:00.000Z",
      "applicationDeadline": "2024-08-19T12:00:00.000Z"
    },
    {
      "id": "3",
      "title": "Data Entry Clerk",
      "company": "Global Logistics",
      "location": "Brampton, ON",
      "employmentType": "Temporary",
      "category": "Administrative",
      "description": "A detail-oriented Data Entry Clerk is needed for a 3-month project. Accuracy and speed are essential for this role.",
      "responsibilities": ["Insert customer and account data by inputting text based and numerical information from source documents within time limits", "Compile, verify accuracy and sort information according to priorities to prepare source data for computer entry", "Review data for deficiencies or errors, correct any incompatibilities if possible and check output"],
      "requirements": ["Microsoft Excel", "Typing speed of 60+ WPM", "High school diploma"],
      "salary": { "min": 22, "max": 28, "currency": "CAD/hr", "visible": true },
      "featured": false,
      "postedDate": "2024-07-15T12:00:00.000Z",
      "applicationDeadline": "2024-08-14T12:00:00.000Z"
    },
    {
      "id": "4",
      "title": "Project Manager",
      "company": "DevLaunch",
      "location": "Vaughan, ON",
      "employmentType": "Full-time",
      "category": "Management",
      "description": "Lead our software development projects from conception to launch. You will coordinate with cross-functional teams to ensure timely delivery.",
      "responsibilities": ["Coordinate internal resources and third parties/vendors for the flawless execution of projects", "Ensure that all projects are delivered on-time, within scope and within budget", "Develop a detailed project plan to track progress"],
      "requirements": ["Agile methodologies", "PMP certification", "Excellent communication skills"],
      "salary": { "min": 110000, "max": 140000, "currency": "CAD", "visible": false },
      "featured": true,
      "postedDate": "2024-07-23T12:00:00.000Z",
      "applicationDeadline": "2024-08-22T12:00:00.000Z"
    },
    {
      "id": "5",
      "title": "Graphic Designer",
      "company": "MarketBoost",
      "location": "Markham, ON",
      "employmentType": "Part-time",
      "category": "Marketing",
      "description": "Create visually stunning graphics for our marketing campaigns, social media, and website. A strong portfolio is a must.",
      "responsibilities": ["Study design briefs and determine requirements", "Conceptualize visuals based on requirements", "Prepare rough drafts and present ideas"],
      "requirements": ["Adobe Creative Suite (Photoshop, Illustrator)", "Branding", "2+ years of experience"],
      "featured": false,
      "postedDate": "2024-07-10T12:00:00.000Z",
      "applicationDeadline": "2024-08-09T12:00:00.000Z"
    },
    {
      "id": "6",
      "title": "Administrative Assistant",
      "company": "Executive Solutions",
      "location": "Toronto, ON",
      "employmentType": "Full-time",
      "category": "Administrative",
      "description": "Provide administrative support to our executive team. Responsibilities include scheduling meetings, managing correspondence, and organizing files.",
      "responsibilities": ["Answer and direct phone calls", "Organize and schedule appointments and meetings", "Maintain contact lists"],
      "requirements": ["Microsoft Office Suite", "Organizational skills", "Discretion"],
      "salary": { "min": 60000, "max": 70000, "currency": "CAD", "visible": true },
      "featured": false,
      "postedDate": "2024-06-30T12:00:00.000Z",
      "applicationDeadline": "2024-07-30T12:00:00.000Z"
    }
];

const seedData = () => {
    if (!localStorage.getItem('jobs')) {
        localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }
    if (!localStorage.getItem('employeeApplications')) {
        localStorage.setItem('employeeApplications', '[]');
    }
    if (!localStorage.getItem('employerInquiries')) {
        localStorage.setItem('employerInquiries', '[]');
    }
};

// Seed data on initial load
seedData();

// --- MOCK API ---
const MOCK_API_DELAY = 500;

const simulateRequest = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), MOCK_API_DELAY));
};

const simulateError = (message: string): Promise<never> => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), MOCK_API_DELAY));
}

// --- JOB API ---
export interface JobFilters {
  searchTerm?: string;
  employmentType?: string;
  location?: string;
  remoteOnly?: boolean;
}

export interface PaginatedJobsResponse {
  jobs: Job[];
  totalCount: number;
}

export const getJobs = async (filters: JobFilters = {}, page: number = 1, limit: number = 6): Promise<PaginatedJobsResponse> => {
    let allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');

    if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        allJobs = allJobs.filter(job => job.title.toLowerCase().includes(term) || job.company.toLowerCase().includes(term));
    }
    if (filters.employmentType && filters.employmentType !== 'all') {
        allJobs = allJobs.filter(job => job.employmentType === filters.employmentType);
    }
    if (filters.remoteOnly) {
        allJobs = allJobs.filter(job => job.location.toLowerCase().includes('remote'));
    } else if (filters.location && filters.location !== 'all') {
        allJobs = allJobs.filter(job => job.location === filters.location);
    }

    allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    
    const totalCount = allJobs.length;
    const paginatedJobs = allJobs.slice((page - 1) * limit, page * limit);
    
    return simulateRequest({ jobs: paginatedJobs, totalCount });
};

export const getJob = async (id: string): Promise<Job> => {
  const allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
  const job = allJobs.find(j => j.id === id);
  if (job) {
    return simulateRequest(job);
  }
  return simulateError('404 - Job not found');
};

export const getUniqueValues = async (field: keyof Job): Promise<string[]> => {
  const allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
  const uniqueValues = Array.from(new Set(allJobs.map(job => job[field]).filter(Boolean) as string[]));
  return simulateRequest(uniqueValues.sort());
}

export const createJob = async (jobData: NewJob): Promise<Job> => {
    const allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob: Job = {
        ...jobData,
        id: String(Date.now() + Math.random()),
        postedDate: new Date().toISOString(),
    };
    allJobs.unshift(newJob);
    localStorage.setItem('jobs', JSON.stringify(allJobs));
    return simulateRequest(newJob);
};

export const updateJob = async (jobData: Job): Promise<Job> => {
    let allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
    const index = allJobs.findIndex(j => j.id === jobData.id);
    if (index !== -1) {
        allJobs[index] = jobData;
        localStorage.setItem('jobs', JSON.stringify(allJobs));
        return simulateRequest(jobData);
    }
    return simulateError('Job not found for update');
};

export const deleteJob = async (jobId: string): Promise<{}> => {
    let allJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
    const filteredJobs = allJobs.filter(j => j.id !== jobId);
    localStorage.setItem('jobs', JSON.stringify(filteredJobs));
    return simulateRequest({});
};


// --- APPLICATION API ---
export const getApplications = async (): Promise<EmployeeFormData[]> => {
    const apps: EmployeeFormData[] = JSON.parse(localStorage.getItem('employeeApplications') || '[]');
    apps.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    return simulateRequest(apps);
};

export const createApplication = async (appData: EmployeeFormData): Promise<EmployeeFormData> => {
    const apps: EmployeeFormData[] = JSON.parse(localStorage.getItem('employeeApplications') || '[]');
    const newApp = {
        ...appData,
        id: String(Date.now() + Math.random()),
        submittedAt: new Date().toISOString()
    };
    apps.push(newApp);
    localStorage.setItem('employeeApplications', JSON.stringify(apps));
    return simulateRequest(newApp);
};

export const deleteApplication = async (id: string): Promise<{}> => {
    let apps: EmployeeFormData[] = JSON.parse(localStorage.getItem('employeeApplications') || '[]');
    const filteredApps = apps.filter(app => app.id !== id);
    localStorage.setItem('employeeApplications', JSON.stringify(filteredApps));
    return simulateRequest({});
};


// --- INQUIRY API ---
export const getInquiries = async (): Promise<EmployerFormData[]> => {
    const inquiries: EmployerFormData[] = JSON.parse(localStorage.getItem('employerInquiries') || '[]');
    inquiries.sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime());
    return simulateRequest(inquiries);
};

export const createInquiry = async (inquiryData: EmployerFormData): Promise<EmployerFormData> => {
    const inquiries: EmployerFormData[] = JSON.parse(localStorage.getItem('employerInquiries') || '[]');
    const newInquiry = {
        ...inquiryData,
        id: String(Date.now() + Math.random()),
        submittedAt: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    localStorage.setItem('employerInquiries', JSON.stringify(inquiries));
    return simulateRequest(newInquiry);
};

export const deleteInquiry = async (id: string): Promise<{}> => {
    let inquiries: EmployerFormData[] = JSON.parse(localStorage.getItem('employerInquiries') || '[]');
    const filteredInquiries = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem('employerInquiries', JSON.stringify(filteredInquiries));
    return simulateRequest({});
};
