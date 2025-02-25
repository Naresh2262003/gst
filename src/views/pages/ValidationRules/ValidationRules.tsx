import React, { useEffect, useState } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button } from "reactstrap";
import "./validationrules.scss";
import ReactDatetime from "react-datetime";
import {useGet} from "../../../api/loyaltyApi";
import {config} from "../../../config.js"
import { useGetRulesQuery } from "../../../api/ruleApi.js";
import Select from "react-select";

interface Filters {
    rule_id: string;
    status: string;
    mcc: string,
    wallet_id: string,
    createdAfter: string,
    createdBefore: string
}

const ValidationRules = () => {

    const [status, setStatus] = React.useState(null);
    const [filters, setFilters] = useState<Filters>({
        rule_id: "",
        status: "",
        mcc: "",
        wallet_id: "",
        createdAfter: "",
        createdBefore: ""
    });

    const [queryParams, setQueryParams] = useState<Record<string, string>>({});

    const { isLoading, data: loyalty_rules, refetch } = useGetRulesQuery(queryParams);
    const validationRuleHeaders = ["Rule Reference ID", "Rule ID", "MCC", "Geography", "Wallet ID", "Expiry", "Status", "Program ID"];

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
        if (filters.rule_id) params.rule_id = filters.rule_id;
        if (filters.status) params.status = filters.status;
        if (filters.mcc) params.mcc = filters.mcc;
        if (filters.wallet_id) params.wallet_id = filters.wallet_id;
        if (filters.createdAfter) params.createdAfter = filters.createdAfter;
        if (filters.createdBefore) params.createdBefore = filters.createdBefore;

        setQueryParams(params);
    }, [filters]);

    const handleDownload = async() => {
        console.info("Inside Handle download");
        try {
            const response = await fetch(`${config.api_url}/loyalty-program-rules?csv=true`, {
                headers: {
                    'accept': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const blob = await response.blob();

            console.info("Response", blob)

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Result = reader.result;
                console.info("Response", base64Result);
            
                if (typeof base64Result === 'string') {
                    const csvData = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + base64Result.split(',')[1];
                    const downloadLink = window.document.createElement('a');
                    downloadLink.href = csvData;
                    downloadLink.download = `Report.xlsx`;
                    downloadLink.textContent = 'Download XLSX';
            
                    const confirmed = window.confirm(`Please allow pop-ups to view the document or click "OK" to download the file`);
                    if (confirmed) {
                        downloadLink.click();
                    }
                    downloadLink.remove();
                } else {
                    console.error("Unexpected result type: ", typeof base64Result);
                }
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="content validation_rules">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Validation Rules</h5>
                                <CardTitle tag="h3">
                                    {/*3,500€*/}
                                </CardTitle>
                                <CardBody>
                                    <Row>
                                        <div className="flex-10">
                                            <Input
                                                type="text"
                                                name="rule_id"
                                                placeholder="Rule ID"
                                                value={ filters.rule_id }
                                                onChange={ handleInputChange }
                                            />
                                            <Input
                                                type="text"
                                                name="mcc"
                                                placeholder="MCC"
                                                value={ filters.mcc }
                                                onChange={ handleInputChange }
                                            />
                                            <Input
                                                type="text"
                                                name="wallet_id"
                                                placeholder="Wallet ID"
                                                value={ filters.wallet_id }
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
                                                    { value: "loyalty_program_rule_active", label: "Active" },
                                                    { value: "loyalty_program_rule_suspended", label: "Suspended" },
                                                    { value: "loyalty_program_rule_deleted", label: "Deleted" },
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
                                            <Button className="btn-simple" color="info" style={{margin:"0"}} onClick={handleDownload}>
                                                Download Report
                                            </Button>
                                        </div>
                                    </Row>
                                </CardBody>
                            </CardHeader>
                            <CardBody>
                                <Table responsive className="list-table">
                                    <thead className="text-primary">
                                    <tr>
                                        {
                                            validationRuleHeaders && validationRuleHeaders.length > 0 &&
                                            validationRuleHeaders.map((table_header, index) => (
                                                <th key={index} className="text-left">{table_header}</th>))
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (!loyalty_rules || loyalty_rules.length === 0) && (
                                            <tr>
                                                <td colSpan={8} className="text-center">No Records Found</td>
                                            </tr>
                                        )
                                    }
                                    {
                                        loyalty_rules &&
                                        loyalty_rules.length > 0 &&
                                        loyalty_rules.map((rule, index) => (<tr key={rule.rule_id}>
                                            <td className="text-left">
                                                { rule.rule_reference_id ? rule.rule_reference_id : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.rule_id ? rule.rule_id : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.mcc ? rule.mcc : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.goegraphy ? rule.goegraphy : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.wallet_id ? rule.wallet_id : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.expiry ? rule.expiry : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.status ? rule.status : "-" }
                                            </td>
                                            <td className="text-left">
                                                { rule.program_id ? rule.program_id : "-" }
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

export default ValidationRules;