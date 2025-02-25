import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const invoiceApi = createApi({
    reducerPath: "invoiceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token"); 
            headers.set('Authorization', `${token}`);
            return headers;
        },
    }),
    endpoints: (build) => ({
        getInvoices: build.query({
            query:() => ({
                url: `invoices`
            }),
            transformResponse: (response) => {
                console.log("Invoices?")
                console.log("Merchant API Response: ", response);
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
        approveInvoices: build.mutation({
            query: (invoice_ids) => ({
                url: 'invoices/approve',
                method: 'POST',
                body: { 
                    invoice_ids: Array.isArray(invoice_ids) ? invoice_ids : [invoice_ids]
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

export const { useGetInvoicesQuery, useApproveInvoicesMutation } = invoiceApi;