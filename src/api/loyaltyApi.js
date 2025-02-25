import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const loyaltyApi = createApi({
    reducerPath: "loyaltyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token"); // Assuming you have a token stored in the auth state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        getLoyaltyPrograms: build.query({
            query: ({ merchantID, ruleID, status, createdBefore, createdAfter }) => ({
                url: `loyalty-programs`,
                params: { merchantID, ruleID, status, createdBefore, createdAfter }
            }),
            transformResponse: (response) => {
                console.log("Loyalty Programs API Response", response);
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
    })
});

export const  { useGetLoyaltyProgramsQuery } = loyaltyApi;