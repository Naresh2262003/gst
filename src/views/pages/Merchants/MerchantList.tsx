import React, { useEffect, useState, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button } from "reactstrap";
import "./merchantlist.scss";
import ReactDatetime from "react-datetime";
import {reverseDate} from "../../../variables/utils.js"
import { useGetMerchantsQuery, useApproveMerchantsMutation } from "../../../api/merchantApi";
import Select from "react-select";
import NotificationAlert from "react-notification-alert";

interface Filters {
    merchantID: string;
    status: string;
    registeredBefore: string,
    registeredAfter: string
}

const MerchantList = () => {

    const [status, setStatus] = React.useState(null);
    const [alert, setAlert] = React.useState(null);
    const [filters, setFilters] = useState<Filters>({
        merchantID: "",
        status: "",
        registeredBefore: "",
        registeredAfter: ""
    });
    const notificationAlertRef = useRef(null);

    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const { isLoading, data: merchants, refetch } = useGetMerchantsQuery(queryParams);
    const [approveMerchants] = useApproveMerchantsMutation();
    const merchantListHeaders = ["Merchant ID", "Merchant Account No.", "Merchant Name", "Registration Date", "Status"];

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
        if (filters.status) params.status = filters.status;
        if (filters.registeredBefore) params.registeredBefore = filters.registeredBefore;
        if (filters.registeredAfter) params.registeredAfter = filters.registeredAfter;

        setQueryParams(params);
    }, [filters]);

    const notify = (place, msg) => {
        var type = "danger";
        var options = {
            place: place,
            message: (
                <div>
                    <div>
                        <b>{msg}</b>
                    </div>
                </div>
            ),
            type: type,
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7,
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const handleApprove = async (merchantId: string) => {
        try {
            const result = await approveMerchants([merchantId]).unwrap();
            refetch();
            successAlert();
        } catch (error: any) {
            console.error('Error approving merchant:', error);
            notify("tr", `Error Code: ${error.status}, ${error.data.message}` || "Failed to approve merchant. Please try again later.");
        }
    };

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title={`Merchant Approved`}
                onConfirm={hideAlert}
                onCancel={hideAlert}
                confirmBtnBsStyle="info"
            />
        );
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <>
            <div className="content merchant_list">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Merchant List</h5>
                                <CardTitle tag="h3">
                                    {/*3,500€*/}
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
                                                    { value: "org_active", label: "Active" },
                                                    { value: "org_suspended", label: "Suspended" },
                                                    { value: "org_deleted", label: "Deleted" },
                                                ]}
                                                placeholder="Select Status"
                                            />
                                            <ReactDatetime
                                                inputProps={{
                                                    name: "registeredAfter",
                                                    className: "form-control",
                                                    placeholder: "Active Date From",
                                                }}
                                                onChange={(e: any) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFilters(prevFilters => ({
                                                            ...prevFilters,
                                                            registeredAfter: e.format('YYYY-MM-DD')
                                                        }));
                                                    }
                                                }}
                                                dateFormat={"DD-MM-YYYY"}
                                                timeFormat={false}
                                            />
                                            <ReactDatetime
                                                inputProps={{
                                                    name: "registeredBefore",
                                                    className: "form-control",
                                                    placeholder: "Active Date To",
                                                }}
                                                onChange={(e: any) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFilters(prevFilters => ({
                                                            ...prevFilters,
                                                            registeredBefore: e.format('YYYY-MM-DD')
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
                                            merchantListHeaders && merchantListHeaders.length > 0 &&
                                            merchantListHeaders.map((table_header, index) => (
                                                <th key={index} className="text-left">{table_header}</th>))
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (!merchants || merchants.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="text-center">No Records Found</td>
                                            </tr>
                                        )
                                    }
                                    {
                                        merchants &&
                                        merchants.length > 0 &&
                                        merchants.map((merchant, index) => (<tr key={merchant.internal_id}>
                                                <td className="text-left">{merchant.merchant_id}</td>
                                                <td className="text-left">{merchant.account_number}</td>
                                                <td className="text-left">{merchant.name}</td>
                                                <td className="text-left">{reverseDate(merchant.registration_date)}</td>
                                                <td className="text-left">
                                                    {merchant.status === 'org_under_bank_approval' ? (
                                                        <Button 
                                                            style={{cursor: 'pointer'}}
                                                            className="btn btn-approve btn-sm" 
                                                            onClick={() => handleApprove(merchant.merchant_id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                    ) : merchant.status === 'org_active' ? 
                                                        'Active' : merchant.status}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {alert}
                <div className="react-notification-alert-container">
                    <NotificationAlert ref={notificationAlertRef} />
                </div>
            </div>
        </>
    )
}

export default MerchantList;