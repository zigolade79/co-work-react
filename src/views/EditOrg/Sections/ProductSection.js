import React, { useState } from "react";
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
import RecursiveTreeView from "./TreeView.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

import csv from "csv-parser";
import fileReaderStream from "filereader-stream";

const useStyles = makeStyles(styles);
let setState, setOrg;

const data = {
  variables: {
    inputOrgs: {
      name: "root2",
      children: [
        {
          name: "member1",
          email: "member1@gmail.com",
          children: [
            {
              name: "member2",
              email: "member2@gmail.com",
            },
            {
              name: "member3",
              email: "member3@gmail.com",
            },
          ],
        },
      ],
    },
  },
};

const onChange = (event) => {
  const results = [];
  const hierarchicalData = {};
  const files = event.target.files;
  if (files.length === 0) return;

  fileReaderStream(files[0])
    .pipe(csv({ headers: false }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
      hierarchicalData.id = "root";
      hierarchicalData.name = "Company";
      makeHierarchy(hierarchicalData, results);
      printObject(hierarchicalData);
      console.log(setState);
      setState(hierarchicalData);
      //printObject(hierarchicalData);
      //setOrgDb(hierarchicalData);
    });
};
const printObject = (object) => {
  const str = JSON.stringify(object, null, 4); // (Optional) beautiful indented output.
  console.log(str); // Logs output to dev tools console.
};
const searchHyerachy = (treeData, value) => {
  const findedKey = Object.keys(treeData).find(
    (key) => treeData[key] === value
  );

  if (findedKey === undefined) {
    //console.log("//현재 layer에서 못찾음 -> array 탐색");
    if (Array.isArray(treeData.children)) {
      for (let el of treeData.children) {
        const result = searchHyerachy(el, value);
        if (result) {
          return result;
        }
      }
    }
  } else {
    // console.log("//찾음 : 현재 object를 반환");
    return treeData;
  }
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};
const getValueByIndex = (object, index) => {
  return object[Object.keys(object)[index]];
};
const addValueToParent = (object, element) => {
  //console.log("addValueToParent");
  //printObject(object);
  if (Array.isArray(object.children)) {
    //이미 chidren array가 존재하면 거기에 push
    object.children.push(element);
  } else {
    //진짜 맨 처음인 경우 children array 생성
    object.children = [element];
  }
};
const makeHierarchy = (hierarchiData, parsedData) => {
  const row = parsedData.length;
  const column = Object.keys(parsedData[0]).length;
  //console.log(`row= ${row}, column= ${column}`);
  for (let r = 0; r < row; r++) {
    // console.log(`r: ${r}`);
    const person = {
      id: getValueByIndex(parsedData[r], column - 2),
      name: getValueByIndex(parsedData[r], column - 2),
      email: getValueByIndex(parsedData[r], column - 1),
    };
    //printObject(person);
    let c;
    for (c = 0; c < column - 2; c++) {
      // console.log(`c: ${c}`);
      const col_element = getValueByIndex(parsedData[r], c);
      const result = searchHyerachy(hierarchiData, col_element);
      if (col_element === "") {
        // console.log("조직이 비어있으면 부모 노드에 person 추가 하고 다음 행으로" );
        break;
      }
      if (result === undefined) {
        // 못찾음
        if (c === 0) {
          //근데 최상위부터 못찾음 --> root에 추가
          addValueToParent(hierarchiData, {
            id: col_element,
            name: col_element,
          });
        } else {
          //최상위는 아니고 못찾음 부모가 포함된 object의 children array에 push
          const parentOrg = searchHyerachy(
            hierarchiData,
            getValueByIndex(parsedData[r], c - 1)
          );
          addValueToParent(parentOrg, { id: col_element, name: col_element });
        }
      }
    }
    //상위 조직을 모두 검색하고 추가함 --> 부모 노드에 person 추가
    const parentOrg = searchHyerachy(
      hierarchiData,
      getValueByIndex(parsedData[r], c - 1)
    );
    addValueToParent(parentOrg, person);
  }

  //console.log(hierarchiData);
};

const sendData = () => {
  console.log("call sendData");
  console.log(data);
  setOrg(data);
};

export default function ProductSection(props) {
  const classes = useStyles();
  console.log(props);
  setState = props.setState;
  setOrg = props.setOrg;
  console.log(setOrg);
  return (
    <div>
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
            <Button
              variant="contained"
              component="span"
              className={classes.button}
              size="large"
              color="success"
              onClick={sendData}
            >
              Upload to Server
              <PublishIcon />
            </Button>
          </div>
        </GridContainer>
      </div>
    </div>
  );
}
