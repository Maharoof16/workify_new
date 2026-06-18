import axiosInstance from "@/lib/axios-instance";
import { TOrganizations } from "./organization";

export class organizationService {

    static async GetOrganizations():Promise<TOrganizations> {
        const response = await axiosInstance.get("/organizations");
        return response.data.data;
    }

}