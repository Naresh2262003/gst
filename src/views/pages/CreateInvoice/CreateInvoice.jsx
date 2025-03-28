
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    FormGroup,
    Input,
    Row,
    Col,
    Form,
    Button,
} from "reactstrap";
import Select from "react-select";
import JWTManager from "../../../utils/JWTManager";
import "./createinvoice.scss";
import { string } from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";

import Datetime from "react-datetime";

import { config } from "config";

const CreateInvoice = () => {
    const [formState, setFormState] = useState({
        invoice_number: "",
        amount: "",
        buyer: "",
        cgst: "",
        sgst: "",
        igst: "",
        total_amount: "",
        invoice_date: "",
    });


    
        const [alert, setAlert] = useState(null);

    const { id } = useParams();

    const [amount, setAmount] = useState("")
    const [gstValue, setGstValue] = useState("")
    const [buyerState, setBuyer] = useState("")

    const gstOptions = [
        { label: "GST 0%", value: "0%" },
        { label: "GST 5%", value: "5%" },
        { label: "GST 12%", value: "12%" },
        { label: "GST 18%", value: "18%" },
        { label: "GST 22%", value: "22%" }
    ];

    
    
      const navigate = useNavigate(); 

    useEffect(() => {
        let amt = parseInt(amount);
        let per = parseInt(gstValue);

        console.log(JWTManager.getToken().slice(0, 2));
        console.log(buyerState.slice(0, 2));

        let igstV, cgstV, sgstV

        if (JWTManager.getToken().slice(0, 2) !== buyerState.slice(0, 2)) {
            igstV = (per / 100) * amt
            setFormState(prevState => ({ ...prevState, igst: igstV, cgst: 0, sgst: 0 }));
        } else {
            cgstV = (per / 200) * amt
            sgstV = (per / 200) * amt
            setFormState(prevState => ({ ...prevState, igst: 0, cgst: cgstV, sgst: sgstV }));
        }

        console.log((amt + parseInt(formState.igst) + parseInt(formState.cgst) + parseInt(formState.sgst)).toString());

        setFormState((prev) =>({
            ...prev,
            amount: amount,
            buyer: buyerState,
            total_amount: (amt + igstV + sgstV + cgstV).toString()
        }))
    }, [amount, gstValue, buyerState])
    

    const calculateTaxes = (newFormState) => {
        const gstValue = parseFloat(newFormState.gst) || 0;
        const invoiceAmount = parseFloat(newFormState.amount) || 0;

        console.log(JWTManager.getToken().slice(0, 2));
        console.log(newFormState.buyer.slice(0, 2));

        if (JWTManager.getToken().slice(0, 2) !== newFormState.buyer.slice(0, 2)) {
            setFormState(prevState => ({ ...prevState, igst: (gstValue / 100) * invoiceAmount, cgst: 0, sgst: 0 }));
        } else {
            setFormState(prevState => ({ ...prevState, igst: 0, cgst: (gstValue / 200) * invoiceAmount, sgst: (gstValue / 200) * invoiceAmount }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => {
            const newFormState = { ...prevState, [name]: value };
            calculateTaxes(newFormState);
            return newFormState;
        });
    };

    const handleGstPercentInputChange = (e) => {
        
    }

    const handleSubmit = async (e) => {
        // JWTManager.getToken();
        e.preventDefault();
        console.log("Submitting Invoice:", formState);

        try {
            const response = await fetch(`${config.api_url}/invoices/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${JWTManager.getToken()}`
                },
                body: JSON.stringify({
                        "invoice_number": formState.invoice_number,
                        "buyer": formState.buyer,
                        "amount": formState.amount,
                        "cgst": `${formState.cgst}`,
                        "sgst": `${formState.sgst}`,
                        "igst": `${formState.igst}`,
                        "total_amount": "1100",
                        // "invoice_date": formState.invoice_date,
                })
            });

            console.log("url",`${config.api_url}/invoices/create`);

            console.log(response);

            if (!response.ok) {
                throw new Error("Failed to create invoice");
            }

            const json = await response.json();

            console.log(json);
            console.log("Invoice Created:", json);

            setAlert(
                <SweetAlert
                    success
                    title="Invoice Created!"
                    onConfirm={() => setAlert(null)}
                >
                    Invoice created successfully.
                </SweetAlert>
            );

            navigate("/admin/invoice");
        } catch (error) {
            console.error("Error creating invoice:", error);
            setAlert(
                <SweetAlert
                    danger
                    title="Invoice Not Created!"
                    onConfirm={() => setAlert(null)}
                >
                    Invoice creation failed.
                </SweetAlert>
            );
        }
    };

    return (
    <>
        {alert}
        <div className="create-organization content">
            <Row>
                <Col lg="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4">Invoice Creation</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <h4>Create a New Invoice</h4>
                            <Form onSubmit={handleSubmit}>
                                <div className="form-row-50">
                                    <div>
                                        <label>Enter Buyer GSTIN:</label>
                                        <FormGroup>
                                            <Input type="text" name="buyer" onChange={(e) => setBuyer(e.target.value)} />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <label>Invoice Number</label>
                                        <FormGroup>
                                            <Input type="text" name="invoice_number" value={formState.invoice_number} onChange={handleInputChange} />
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="form-row-50">
                                    <div>
                                        <label>Invoice Amount</label>
                                        <FormGroup>
                                            <Input type="text" name="amount" onChange={(e) => setAmount(e.target.value)} />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        {/* <label>Choose GST:</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                placeholder="Choose GST"
                                                value={gstOptions.find(option => option.value === formState.gst) || null}
                                                onChange={(selectedOption) => {
                                                    setFormState(prevState => {
                                                        const newFormState = { ...prevState, gst: selectedOption.value };
                                                        calculateTaxes(newFormState);
                                                        return newFormState;
                                                    });
                                                }}
                                                options={gstOptions}
                                            />
                                        </FormGroup> */}
                                        <label>Choose GST:</label>
                                        <FormGroup>
                                            <Select
                                                className="react-select info"
                                                classNamePrefix="react-select"
                                                placeholder="Choose GST"
                                                // value={gstOptions.find(option => option.value === formState.gst) || null}
                                                onChange={(e) => setGstValue(e.value)}
                                                options={gstOptions}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="form-row-33">
                                    <div>
                                        <label>IGST:</label>
                                        <FormGroup>
                                            <Input type="text" value={isNaN(formState.igst) ? 0 : formState.igst} disabled />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <label>CGST:</label>
                                        <FormGroup>
                                            <Input type="text" value={isNaN(formState.cgst) ? 0 : formState.cgst} disabled />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <label>SGST:</label>
                                        <FormGroup>
                                            <Input type="text" value={isNaN(formState.sgst) ? 0 : formState.sgst} disabled />
                                        </FormGroup>
                                    </div>
                                </div>
                                
                                <div className="form-row-50">
                                <div>
                                    <label>Total Amount (Incl. GST):</label>
                                    <FormGroup>
                                        <Input type="text" value={parseFloat(formState.amount) + formState.igst + formState.cgst + formState.sgst || 0} disabled />
                                    </FormGroup>
                                </div>
                                <div>
                                    <label>Invoice Date:</label>
                                    <FormGroup>
                                            <Datetime
                                                timeFormat={false}
                                                inputProps={{ placeholder: "Choose Invoice Date"}}
                                                closeOnSelect={true}
                                                value={new Date(formState.invoice_date)}
                                                dateFormat={"DD-MM-YYYY"}
                                                onChange={(e) => {
                                                    if (e && e.format) {
                                                        console.log("Date Changed", e.format('YYYY-MM-DD'));
                                                        setFormState((prevState) => ({
                                                            ...prevState,
                                                            invoice_date: e.format('YYYY-MM-DD')
                                                        }));
                                                    }
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                                
                                {/* <Button color="primary" type="submit" style={{ marginTop: "20px" }} onClick={handleSubmit}>Submit</Button> */}
                                <Button
                                    color="primary"
                                    onClick={(e) => handleSubmit(e)}
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    Submit
                                </Button>

                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
        </>
    );
}

export default CreateInvoice;
