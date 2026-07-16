import axiosInstance from "../axiosInstance";

export interface IDashboardActivity {
    id: string;
    type: "member" | "project" | "application";
    title: string;
    description: string;
    timestamp: string;
}

export interface IDepartmentCount {
    department: string;
    count: number;
}

export interface IDashboardStats {
    totalMembers: number;
    totalProjects: number;
    pendingApplications: number;
    totalVisitors: number;
    recentActivities: IDashboardActivity[];
    departmentDistribution: IDepartmentCount[];
}

export interface TelemetryStatsResponse {
    success: boolean;
    message?: string;
    stats?: IDashboardStats;
}

export interface VisitResponse {
    success: boolean;
    message?: string;
}

const TelemetryServices = {
    recordVisit: async (path = "/"): Promise<VisitResponse> => {
        const response = await axiosInstance.post<VisitResponse>("/v1/telemetry/visit", { path });
        return response.data;
    },

    getDashboardStats: async (): Promise<TelemetryStatsResponse> => {
        const response = await axiosInstance.get<TelemetryStatsResponse>("/v1/telemetry/stats");
        return response.data;
    }
};

export default TelemetryServices;
