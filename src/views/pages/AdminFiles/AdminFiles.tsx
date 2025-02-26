import React, { useEffect, useState } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button } from "reactstrap";
import ReactDatetime from "react-datetime";
import FileUpload from "./../../../components/CustomUpload/FileUpload";
import { useGetMerchantsQuery } from "../../../api/merchantApi";
import {config} from "../../../config.js"
import {reverseDate} from "../../../variables/utils.js"
import "./adminfiles.scss"
import { useGetFileListByPurposeQuery } from "../../../api/filesApi";

const AdminFiles = () => {
    const { isLoading, data: merchant_files, refetch } = useGetFileListByPurposeQuery();
    const merchant_file_headers = ["Created On", "Filename", "Purpose", "Reference ID", "Status","TTUM file","SMS Merchnats", "SMS Customers","Action"];

    const handleDownload = async (fileName: string,purpose: string,referenceID: string) => {
        console.info("Inside Handle download");
        try {
            const response = await fetch(`${config.api_url}/file-download/${purpose}/${referenceID}/`, {
                headers: {
                    'accept': (purpose === "ttum_txs" || purpose === "sms-merchants" || purpose === "sms-customers") ? "application/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
                const date = new Date()
                const paddedMonth = String(date.getMonth() + 1).padStart(2, '0');
                const paddedDay = String(date.getDate()).padStart(2, '0');
            
                if (typeof base64Result === 'string') {
                    var data: string
                    if (purpose === "ttum_txs" || purpose === "sms-merchants" || purpose === "sms-customers") {
                        data = 'data:text/csv;base64,' + base64Result.split(',')[1];
                    } else {
                        data = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + base64Result.split(',')[1];
                    }
                    const downloadLink = window.document.createElement('a');
                    downloadLink.href = data;
                    let name = `${fileName}.csv`
                    if (purpose === "ttum_txs") {
                        name = `ttum-${date.getFullYear()}${paddedMonth}${paddedDay}.txt`
                    } else if (purpose === "sms-merchants") {
                        name = `sms-merchants-${date.getFullYear()}${paddedMonth}${paddedDay}.txt`
                    } else if (purpose === "sms-customers") {
                        name = `sms-customers-${date.getFullYear()}${paddedMonth}${paddedDay}.txt`
                    } else {
                        name = `pcbdc-disb${date.getFullYear()}${paddedMonth}${paddedDay}.xlsx`
                    }
                    downloadLink.download = name;
                    downloadLink.textContent = 'Download CSV';
            
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
            <div className="content admin_files">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                {/* <h5 className="card-category">File Uploads | Downloads</h5> */}
                                <CardTitle tag="h3">
                                    {/*3,500€*/}
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="upload-sections">
                                    <FileUpload file_copy="Validation Rules" purpose="loyalty_programs"/>
                                    <FileUpload file_copy="CBDC Transactions" purpose="cbdc_txs"/>
                                </div>
                                <br/>
                                <hr/>
                                <br/>
                                <div className="download-sections">
                                    <h4>
                                        Merchant Account Debit
                                    </h4>
                                    <Table responsive className="list-table">
                                        <thead className="text-primary">
                                        <tr>
                                            {
                                                merchant_file_headers && merchant_file_headers.length > 0 &&
                                                merchant_file_headers.map((table_header, index) => (
                                                    <th key={index} className="text-left">{table_header}</th>))
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            (!merchant_files || merchant_files.length === 0) && (
                                                <tr>
                                                    <td colSpan={7} className="text-center">No Records Found</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            merchant_files &&
                                            merchant_files.length > 0 &&
                                            merchant_files.map((merchant_file, index) => (
                                                <tr key={index}>
                                                    <td className="text-left">
                                                        {reverseDate(merchant_file.created_on)}
                                                    </td>
                                                    <td className="text-left">
                                                        {merchant_file.file_name}
                                                    </td>
                                                    <td className="text-left">
                                                        {merchant_file.purpose}
                                                    </td>
                                                    <td className="text-left">
                                                        {merchant_file.reference_id}
                                                    </td>
                                                    <td className="text-left">
                                                        {merchant_file.status}
                                                    </td>
                                                    <td className="text-left">
                                                    <Button
                                                        color="primary"
                                                        className="btn-link"
                                                        style={{padding:"0"}}
                                                        onClick={() => handleDownload(merchant_file.file_name,"ttum_txs", merchant_file.reference_id)}
                                                    >
                                                        TTUM
                                                    </Button>
                                                    </td>
                                                    <td className="text-center">
                                                    <Button
                                                        color="primary"
                                                        className="btn-link"
                                                        style={{padding:"0"}}
                                                        onClick={() => handleDownload(merchant_file.file_name,"sms-merchants", merchant_file.reference_id)}
                                                    >
                                                        Download
                                                    </Button>
                                                    </td>
                                                    <td className="text-center">
                                                    <Button
                                                        color="primary"
                                                        className="btn-link"
                                                        style={{padding:"0"}}
                                                        onClick={() => handleDownload(merchant_file.file_name,"sms-customers", merchant_file.reference_id)}
                                                    >
                                                        Download
                                                    </Button>
                                                    </td>
                                                    <td className="text-left">
                                                    <Button
                                                        color="primary"
                                                        className="btn-link"
                                                        style={{padding:"0"}}
                                                        onClick={() => handleDownload(merchant_file.file_name,merchant_file.purpose, merchant_file.reference_id)}
                                                    >
                                                        Download
                                                    </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default AdminFiles;