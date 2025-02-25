import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
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
        getTransactions: build.query({
            query: ({ wallet_id, sponsor_merchant, transaction_reference, issue_date }) => ({
                url: `disbursements`,
                params: { wallet_id, sponsor_merchant, transaction_reference, issue_date }
            }),
            transformResponse: (response) => {
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
    })
});

export const  { useGetTransactionsQuery } = transactionApi;