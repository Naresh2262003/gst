// import React, { useState, useEffect, useRef } from "react";
// import { Navigate, useParams } from "react-router-dom";
// import "./Paytax.scss";

// import FileUpload from "./../../../components/CustomUpload/FileUpload";


// import { config } from "config";
// import JWTManager from "../../../utils/JWTManager";

// import {
//     Card,
//     CardHeader,
//     CardBody,
//     CardTitle,
//     FormGroup,
//     Input,
//     Row,
//     Col,
//     UncontrolledTooltip, Form, Button
// } from "reactstrap";


// import Select from "react-select";
// import Datetime from "react-datetime";


// const CreateInvoice = () => {

//     const [formState, setFormState] = useState({
//         invoice_number: "",
//         invoice_amount: "",
//         buyer: "",
//         gst: "",
//     });

    
//     let { id } = useParams();

//     const [data, setData] = useState("");
//     const [alert, setAlert] = useState(null);
//     const notificationAlertRef = useRef(null);

//     const fetchdashboard = async () => {
//         try {

//             const token = JWTManager.getToken();
//             const response = await fetch(`${config.api_url}/pay-tax-view`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     // "Authorization": `${token}`, // Ensure proper authorization format
//                     "Authorization": `126546834:5`, // Ensure proper authorization format
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch invoices");
//             }

//             const json = await response.json();
//             setData(json); // Correctly setting the fetched data
//         } catch (error) {
//             console.error("Error fetching invoices:", error);
//         }
//     };

//     useEffect(() => {
//         fetchdashboard();
//         console.log("dta", data);
//     }, []); 

//     if(!data){
//         return <>loading</>
//     }

//     console.log("id", id);

//     const handlePayTaxSubmit = async() => {
//         // e.preventDefault();
//         console.log("Submitting PayTax:");

//         try {
//             const response = await fetch("/pay-tax", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `126546834:5`
//                 },
//                 body: JSON.stringify({})
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to create invoice");
//             }

//             const json = await response.json();
//             console.log("Invoice Created:", json);
//         } catch (error) {
//             console.error("Error creating invoice:", error);
//         }
//     }

//     const total =  Number(data.remainingDebit.cgst)  + Number(data.remainingDebit.sgst) + Number(data.remainingDebit.igst);

//     return (
//         <>
//             <div className="create-organization content">

//                 <Row>
//                     <Col lg="12">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle tag="h4">Audit Invoice</CardTitle>
//                             </CardHeader>
//                             <CardBody>
//                                 <Form action="#">

//                                     <div className="form-row-33">
//                                         <div >
//                                             <label> CGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalDebit.cgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> SGST </label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalDebit.sgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> IGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalDebit.igst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                     </div>

//                                     <div className="form-row-33">
//                                         <div >
//                                             <label> Credit CGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalCredit.cgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> Credit SGST </label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalCredit.sgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> Credit IGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.totalCredit.igst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                     </div>

//                                     <div className="form-row-33">
//                                         <div >
//                                             <label> Reduced CGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.remainingDebit.cgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> Reduced SGST </label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.remainingDebit.sgst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                         <div >
//                                             <label> Reduced IGST</label>
//                                             <FormGroup>
//                                                 <Input
//                                                     type="text"
//                                                     name="program_name"
//                                                     value={data.remainingDebit.igst}
//                                                     disabled
//                                                 />
//                                             </FormGroup>
//                                         </div>
//                                     </div>

//                                     <div >
//                                         <label> Final Amount To Be Paid</label>
//                                         <FormGroup>
//                                             <Input
//                                                 type="text"
//                                                 name="program_name"
//                                                 disabled
//                                                 value={total}
//                                             />
//                                         </FormGroup>
//                                     </div>
                                    
//                                     <div style={{ marginTop: "20px" }}>
//                                     <Button onClick={handlePayTaxSubmit} color="danger">Pay Tax {total <= 0 ? "" : `₹${total}`}</Button>
//                                     </div>
//                                 </Form>

//                             </CardBody>
//                         </Card>
//                     </Col>

//                 </Row>
//             </div>
//         </>
//     );
// }

// export default CreateInvoice;



// code:
import React, { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import "./Paytax.scss";
import SweetAlert from "react-bootstrap-sweetalert";
import FileUpload from "./../../../components/CustomUpload/FileUpload";
import { config } from "config";
import JWTManager from "../../../utils/JWTManager";
import {
    Card, CardHeader, CardBody, CardTitle, FormGroup, Input, Row, Col, Form, Button
} from "reactstrap";
import Select from "react-select";
import Datetime from "react-datetime";

const CreateInvoice = () => {
    const [data, setData] = useState("");
    const [alert, setAlert] = useState(null);
    let { id } = useParams();

    const fetchdashboard = async () => {
        try {
            const response = await fetch(`${config.api_url}/pay-tax-view`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `126546834:5`, // Ensure proper authorization format
                },
            });

            if (!response.ok) throw new Error("Failed to fetch invoices");

            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    useEffect(() => {
        fetchdashboard();
    }, []);

    if (!data) return <>Loading...</>;

    const handlePayTaxSubmit = async () => {
        try {
            const response = await fetch("/pay-tax", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `126546834:5`
                },
                body: JSON.stringify({})
            });

            if (!response.ok) throw new Error("Failed to process payment");

            const json = await response.json();
            console.log("Payment Successful:", json);

            setAlert(
                <SweetAlert
                    success
                    title="Payment Successful!"
                    onConfirm={() => setAlert(null)}
                >
                    Your payment has been successfully processed.
                </SweetAlert>
            );
        } catch (error) {
            console.error("Error processing payment:", error);
            setAlert(
                <SweetAlert
                    danger
                    title="Payment Failed"
                    onConfirm={() => setAlert(null)}
                >
                    Something went wrong. Please try again.
                </SweetAlert>
            );
        }
    };

    const total = Number(data.remainingDebit.cgst) + Number(data.remainingDebit.sgst) + Number(data.remainingDebit.igst);

    return (
        <>
            {alert}
            <div className="create-organization content">
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Audit Invoice</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="form-row-33">
                                        <div>
                                            <label> CGST</label>
                                            <FormGroup>
                                                <Input type="text" value={data.totalDebit.cgst} disabled />
                                            </FormGroup>
                                        </div>
                                        <div>
                                            <label> SGST </label>
                                            <FormGroup>
                                                <Input type="text" value={data.totalDebit.sgst} disabled />
                                            </FormGroup>
                                        </div>
                                        <div>
                                            <label> IGST</label>
                                            <FormGroup>
                                                <Input type="text" value={data.totalDebit.igst} disabled />
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <div>
                                        <label> Final Amount To Be Paid</label>
                                        <FormGroup>
                                            <Input type="text" disabled value={total} />
                                        </FormGroup>
                                    </div>

                                    <div style={{ marginTop: "20px" }}>
                                        <Button onClick={handlePayTaxSubmit} color="danger">
                                            Pay Tax {total <= 0 ? "" : `₹${total}`}
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default CreateInvoice;
