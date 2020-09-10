import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import TeamSection from "./Sections/TeamSection.js";
import WorkSection from "./Sections/WorkSection.js";

//apollo
import { gql, useQuery, useApolloClient } from "@apollo/client";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const { data } = useQuery(IS_LOGGED_IN);
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        brand="co-work"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      <Parallax filter image={require("assets/img/landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={15} sm={15} md={15}>
              <h1 className={classes.title}>조직과 팀을 최적화 하는 방법</h1>
              <h4>
                조직간 네트워크 분석을 통해 조직의 약점과 강점을 파악하고 최적화
                할 수 있습니다.
              </h4>
              <br />
              {!data.isLoggedIn && (
                <Link to={"/login-page"} className={classes.link}>
                  <Button color="rose" align="right">
                    <h4>
                      <strong>지금 시작</strong>
                    </h4>
                  </Button>
                </Link>
              )}
              {data.isLoggedIn && (
                <Link to={"/edit-org"} className={classes.link}>
                  <Button color="rose" align="right">
                    <h4>
                      <strong>지금 시작</strong>
                    </h4>
                  </Button>
                </Link>
              )}
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
          <TeamSection />
          <WorkSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
