import React, {useState} from "react";
// import {clip_address} from "variables/utils";
// import {CopyToClipboard} from "react-copy-to-clipboard";
import "./longhash.scss";

// import cryptoRandomString from "randomstring";

const LongHash = (props) => {
    // const randomString = cryptoRandomString.generate();
    const [txCopied, setTxCopyStatus] = useState(false);

    return (
        <div className={"long-hash copy_hash no_select " + (props.mode ? props.mode : "dark")}>
            {/* <CopyToClipboard
                className="copy-pointer"
                text={props.hash}
                // id={randomString}
                onCopy={() => {
                    setTxCopyStatus({copied: true});
                }}>
                <span>{(props.hash.length <= 10 ) ? props.hash : clip_address(props.hash)}</span>
            </CopyToClipboard> */}
            <span className="copy-tooltip">{txCopied ? "Copied" : props.tooltip_msg ? props.tooltip_msg : "Copy"}</span>
        </div>
    )
}

export default LongHash;