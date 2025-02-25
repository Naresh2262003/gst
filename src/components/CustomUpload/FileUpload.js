
import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// used for making the prop types of this component
import PropTypes from "prop-types";
import axios from "axios";

import { Button } from "reactstrap";
import { config } from "config";
import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";

import NotificationAlert from "react-notification-alert";
import JWTManager from "../../utils/JWTManager";
import SweetAlert from "react-bootstrap-sweetalert";
import LocalStorageManager from "../../utils/LocalStorageManager";
// import { toggleTxInProgressModalState } from "../../api/transactionInProgressSlice";
// import { removeEmptyKeys, isAlphanumeric, calculateDaysBetween, extractDays } from "../../variables/utils";

const FileUpload = ({
                        avatar,
                        className,
                        formState,
                        disabled,
                        invId,
                        file_copy,
                        purpose,
                    }) => {
    const [file, setFile] = React.useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState(defaultImage);

    const notificationAlertRef = useRef(null);
    const fileInput = useRef(null);

    const [alert, setAlert] = useState(null);
    const [invoiceCreated, setInvoiceCreated] = useState(false);
    const invoice_icon = "https://res.cloudinary.com/dxaydx0rh/image/upload/v1708955133/dtf/proposal-icon_fgkwa1.png";

    const dispatch = useDispatch();


    const notify = (place, msg) => {
        var color = Math.floor(Math.random() * 5 + 1);
        var type;
        switch (3) {
            case 1:
                type = "primary";
                break;
            case 2:
                type = "success";
                break;
            case 3:
                type = "danger";
                break;
            case 4:
                type = "warning";
                break;
            case 5:
                type = "info";
                break;
            default:
                break;
        }
        var options = {};
        options = {
            place: place,
            message: (
                <div>
                    <div>
                        <b>{msg}</b> - Error
                    </div>
                </div>
            ),
            type: type,
            icon: "tim-icons icon-alert-circle-exc",
            autoDismiss: 7,
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setFile(file);
            setImagePreviewUrl(invoice_icon);
        };
        reader.readAsDataURL(file);
        console.log("Target File", file);
    };
    // eslint-disable-next-line
    const handleSubmit = (e) => {
        e.preventDefault();
        // file is the file/image uploaded
        // in this function you can save the image (file) on form submit
        // you have to call it yourself

    };
    const handleClick = () => {
        fileInput.current.click();
    };
    const handleRemove = () => {
        setFile(null);
        setImagePreviewUrl(avatar ? defaultAvatar : defaultImage);
        fileInput.current.value = null;
    };

    const handleDownload = async () => {
        console.info("Inside Handle download");
        try {
            const response = await fetch(`${config.api_url}/orgs/${LocalStorageManager.getOrgId()}/invoices/${invId}/file`, {
                headers: {
                    'accept': "application/pdf",
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
                const base64String = reader.result;
                console.info("Response", base64String);
                const newTab = window.open(base64String, "_blank");
                if (newTab === null) {
                    const downloadLink = window.document.createElement('a');
                    downloadLink.href = base64String;
                    // downloadLink.download = (invoice.invoice_file && invoice.invoice_file !== null && invoice.invoice_file !== undefined && invoice.invoice_file !== "") ? invoice.invoice_file : 'Invoice.pdf';
                    downloadLink.textContent = 'Download PDF';
                    const confirmed = window.confirm(`Please allow pop-ups to view the document or click "OK" to download the file`);
                    if (confirmed) {
                        downloadLink.click();
                    }
                    downloadLink.remove();
                } else {
                    newTab.focus();
                }
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error(err);
        }
    }

    // XHR Request to send transaction to Blockchain
    async function uploadFile() {
        // formState = removeEmptyKeys(formState);

        console.log("Inside Create Invoice", formState);
        // Step 1: Stringify the JSON object
        const jsonString = JSON.stringify({
            purpose
        });
        // Step 2: Convert the Stringified JSON to a Blob
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });

        // Step 3: Create a FormData object and append the Blo

        // Preparing Payload
        let formData = new FormData();
        formData.append("file", file);
        formData.append('metadata', jsonBlob);

        axios.post(`${config.api_url}/file-upload`, formData, {
            // Add parameters here
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JWTManager.getToken()}`
            }
        })
            .then((response) => {
                console.log("upload Success", response.data);

                // Handle data
                successAlert();

            })
            .catch((error) => {
                console.log("yo", error);

                // notify("tr",error.response.data.message)
                if (error.response && error.response.data) {
                    console.log("error", error.response.data.message);
                    notify("tr", error.response.data.message);
                }
                else if (error.code === "ERR_BAD_RESPONSE") {
                    notify("tr", error.message);
                }
            })

        setFile(null)
        setImagePreviewUrl(defaultImage)
    }

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="File Uploaded"
                onConfirm={hideAlert}
                onCancel={hideAlert}
                confirmBtnBsStyle="info"
            >
                &nbsp;
            </SweetAlert>
        );
    };

    const hideAlert = () => {
        setAlert(null);
        setInvoiceCreated(true);
    };

    return (
        <>
            <div>
                <div className="rna-container content">
                    {notificationAlertRef && <NotificationAlert ref={notificationAlertRef}/>}
                </div>

                {alert}
                <div>
                    {invId !== "new" ? (
                        <div className="fileinput text-center">
                            <input type="file" onChange={handleFileChange} ref={fileInput} accept="application/csvm+json"/>
                            <div className="thumbnail" >
                                <img
                                    className={className}
                                    src={imagePreviewUrl}
                                    width={imagePreviewUrl === invoice_icon ? "70" : "165"}
                                    style={{marginTop: "25px"}}
                                    alt="..."
                                />
                            </div>

                            {file === null ? (
                                <div>
                                    <Button
                                        color="primary"
                                        className="btn-link"
                                        disabled={disabled}
                                        onClick={() => handleClick()}
                                    >
                                        Upload {file_copy}
                                    </Button>
                                </div>
                            ) : (
                                <span>
                                <div>{file.name}</div>
                                <Button
                                    color="primary"
                                    className="btn-link"
                                    onClick={() => handleClick()}
                                >
                                    Change
                                </Button>
                                    {avatar ? <br/> : null}
                            </span>
                            )}
                        </div>
                    ) : (
                        <div>
                            <img
                                className={className}
                                src={invoice_icon}
                                width={imagePreviewUrl === invoice_icon ? "70" : "165"}
                                style={{marginTop: "25px"}}
                                alt="..."
                            />
                            <div>
                                <Button
                                    color="primary"
                                    className="btn-link"
                                    onClick={() => handleDownload()}
                                >
                                    {/*{(invoice.invoice_file && invoice.invoice_file !== null && invoice.invoice_file !== undefined && invoice.invoice_file !== "") ? invoice.invoice_file : "Invoice"}*/}
                                    AAAA
                                </Button>
                            </div>
                        </div>
                    )
                    }
                    <div className="submit-files">
                        {
                            <Button
                                color="primary"
                                disabled={!file}
                                onClick={uploadFile}
                            >
                                Submit File
                            </Button>
                        }
                    </div>

                </div>
            </div>
        </>
    );
};

FileUpload.defaultProps = {
    avatar: false,
    removeBtnClasses: "btn-round",
    removeBtnColor: "danger",
    addBtnClasses: "btn-round",
    addBtnColor: "primary",
    changeBtnClasses: "btn-round",
    changeBtnColor: "primary",
};

FileUpload.propTypes = {
    avatar: PropTypes.bool,
    removeBtnClasses: PropTypes.string,
    removeBtnColor: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "danger",
        "link",
    ]),
    addBtnClasses: PropTypes.string,
    addBtnColor: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "danger",
        "link",
    ]),
    changeBtnClasses: PropTypes.string,
    changeBtnColor: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "danger",
        "link",
    ]),
};

export default FileUpload;