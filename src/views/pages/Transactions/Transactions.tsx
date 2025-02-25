import React, { useEffect, useState } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import "./transactions.scss";
import ReactDatetime from "react-datetime";

import { useGetTransactionsQuery } from "../../../api/transactionApi.js";

interface Filters {
    wallet_id: string;
    sponsor_merchant: string;
    transaction_reference: string;
    issue_date: string,
    // limit: number,
}

const Transactions = () => {

    const [status, setStatus] = React.useState(null);
    const [filters, setFilters] = useState<Filters>({
        wallet_id: "",
        sponsor_merchant: "",
        transaction_reference: "",
        issue_date: "",
        // limit:10
    });

    const [queryParams, setQueryParams] = useState<Record<string, string>>({});

    const { isLoading, data: transactions, refetch } = useGetTransactionsQuery(queryParams);
    const txHeaders = ["Wallet ID", "PCBDC Amount", "Sponsor Merchant", "Transaction Reference", "Issuance Date", "Expiry"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    useEffect(() => {
        // Any side effects or logic when filters change can go here
        let params: Record<string, string> = {};
        if (filters.wallet_id) params.wallet_id = filters.wallet_id;
        if (filters.sponsor_merchant) params.sponsor_merchant = filters.sponsor_merchant;
        if (filters.transaction_reference) params.transaction_reference = filters.transaction_reference;
        if (filters.issue_date) params.issue_date = filters.issue_date;
        // params.limit = String(filters.limit)

        setQueryParams(params);
    }, [filters]);



    // const handlePreviousPage = () => {
    //     // setFilters(prevFilters => ({ ...prevFilters, page: prevFilters.page - 1 }))
    // }

    // const handleNextPage = () => {
    //     console.info("Transactions",transactions)
    //     // setFilters(prevFilters => ({ ...prevFilters, page: prevFilters.page + 1 }))
    // }

    return (
        <>
            <div className="content transaction_list">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Transactions</h5>
                                <CardTitle tag="h3">
                                    {/*3,500€*/}
                                </CardTitle>
                                <CardBody>
                                    <Row>
                                        <div className="flex-25">
                                            <Input
                                                type="text"
                                                name="wallet_id"
                                                placeholder="Wallet ID"
                                                value={ filters.wallet_id }
                                                onChange={ handleInputChange }
                                            />
                                            <Input
                                                type="text"
                                                name="sponsor_merchant"
                                                placeholder="Sponsor Merchant"
                                                value={ filters.sponsor_merchant }
                                                onChange={ handleInputChange }
                                            />
                                            <Input
                                                type="text"
                                                name="transaction_reference"
                                                placeholder="Transaction Reference"
                                                value={ filters.transaction_reference }
                                                onChange={ handleInputChange }
                                            />
                                            <ReactDatetime
                                                inputProps={{
                                                    name: "issue_date",
                                                    className: "form-control",
                                                    placeholder: "Issue Date",
                                                }}
                                                onChange={(e: any) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFilters(prevFilters => ({
                                                            ...prevFilters,
                                                            issue_date: e.format('YYYY-MM-DD')
                                                        }));
                                                    }
                                                }}
                                                dateFormat={"DD-MM-YYYY"}
                                                timeFormat={false}
                                            />
                                        </div>
                                    </Row>
                                </CardBody>
                            </CardHeader>
                            <CardBody>
                                <Table responsive className="list-table">
                                    <thead className="text-primary">
                                    <tr>
                                        {
                                            txHeaders && txHeaders.length > 0 &&
                                            txHeaders.map((table_header, index) => (
                                                <th key={index} className="text-left">{table_header}</th>))
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (!transactions || transactions.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="text-center">No Records Found</td>
                                            </tr>
                                        )
                                    }
                                    {
                                        transactions &&
                                        transactions.length > 0 &&
                                        transactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td className="text-left">
                                                    { transaction.wallet_id }
                                                </td>
                                                <td className="text-left">
                                                    { transaction.pcbdc_amount }
                                                </td>
                                                <td className="text-left">
                                                    { transaction.sponsor_merchant }
                                                </td>
                                                <td className="text-left">
                                                    { transaction.transaction_reference }
                                                </td>
                                                <td className="text-left">
                                                    { transaction.issue_date }
                                                </td>
                                                <td className="text-left">
                                                    { transaction.expiry }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                        {/* <Pagination listClassName="justify-content-center">
                            <PaginationItem>
                                <PaginationLink previous onClick={handlePreviousPage}>Previous</PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled={transactions === undefined || transactions === null || transactions.length < filters.limit}>
                                <PaginationLink previous onClick={handleNextPage}>Next</PaginationLink>
                            </PaginationItem>
                        </Pagination> */}
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Transactions;