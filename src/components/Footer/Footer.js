/*!
=========================================================
* Xaults Dashboard PRO
=========================================================
*/
/*eslint-disable*/
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

const Footer = (props) => {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="https://www.xaults.com">
              Xaults
            </a>
          </li>{" "}
          <li className="nav-item">
            <a
              className="nav-link"
              href="https://www.xaults.com"
            >
              About us
            </a>
          </li>{" "}
          <li className="nav-item">
            <a className="nav-link" href="https://www.xaults.com">
              Blog
            </a>
          </li>
        </ul>
        <div className="copyright">
          © {new Date().getFullYear()} made with{" "}
          <i className="tim-icons icon-heart-2" /> by{" "}
          <a href="https://www.xaults.com" target="_blank">
            Xaults.
          </a>{" "}
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
