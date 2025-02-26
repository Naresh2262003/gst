import React, { useEffect, useState , useRef} from "react";
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table, Button } from "reactstrap";
import FileUpload from "./../../../components/CustomUpload/FileUpload";
import { useGetFileListByPurposeQuery } from "../../../api/filesApi";
import { config } from "../../../config.js";
import { reverseDate } from "../../../variables/utils.js";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./taxpayment.scss";



// import { config } from "config";
import JWTManager from "../../../utils/JWTManager";

const TaxPayment = () => {
    // const { data: merchant_files } = useGetFileListByPurposeQuery();
    const merchant_file_headers = ["Month", "Credit", "Debit"];


    const [data, setData] = useState("");
    const [alert, setAlert] = useState(null);
    const notificationAlertRef = useRef(null);

    const fetchdashboard = async () => {
        try {

            const token = JWTManager.getToken();
            const response = await fetch(`${config.api_url}/dashboard`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`, // Ensure proper authorization format
                    // "Authorization": `126546834:5`, // Ensure proper authorization format
                },
            });

            console.log(`${config.api_url}/dashboard`);
            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to fetch invoices");
            }

            const json = await response.json();
            setData(json); // Correctly setting the fetched data
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchdashboard();
        console.log("try",data);
    }, []); 

    if(!data){
        return <>loading</>
    }

    return (
        <div className="content admin_files">
            <Row>
                <Col xs="12">
                    <Card>
                        <CardHeader>
                            <h5 className="card-category">Tax Payment</h5>
                        </CardHeader>
                        <CardBody>
                            <div className="upload-sections" style={{display:"block"}}>
                                <Card   style={{width:"38%", backgroundColor:"#f5f5f5", marginBlock:"20px", marginRight:"30px", marginLeft:"10px"}} >
                                    <CardHeader>
                                        <CardTitle tag="h2">Tax Payment</CardTitle>
                                    </CardHeader>
                                    <CardBody  style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"flex-start", marginTop:"40px"}}>
                                        <div className="tax-summary" style={{display:"flex", justifyContent:"space-between" , width:"100%"}}>
                                            <div className="tax-box" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                                <h1>{data.totalCredits}</h1>
                                                <Button color="primary">Credit Available</Button>
                                            </div>
                                            <div className="tax-box" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                                <h1>{data.totalDebits}</h1>
                                                <Button color="primary">Tax Outstanding</Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                
                                <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", width:"100%"}}>
                                    <Link
                                        className="text-right"
                                        color="info"
                                        to={`pay`}
                                        style={{ marginRight:"5%" }}
                                    >
                                        <Button color="danger" >Pay Tax</Button>
                                    </Link>
                                </div>
                            </div>
                            <hr/><br/>
                            <div className="download-sections">
                                <h4>GST details</h4>
                                <Table responsive className="list-table">
                                    <thead className="text-primary">
                                        <tr>
                                            <th className="text-left" > GST </th>
                                            <th className="text-left"> DEBIT </th>    
                                            <th className="text-left"> CREDIT </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="text-left"> CGST </th>
                                            <td className="text-left"> {data.debit.cgst }</td>    
                                            <td className="text-left"> {data.credit.cgst } </td>
                                        </tr>
                                        <tr>
                                            <th className="text-left"> SGST </th>
                                            <td className="text-left"> {data.debit.sgst } </td>    
                                            <td className="text-left"> {data.credit.sgst} </td>
                                        </tr>
                                        <tr>
                                            <th className="text-left"> IGST </th>
                                            <td className="text-left"> {data.debit.igst}</td>    
                                            <td className="text-left"> {data.credit.igst}</td>  
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TaxPayment;
