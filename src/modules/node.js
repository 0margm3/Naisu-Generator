import { nodeList, nodeFunction, nodeStatement, nodeFlowControl } from "./Parser.js";

var test = "test this";

function addFlowControl(
  type,
  headerFC,
  genLevel,
  acceptingChild
) {
  let node = new nodeFlowControl(
    type,
    headerFC,
    genLevel,
    acceptingChild
  );

  let current;

  // get current function
  current = traverseFunction(nodeList.head);

  // current = current.childSFC;

  if (current.childSFC == null) {
    current.childSFC = node;
  } else {
    current = current.childSFC;

    while (current.nextSFC) {
      current.currentNodeSFC = false;

      current = current.nextSFC;
    }

    current.currentNodeSFC = false;
    current.nextSFC = node;
  }
}

function traverseStatement(nodeStatement) {
  // the comments statements are for checking algo traverse correctly
  // nodeStatement is the head or the parent
  // by taking the pointer of its child we can traverse inside it
  // note: there is no child in a statement so we didnt consider adding another algorithm to check
  // child only exist in function and flow controls. so, we only use nextSFC.
  // this function serves as current node finder to insert the next sibling.

  let node = nodeStatement.childSFC;

  while (node.nextSFC) {
    // console.log(node.dataS, node.currentNodeSFC, node.genLevel);
    node = node.nextSFC;
  }
  //console.log(node.dataS, node.currentNodeSFC, node.genLevel);

  nodeStatement = node;

  return nodeStatement;
}

function addStatement(stringStatement, genLevel, child) {
  // let lvlCounter = 0;
  let node = new nodeStatement(stringStatement, genLevel);

  let current;
  
  // get the current Function
  current = traverseFunction(nodeList.head);
  // console.log(current);


  // this algo does not support inserting child into flow control
  // only for function need to add support for fc

  if (current.childSFC == null) {
    current.childSFC = node;
  } else {
    current = current.childSFC;

    while (current.childSFC){
      current = current.childSFC;
      if (genLevel == current.genLevel){
        current = current.childSFC;
        break;
      }
    }

    while (current.nextSFC) {
      current = current.nextSFC;
    }

    if (child == true) {
      current.childSFC = node;
    } else if (child == false) {
      current.nextSFC = node;
    }
  }
}

function traverseFunction(nodeFunction) {
  // the comments statements are for checking algo traverse correctly
  // nodeFunction is the head or the parent
  // by taking the pointer of its sibling/next we can traverse the next function
  // note: we only need to traverse the function to check where is the current function to insert its child
  // a separate function is created for the sake of inserting childs to a function/parent

  while (nodeFunction.nextFunc) {
    // console.log(nodeFunction.headerFunc, nodeFunction.currentNodeFunc, nodeFunction.hierarchyLevel);
    nodeFunction = nodeFunction.nextFunc;
  }
  // console.log(nodeFunction.headerFunc, nodeFunction.currentNodeFunc, nodeFunction.hierarchyLevel);
  return nodeFunction;
}

function addFunc(string, level, child) {
  let node = new nodeFunction(string, level);

  let current;

  if (nodeList.head == null) {
    nodeList.head = node;
  } else {
    current = nodeList.head;

    while (current.nextFunc) {
      current = current.nextFunc;
    }

    if (child == true) {
      current.childSFC = node;
    } else {
      current.nextFunc = node;
    }
  }
}

function treeTraversalPO(node) {
  // preOrder traversal
  if (node == null) return;

  /* first print data of node */
  document.write(node.key + " ");

  /* then recur on left subtree */
  treeTraversalPO(node.left);

  /* now recur on right subtree */
  treeTraversalPO(node.right);
}

export { addFunc, addStatement, addFlowControl };
