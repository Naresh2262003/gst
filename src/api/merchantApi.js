import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const merchantApi = createApi({
    reducerPath: "merchantApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token"); // Assuming you have a token stored in the auth state
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        getMerchants: build.query({
            query:({ }) => ({
                url: `invoices`
            }),
            transformResponse: (response) => {
                console.log("Invoices?")
                console.log("Merchant API Response: ", response);
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
        approveMerchants: build.mutation({
            query: (merchant_ids) => ({
                url: 'merchants/approve',
                method: 'POST',
                body: { 
                    merchant_ids: Array.isArray(merchant_ids) ? merchant_ids : [merchant_ids]
                }
            }),
            transformResponse: (response) => {
                console.log('Approve response:', response)
                if (response.success === true) {
                    return response;
                }
                if (response.data && response.status) {
                    return response.data;
                }
                return response;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || "An unexpected error occurred";
            },
            invalidatesTags: ['Merchants']
        })
    })
});

export const { useGetMerchantsQuery, useApproveMerchantsMutation } = merchantApi;