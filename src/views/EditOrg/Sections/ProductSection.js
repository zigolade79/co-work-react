import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
import PublishIcon from "@material-ui/icons/Publish";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

import csv from "csv-parser";
import fileReaderStream from "filereader-stream";

const useStyles = makeStyles(styles);

const results = [];

const onChange = (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  fileReaderStream(files[0])
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
    });
};

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <div>
            <h4 className={classes.title}>조직도 파일 업로드</h4>
          </div>
          <div>
            <input
              color="primary"
              accept="*"
              type="file"
              onChange={onChange}
              id="icon-button-file"
              style={{ display: "none" }}
            />
            <label htmlFor="icon-button-file">
              <Button
                variant="contained"
                component="span"
                className={classes.button}
                size="large"
                color="primary"
              >
                upload
                <PublishIcon />
              </Button>
            </label>
          </div>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Free Chat"
              description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough."
              icon={Chat}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Verified Users"
              description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Fingerprint"
              description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough."
              icon={Fingerprint}
              iconColor="danger"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
