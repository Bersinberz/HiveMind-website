import axiosInstance from "../axiosInstance";

export interface Project {
    _id: string;
    title: string;
    description: string;
    domain: string[];
    techStack: string[];
    github: string;
    liveDemo?: string;
    thumbnail: string;
    startDate: string;
    endDate: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectResponse {
    success: boolean;
    message?: string;
    project?: Project;
    projects?: Project[];
}

const Projectservices = {
    getProjects: async (): Promise<ProjectResponse> => {
        const response = await axiosInstance.get<ProjectResponse>("/v1/projects");
        return response.data;
    },

    createProject: async (data: Omit<Project, "_id" | "createdAt" | "updatedAt">): Promise<ProjectResponse> => {
        const response = await axiosInstance.post<ProjectResponse>("/v1/projects", data);
        return response.data;
    },

    updateProject: async (id: string, data: Partial<Omit<Project, "_id" | "createdAt" | "updatedAt">>): Promise<ProjectResponse> => {
        const response = await axiosInstance.put<ProjectResponse>(`/v1/projects/${id}`, data);
        return response.data;
    },

    deleteProject: async (id: string): Promise<ProjectResponse> => {
        const response = await axiosInstance.delete<ProjectResponse>(`/v1/projects/${id}`);
        return response.data;
    },
};

export default Projectservices;
