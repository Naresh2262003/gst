import React, { useEffect, useState, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table, Input, Button } from "reactstrap";
import "./invoicelist.scss";

import { config } from "config";
import JWTManager from "../../../utils/JWTManager";

import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
// import { useGetInvoicesQuery } from "../../../api/InvoiceApi";
import NotificationAlert from "react-notification-alert";

const MerchantList = () => {
    // const [status, setStatus] = useState(null);
    // const [alert, setAlert] = useState(null);
   
    // const notificationAlertRef = useRef(null);
    // const [queryParams, setQueryParams] = useState({});

    // const [data, setdata]= useState([]);
    // // const { isLoading, data: Invoices, refetch } = useGetInvoicesQuery();
    // // const [approveMerchants] = useApproveMerchantsMutation();
    // const merchantListHeaders = ["Invoice ID", "Invoice No.", "Amount", "CGST", "SGST", "IGST", "Buyer", "Status"];

    // console.log("hi",Invoices);


    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(null);
    const notificationAlertRef = useRef(null);
    const [currentTab, setCurrentTab] = useState(2)

    const merchantListHeaders = ["Invoice ID", "Invoice No.", "Amount", "CGST", "SGST", "IGST", "Buyer", "Status", "Audit"];

    const fetchInvoices = async () => {

        var queryType
        if (currentTab === 1) {
            queryType = "buyer"
        } else {
            queryType = "seller"
        }

        try {
            const token = JWTManager.getToken();
            const response = await fetch(`${config.api_url}/invoices/${queryType}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `${token}`, // Ensure proper authorization format
                    "Authorization": `126546834:5`, // Ensure proper authorization format
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch invoices");
            }

            const json = await response.json();
            setData(json); // Correctly setting the fetched data
            console.log("I am", json);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleAuditClick = (invoiceId) => {
        console.log("Auditing invoice:", invoiceId);
        console.log("oio",invoiceId);



        // Implement your audit logic here
    };

    useEffect(() => {
        fetchInvoices();
    }, [currentTab]); 

    return (
        
        <>
            <div className="content merchant_list">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Col>
                                    <div className="flex-form">
                                        <CardTitle tag="h2">Invoices</CardTitle>
                                        
                                        <Link
                                            className="text-right"
                                            color="info"
                                            to={`new`}
                                            style={{ height: "100px", flexDirection: "column", display: "flex", alignItems: "flex-end"}}
                                        >
                                            <Button
                                                className="btn-simple" color="info"
                                            >Create New Invoice</Button>
                                        </Link>
                                    </div>
                                </Col>
                            </CardHeader>
                            <CardBody>
                            <div className="tab-group">
                                    <Button
                                        color="link"
                                        className={currentTab === 1 ? `active-tab` : ``}
                                        onClick={() => {
                                            setCurrentTab(1);
                                            // updateQueryString("buyer");
                                        }}
                                    >
                                        Buyer View
                                    </Button>
                                    { 
                                        <Button
                                            color="link"
                                            className={currentTab === 2 ? `active-tab` : ``}
                                            onClick={() => {
                                                setCurrentTab(2);
                                                // updateQueryString("seller");
                                            }}
                                        >
                                            Seller View
                                        </Button>
                                    }
                                </div>
                                <Table responsive className="list-table">
                                    <thead className="text-primary">
                                        <tr>
                                            {merchantListHeaders.map((table_header, index) => (
                                                <th key={index} className="text-left">{table_header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {data.length === 0 ? (
                                            <tr>
                                                <td colSpan={merchantListHeaders.length} className="text-center">
                                                    No Records Found
                                                </td>
                                            </tr>
                                        ) : (
                                            // data.map((inv) => (
                                            //     // <tr key={inv.id}>
                                            //     //     <td className="text-left">{inv.id}</td>
                                            //     //     <td className="text-left">{inv.invoiceNumber}</td>
                                            //     //     <td className="text-left">{inv.amount}</td>
                                            //     //     <td className="text-left">{inv.cgst}</td>
                                            //     //     <td className="text-left">{inv.sgst}</td>
                                            //     //     <td className="text-left">{inv.igst}</td>
                                            //     //     <td className="text-left">{inv.buyer}</td>
                                            //     //     <td className="text-left">{inv.status}</td>
                                            //     // </tr>
                                            //     <tr key={inv.id}>
                                            //     {[
                                            //         inv.id,
                                            //         inv.invoice_number,
                                            //         inv.amount,
                                            //         inv.cgst,
                                            //         inv.sgst,
                                            //         inv.igst,
                                            //         inv.buyer,
                                            //         inv.status
                                            //     ].map((value, index) => (
                                            //         <td key={index} className="text-left" style={{ width: "12.5%" }}>
                                            //             {typeof value === "string" && value.length > 15 ? value.slice(0, 12) + "..." : value}
                                            //         </td>
                                            //     ))
                                            //     }
                                            // </tr>
                                            // ))
                                            data.map((inv) => (
                                                <tr key={inv.id}>
                                                    {[inv.id, inv.invoice_number, inv.amount, inv.cgst, inv.sgst, inv.igst, inv.buyer, inv.status].map((value, index) => (
                                                        <td key={index} className="text-left" style={{ width: "12.5%" }}>
                                                            {typeof value === "string" && value.length > 15 ? value.slice(0, 12) + "..." : value}
                                                        </td>
                                                    ))}
                                                    <td className="text-left">
                                                        <Button color="warning" size="sm" onClick={() => handleAuditClick(inv.id)}>
                                                            Audit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
    );
};

export default MerchantList;