/*!
=========================================================
* Xaults Dashboard PRO
=========================================================
*/
import React from "react";

// reactstrap components
import { Row, Col } from "reactstrap";

// core components
import ImageUpload from "components/CustomUpload/ImageUpload.js";

const Step2 = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    isValidated: undefined,
  }));
  return (
    <>
      <h5 className="info-text">Who are you? (Fileinput)</h5>
      <Row className="justify-content-center">
        <Col className="text-center" lg="10">
          <ImageUpload
            changeBtnClasses="btn-simple"
            addBtnClasses="btn-simple"
            removeBtnClasses="btn-simple"
          />
        </Col>
      </Row>
    </>
  );
});

export default Step2;
