import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
import PublishIcon from "@material-ui/icons/Publish";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
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
const hierarchicalData = {};

const onChange = (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  fileReaderStream(files[0])
    .pipe(csv({ headers: false }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
      hierarchicalData.id = "root";
      hierarchicalData.name = "Company";
      makeHierarchy(results);
      console.log(hierarchicalData);
    });
};

const searchHyerachy = (treeData, value) => {
  const findedKey = Object.keys(treeData).find(
    (key) => treeData[key] === value
  );

  if (findedKey === undefined) {
    console.log("//현재 layer에서 못찾음 -> array 탐색");
    if (Array.isArray(treeData.children)) {
      for (let el of treeData.children) {
        const result = searchHyerachy(el, value);
        if (result) {
          return result;
        }
      }
    }
  } else {
    console.log("//찾음 : 현재 object를 반환");
    return treeData;
  }
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const makeHierarchy = (parsedData) => {
  parsedData.forEach((row) => {
    Object.keys(row).forEach((key, index, keys) => {
      const result = searchHyerachy(hierarchicalData, row[key]);
      console.log(hierarchicalData);
      if (result === undefined && index === 0) {
        console.log("//처음부터 못찾음");
        if (Array.isArray(hierarchicalData.children)) {
          hierarchicalData.children.push({
            id: row[key],
            name: row[key],
          });
        } else {
          hierarchicalData.children = [
            {
              id: row[key],
              name: row[key],
            },
          ];
        }
      } else if (result === undefined && index !== 0) {
        console.log("//상위 조직이 존재");
        const parentOrg = searchHyerachy(
          hierarchicalData,
          row[keys[index - 1]]
        );
        console.log(parentOrg);
        if (Array.isArray(parentOrg.children)) {
          parentOrg.children.push({
            id: row[key],
            name: row[key],
          });
        } else {
          parentOrg.children = [
            {
              id: row[key],
              name: row[key],
            },
          ];
        }
      }
    });
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
        </GridItem>
      </GridContainer>
      <GridContainer direction="row" justify="space-around">
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
              CSV File Open
            </Button>
          </label>
        </div>

        <div>
          <input
            color="success"
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
              color="success"
            >
              Upload to Server
              <PublishIcon />
            </Button>
          </label>
        </div>
      </GridContainer>
    </div>
  );
}
