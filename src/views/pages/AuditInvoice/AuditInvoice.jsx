import React, { useEffect, useState, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table, Input, Button } from "reactstrap";
import "./auditinvoice.scss";


import { config } from "config";
import JWTManager from "../../../utils/JWTManager";


import { Link, useLocation, useNavigate, Navigater, useParams } from "react-router-dom";
import ReactDatetime from "react-datetime";
import { reverseDate } from "../../../variables/utils.js";
import Select from "react-select";
import NotificationAlert from "react-notification-alert";

const MerchantList = () => {
    // const merchantListHeaders = ["Previous Invoices Token IDs", "Current Invoice ID", "Next Invoices Token IDs"];
    const merchantListHeaders = ["credit consumed" , "credit generated"  , "credit forwarded"];

    let { id } = useParams();

    const [data, setData] = useState("");
    const [alert, setAlert] = useState(null);
    const notificationAlertRef = useRef(null);

    const fetchdashboard = async () => {
        try {

            const token = JWTManager.getToken();
            const response = await fetch(`${config.api_url}/audit/${id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `${token}`,
                },
            });

            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to fetch invoices");
            }

            const json = await response.json();
            setData(json); // Correctly setting the fetched data
            console.log("hi", json)
            
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchdashboard();
        console.log("dta", data);
    }, []); 

    if(!data){
        return <>loading</>
    }

    console.log("data",data);

    const next = data ? data.audit.filter(item => item.audit_type === 'TYPE_OUT'):[];
    const prev = data ? data.audit.filter(item => item.audit_type === 'TYPE_IN'):[];

    console.log(next, prev);

    const columns = [
        prev ? prev.map(item => item.token_id):[],
        [id],
        next ? next.map(item => item.token_id):[]
    ];

    // const columns = [
    //     prev ? prev.map(item => item.token_id):[],
    //     ...[id, ...(next ? next.map(item => item.token_id) : [])],

    //     next ? next.map(item => item.token_id):[]
    // ];

    console.log("I am ", columns);
    
    const maxRows = Math.max(...columns.map(col => col.length));

    return (
        <>
            <div className="content merchant_list">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Col>
                                    <div className="flex-form" style={{ marginBlock:"20px" }}>
                                        <CardTitle tag="h2">Audit Invoice</CardTitle>
                                    </div>
                                </Col>
                            </CardHeader>
                            <CardBody>
                                <Table responsive className="list-table">
                                    <thead className="text-primary" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1) " }}>
                                        <tr>
                                            {merchantListHeaders.map((table_header, index) => (
                                                <th key={index}  className="text-center" >{table_header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {Array.from({ length: maxRows }).map((_, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {columns.map((col, colIndex) => (
                                                    <td key={colIndex} className="text-center" style={{ fontWeight: "500", borderBottom: "none" }}>
                                                    <Link
                                                        className="text-right"
                                                        to={`/admin/audit/${col[rowIndex] && col[rowIndex].charAt(1) !== 'n' ? col[rowIndex].slice(5) : id}`}
                                                        style={{ color: "rgba(34, 42, 66, 0.7)" }}
                                                    >
                                                        {/* {col[rowIndex] || ""} */}
                                                        {/* <Card>
                                                          <CardBody className="text-center py-5">
                                                            <code>{col[rowIndex] || ""}</code>
                                                          </CardBody>
                                                        </Card> */}
                                                        <Card className="card-chart">
                                                            <CardHeader>
                                                                {col[rowIndex] && <Row>
                                                                    <Col className="text-left" >
                                                                        <h5 className="card-category">Invoice Id</h5>
                                                                    </Col>
                                                                </Row>}
                                                                <Row>
                                                                    <Col className="text-center" >
                                                                        <CardTitle tag="h6">{col[rowIndex] || ""}</CardTitle>
                                                                    </Col>
                                                                </Row>
                                                            </CardHeader>
                                                            <Col className="text-left" >
                                                                <h5 className="card-category">Token Id</h5>
                                                            </Col>
                                                            <CardBody>

                                                            </CardBody>
                                                        </Card>
                                                    </Link>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {alert}
            </div>
        </>
    );
};

export default MerchantList;