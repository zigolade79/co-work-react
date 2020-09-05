import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";
import image from "assets/img/bg7.jpg";
// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import TeamSection from "./Sections/TeamSection.js";
import WorkSection from "./Sections/WorkSection.js";
import RecursiveTreeView from "./Sections/TreeView.js";

//graohql
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts($name: String!) {
    posts(name: $name) {
      _id
      name
      children {
        name
        email
        children {
          name
          email
          children {
            name
            email
          }
        }
      }
    }
  }
`;
const ADD_POST = gql`
  mutation AddPost($inputOrgs: Org!) {
    addPost(inputOrgs: $inputOrgs) {
      name
    }
  }
`;

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

const ShowTree = (props) => {
  const classes = useStyles();
  console.log("in render tree");
  console.log(props.data);
  if (props.data === "unloded") {
    console.log("props.data is unloded");
    return (
      <div className={classes.section}>
        <div>
          <h4 className={classes.title}>file not loaded</h4>
        </div>
      </div>
    );
  } else {
    console.log(props.data);
    return <RecursiveTreeView data={props.data} />;
  }
};

export default function LandingPage(props) {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { name: "root" },
  });
  if (loading && !data) {
    console.log("loading...");
  } else if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
  const [addPost] = useMutation(ADD_POST);
  console.log("LandingPage");
  console.log(addPost);
  const classes = useStyles();
  const [orgDb, setOrgDb] = useState("unloded");

  const { ...rest } = props;
  return (
    <div>
      <Header
        absolute
        color="white"
        brand="Material Kit React"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={15} sm={15} md={15}>
              <h1 className={classes.title}>조직 정보 관리</h1>
              <h4>
                조직 정보를 업로드 하고 관리합니다. 설문조사 및 데이터 수집을
                위해 조직 정보를 이용합니다.
              </h4>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection setState={setOrgDb} setOrg={addPost} />
          <ShowTree data={orgDb} />
        </div>
      </div>
    </div>
  );
}
