import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import Muted from "components/Typography/Muted.js";
import { element } from "prop-types";

const data_old = {
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
    height: 500,
    flexGrow: 1,
    maxWidth: 1000,
  },
});
const printObject = (object) => {
  const str = JSON.stringify(object, null, 4); // (Optional) beautiful indented output.
  console.log(str); // Logs output to dev tools console.
};
export default function RecursiveTreeView(props) {
  const classes = useStyles();
  console.log("RecursiveTreeView");
  if (props.data === undefined) {
    return <div></div>;
  }
  printObject(props.data);
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
          {renderTree(props.data)}
        </TreeView>
      </Muted>
    </div>
  );
}
