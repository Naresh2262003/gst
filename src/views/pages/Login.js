
import React, { useState, useRef } from "react";
import { Navigate, useLocation , useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import classnames from "classnames";
import { config } from "config";
import JWTManager from "../../utils/JWTManager";
import LocalStorageManager from "../../utils/LocalStorageManager";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";

const Login = () => {
  const [state, setState] = useState({});
  const [orgName, setOrgName] = useState(localStorage.getItem("session_id") ? localStorage.getItem("session_id") : null);
  const [token, setToken] = useState(JWTManager.getToken() ? JWTManager.getToken() : null);
  const [gstin, setGstin] = useState(null);
  const [password, setPassword] = React.useState(null);

  const notificationAlertRef = useRef(null);

  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });


  const navigate = useNavigate(); 

  // XHR Request to send transaction to Blockchain
  async function  login () {

    console.log("Inside Login Button");
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gstin
      })
    }

    try {
      const response = await fetch(
          `${config.api_url}/login`, settings
      );

      const json = await response.json();
      console.log("response new ",json)

      if (!response.ok) {
        console.log("Login Failed");
        // notify("tr", json.message);
      } else {
        console.log("Login Success");
        notify("tr", "Login Success", "success");
        console.log("Response new", json);
        localStorage.setItem("token", json.token);
        JWTManager.setToken(json.token);
        // setOrgName(json.org_name);
        setToken(json.token);

        // Redirect to /admin/invoice after successful login
        navigate("/admin/invoice");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  }

  const notify = (place, msg, ntype) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (ntype === "success" ? 2 : 3) {
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
              <b>{msg}</b> {ntype === "success" ? "" : "- Error"}
            </div>
          </div>
      ),
      type: type,
      icon: "tim-icons icon-alert-circle-exc",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  // if(orgName !== null && token !== null) {
  //   return <Navigate to='/admin/loyalty' />
  // }

  return (
      <>
        <div className="content">
          <div className="rna-container">
            <NotificationAlert ref={ notificationAlertRef } />
          </div>

          <Container>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form className="form">
                <Card className="card-login card-white">
                  <CardHeader className="text-center" style={{paddingBottom: "10px", paddingTop: "50px"}}>
                    {/* <img
                        alt="..."
                        src={require("assets/img/favicon.png")}
                        style={{width: "100px", position: "relative", margin: "14px 0 10px 0", paddingBottom: "10px"}}
                    /> */}
                    <CardTitle tag="h1" style={{color: "#003149"}}>Log in</CardTitle>
                  </CardHeader>

                    <InputGroup
                        className={classnames({
                          "input-group-focus": state.emailFocus,
                        })}

                        style={{ padding: "20px"}}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-paper" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          placeholder="Enter Your GSTIN"
                          type="text"
                          defaultValue={ gstin }
                          onChange={(e) => setGstin(e.target.value)}
                          onFocus={(e) => setState({ ...state, emailFocus: true })}
                          onBlur={(e) => setState({ ...state, emailFocus: false })}
                      />
                    </InputGroup>

                  <CardFooter>
                    <Button
                        block
                        className="mb-3"
                        color="info"
                        onClick={ login }
                        size="lg"
                    >
                      Log In
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </>
  );
};

export default Login;