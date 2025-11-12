import { apiGet, apiPost, apiPostFormData, apiDelete } from "../api";

export interface CreateResumeRequest {
  file: File;
  job_title: string;
  job_description: string;
  company_name?: string;
}

export interface CreateResumeResponse {
  resume_id: string;
  feedback: Feedback;
}

export const resumeApi = {
  async list(init: RequestInit = {}): Promise<Resume[]> {
    return apiGet<Resume[]>("/api/resumes", init);
  },

  async get(id: string, init: RequestInit = {}): Promise<Resume> {
    return apiGet<Resume>(`/api/resumes/${id}`, init);
  },

  async analyze(
    data: CreateResumeRequest,
    init: RequestInit = {},
  ): Promise<CreateResumeResponse> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("job_title", data.job_title);
    formData.append("job_description", data.job_description);
    if (data.company_name) {
      formData.append("company_name", data.company_name);
    }

    return apiPostFormData<CreateResumeResponse>(
      "/api/analyze/resume",
      formData,
      init,
    );
  },

  async delete(id: string, init: RequestInit = {}): Promise<void> {
    await apiDelete(`/api/resumes/${id}`, init);
  },
};
