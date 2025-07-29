export interface Expert {
  id: number;
  name: string;
  quote: string;
  context: string;
  title?: string;        // made optional
  expertise?: string;    // made optional
}

export interface ExpertForm {
  name: string;
  title: string;
  expertise: string;
  quote: string;
  context: string;
}

export interface GenerateContentRequest {
  topic: string;
  experts: Expert[];
}

export interface GenerateContentResponse {
  content: string;
  error?: string;
}

export interface UseExpertsReturn {
  experts: Expert[];
  addExpert: (expertData: ExpertForm) => void;
  removeExpert: (id: number) => void;
  clearExperts: () => void;
}