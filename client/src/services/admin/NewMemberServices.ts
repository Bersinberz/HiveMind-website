import axiosInstance from "../axiosInstance";

export interface NewMember {
    _id: string;
    fullname: string;
    registerNumber: string;
    email: string;
    phoneNumber: string;
    dept: string;
    year: "1st" | "2nd" | "3rd" | "4th";
    linkedin: string;
    github?: string;
    resume: string; // Cloudinary URL
    portfolio?: string;
    domainOfInterest: string;
    programmingLanguages: string[];
    whyJoin: string;
    hoursPerWeek: number;
    howDidYouHear: string;
    status: "Pending" | "Interviewed" | "Approved" | "Rejected";
    createdAt?: string;
    updatedAt?: string;
}

export interface NewMemberResponse {
    success: boolean;
    message?: string;
    applicant?: NewMember;
    applications?: NewMember[];
}

const NewMemberServices = {
    applyMember: async (data: Omit<NewMember, "_id" | "status" | "createdAt" | "updatedAt">): Promise<NewMemberResponse> => {
        // This is a public endpoint, but it goes through axiosInstance just like other routes.
        const response = await axiosInstance.post<NewMemberResponse>("/v1/new-members/apply", data);
        return response.data;
    },

    getApplications: async (): Promise<NewMemberResponse> => {
        const response = await axiosInstance.get<NewMemberResponse>("/v1/new-members");
        return response.data;
    },

    updateApplicationStatus: async (id: string, status: NewMember["status"]): Promise<NewMemberResponse> => {
        const response = await axiosInstance.put<NewMemberResponse>(`/v1/new-members/${id}/status`, { status });
        return response.data;
    },

    deleteApplication: async (id: string): Promise<NewMemberResponse> => {
        const response = await axiosInstance.delete<NewMemberResponse>(`/v1/new-members/${id}`);
        return response.data;
    }
};

export default NewMemberServices;
