import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const filesApi = createApi({
    reducerPath: "filesApi",
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
        getFile: build.query({
            query: ({ purpose, referenceID }) => ({ url: `file-download/${purpose}/${referenceID}`}),
            transformResponse: (response) => {
                console.log("File API Response: ", response);
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
        getFileListByPurpose: build.query({
            query: () => ({ url: `files/disbursement_txs`}),
            transformResponse: (response) => {
                console.log("FilesList Purpose API Response: ", response);
                return response && response.data && response.data.length > 0 ? response.data : [];
            },
        }),
    })
});

export const  { useGetFileQuery, useGetFileListByPurposeQuery } = filesApi;