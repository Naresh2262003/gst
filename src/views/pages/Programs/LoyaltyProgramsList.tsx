import React, { useEffect, useState } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input } from "reactstrap";
import "./loyaltyprogramslist.scss";
import ReactDatetime from "react-datetime";

import { useGetLoyaltyProgramsQuery } from "../../../api/loyaltyApi.js";
import Select from "react-select";

interface Filters {
    merchantID: string;
    ruleID: string;
    status: string;
    createdBefore: string,
    createdAfter: string
}

const LoyaltyProgramsList = () => {

    const [status, setStatus] = React.useState(null);
    const [filters, setFilters] = useState<Filters>({
        merchantID: "",
        ruleID: "",
        status: "",
        createdBefore: "",
        createdAfter: ""
    });

    const [queryParams, setQueryParams] = useState<Record<string, string>>({});

    const { isLoading, data: loyalty_programs, refetch } = useGetLoyaltyProgramsQuery(queryParams);
    const loyaltyProgramsListHeaders = ["Program ID", "Merchant ID", "Merchant Name", "Wallet ID", "Rule ID", "Rewards %", "Campaign Start", "Campaign End", "Expiry", "Total P-CBDC Amount", "Customer Count", "Status"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleSelectChange = (selectedOption) => {
        const { name, value } = selectedOption;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    useEffect(() => {
        // Any side effects or logic when filters change can go here
        let params: Record<string, string> = {};
        if (filters.merchantID) params.merchantID = filters.merchantID;
        if (filters.ruleID) params.ruleID = filters.ruleID;
        if (filters.status) params.status = filters.status;
        if (filters.createdBefore) params.createdBefore = filters.createdBefore;
        if (filters.createdAfter) params.createdAfter = filters.createdAfter;

        setQueryParams(params);
    }, [filters]);

    return (
        <>
            <div className="content loyalty_programs_list">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Loyalty Programs</h5>
                                <CardTitle tag="h3">
                                    {/* ₹ 3,500 */}
                                </CardTitle>
                                <CardBody>
                                    <Row>
                                        <div className="flex-25">
                                            <Input
                                                type="text"
                                                name="merchantID"
                                                placeholder="Merchant ID"
                                                value={ filters.merchantID }
                                                onChange={ handleInputChange }
                                            />
                                            <Input
                                                type="text"
                                                name="ruleID"
                                                placeholder="Rule ID"
                                                value={filters.ruleID}
                                                onChange={ handleInputChange }
                                            />
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                name="status"
                                                value={ status }
                                                onChange={(selectedValue: any) => {
                                                    setStatus(selectedValue);
                                                    handleSelectChange({ name: 'status', value: selectedValue.value })}
                                                }
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "All",
                                                    },
                                                    { value: "loyalty_program_active", label: "Active" },
                                                    { value: "loyalty_program_suspended", label: "Suspended" },
                                                    { value: "loyalty_program_deactivated", label: "Deleted" },
                                                ]}
                                                placeholder="Select Status"
                                            />
                                            <ReactDatetime
                                                inputProps={{
                                                    name:"createdAfter",
                                                    className: "form-control",
                                                    placeholder: "Active Date From",
                                                }}
                                                onChange={(e: any) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFilters(prevFilters => ({
                                                            ...prevFilters,
                                                            createdAfter: e.format('YYYY-MM-DD')
                                                        }));
                                                    }
                                                }}
                                                dateFormat={"DD-MM-YYYY"}
                                                timeFormat={false}
                                            />
                                            <ReactDatetime
                                                inputProps={{
                                                    name: "createdBefore",
                                                    className: "form-control",
                                                    placeholder: "Active Date To",
                                                }}
                                                onChange={(e: any) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFilters(prevFilters => ({
                                                            ...prevFilters,
                                                            createdBefore: e.format('YYYY-MM-DD')
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
                                            loyaltyProgramsListHeaders && loyaltyProgramsListHeaders.length > 0 &&
                                            loyaltyProgramsListHeaders.map((header, index) => (
                                                <th key={index} className="text-left">{header}</th>))
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (!loyalty_programs || loyalty_programs.length === 0) && (
                                            <tr>
                                                <td colSpan={12} className="text-center">No Records Found</td>
                                            </tr>
                                        )
                                    }
                                    {
                                        loyalty_programs &&
                                        loyalty_programs.length > 0 &&
                                        loyalty_programs.map((program, index) => (<tr key={program.program_id}>
                                            <td className="text-left">
                                                {program.program_id}
                                            </td>
                                            <td className="text-left">
                                                {program.merchant_id}
                                            </td>
                                            <td className="text-left">
                                                {program.merchant_name}
                                            </td>
                                            <td className="text-left">
                                                {program.wallet_id}
                                            </td>
                                            <td className="text-left">
                                                {program.rule_id}
                                            </td>
                                            <td className="text-left">
                                                { parseFloat(program.reward_percentage)*100 }%
                                            </td>
                                            <td className="text-left">
                                                {program.campaign_start_date}
                                            </td>
                                            <td className="text-left">
                                                {program.campaign_end_date}
                                            </td>
                                            <td className="text-left">
                                                {program.expiry}
                                            </td>
                                            <td className="text-left">
                                                {program.total_pcbdc_amount}
                                            </td>
                                            <td className="text-left">
                                                {program.customer_count}
                                            </td>
                                            <td className="text-left">
                                                {program.status}
                                            </td>
                                        </tr>))
                                    }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default LoyaltyProgramsList;
