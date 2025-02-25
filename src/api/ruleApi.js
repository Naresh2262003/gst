import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const ruleApi = createApi({
    reducerPath: "ruleApi",
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
        getRules: build.query({
            query: ({ rule_id, status, mcc, wallet_id, createdAfter, createdBefore }) => ({
                url: `loyalty-program-rules`,
                params: { rule_id, status, mcc, wallet_id, createdAfter, createdBefore }
            }),
            transformResponse: (response) => {
                console.log("Loyalty Programs API Response", response);
                return (response && response.data && response.data.length > 0) ? response.data : [];
            },
        }),
    })
});

export const  { useGetRulesQuery } = ruleApi;