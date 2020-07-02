import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import Muted from "components/Typography/Muted.js";
import { element } from "prop-types";

const data = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "fd",
      name: "Child - 3",
      children: [
        {
          id: "sg",
          name: "Child - 5",
          children: [
            {
              id: "sgsg",
              name: "Child - 6",
            },
            {
              id: "sdgsgsdg",
              name: "Child - 7",
            },
          ],
        },
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};
const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

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

export default function RecursiveTreeView() {
  const classes = useStyles();
  console.log(searchHyerachy(data, "Child - 10"));
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <div className={classes.section}>
      <Muted>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {renderTree(data)}
        </TreeView>
      </Muted>
    </div>
  );
}
