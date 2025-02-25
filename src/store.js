import { configureStore } from "@reduxjs/toolkit";
import { merchantApi } from "./api/merchantApi";
import { loyaltyApi } from "./api/loyaltyApi";
import { transactionApi } from "./api/transactionApi";
import { ruleApi } from "./api/ruleApi";
import { filesApi } from "./api/filesApi";
import { invoiceApi } from "./api/InvoiceApi";

const store = configureStore({
    reducer: {
        [merchantApi.reducerPath]: merchantApi.reducer,
        [loyaltyApi.reducerPath]: loyaltyApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [ruleApi.reducerPath]: ruleApi.reducer,
        [filesApi.reducerPath]: filesApi.reducer,
        [invoiceApi.reducerPath] : invoiceApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                merchantApi.middleware,
                loyaltyApi.middleware,
                transactionApi.middleware,
                ruleApi.middleware,
                filesApi.middleware,
                invoiceApi.middleware
            )
});

export default store;