import axiosInstance from "../axiosInstance";

export interface IMasterDataOption {
    _id: string;
    category: "department" | "section" | "batch" | "year" | "domain" | "techstack" | "programming_language";
    value: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MasterDataResponse {
    success: boolean;
    message?: string;
    data?: IMasterDataOption[];
    option?: IMasterDataOption;
}

const MasterDataServices = {
    getMasterData: async (): Promise<MasterDataResponse> => {
        const response = await axiosInstance.get<MasterDataResponse>("/v1/master-data");
        return response.data;
    },

    addMasterData: async (category: string, value: string): Promise<MasterDataResponse> => {
        const response = await axiosInstance.post<MasterDataResponse>("/v1/master-data", { category, value });
        return response.data;
    },

    deleteMasterData: async (id: string): Promise<MasterDataResponse> => {
        const response = await axiosInstance.delete<MasterDataResponse>(`/v1/master-data/${id}`);
        return response.data;
    }
};

export default MasterDataServices;
