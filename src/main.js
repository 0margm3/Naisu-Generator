
var input;


class nodeList {
  constructor() {
    this.head = null;
  }
}

class point {
  constructor(string, level, type, pointID, pointParent, parentType) {
    this.string = string;
    this.level = level;
    this.type = type;
    this.id = pointID;
    this.parent = pointParent;
    this.next = null;
    this.child = null;
  }
}

class parentTree {
  constructor() {
    this.head = null;
  }
}

window.parentTree = parentTree;

class parentLeaves {
  constructor(leafId, level) {
    this.leafId = leafId;
    this.level = level;
    this.next = null;
  }
}

let getInputUser, onClickTextarea;

window.userInput = getInputUser = () => {
  var getInput = document.getElementById("inputTxtArea");

  nodeList.head = null;
  parentTree.head = null;
  switchEnabled = false;

  clearOutput();

  // delete divs inside output()

  if (getInput.value !== "") {
    // console.log(getInput.value); testing to get input
    input = getInput.value;
    // console.log(input);
    // console.log(input); //test to print input
  } else {
    alert("Textarea empty!");
    getInput.style.borderColor = "red";
    getInput.style.borderWidth = "2px";
  }

  parseString(input);
  input = "";
  traverse(nodeList.head);

}

window.textArea = onClickTextarea = () => {
  const textArea = document.getElementById("inputTxtArea");

  textArea.style.borderColor = "black";
  textArea.style.borderWidth = "thin";
}

let clearOutput = () => {
  let container = document.getElementById("output");

  container.innerHTML = "";

}

// parser
let counter;
function parseString(input) {

  input += "\n";
  parentTemp = null;

  let lastNewline = -1;
  let i;
  counter = 0;



  for (i = 0; i < input.length; i++) {
    if (input[i] == '\n') {
      if (lastNewline == -1) {
        lastNewline = i;
        regExpSearch(0, i, input);
      } else if (lastNewline != -1) {
        regExpSearch(lastNewline + 1, i, input);
        lastNewline = i;
      }
    }
  }

  // if(i == input.length){
  //   console.log("Done reading");
  // }

  // console.log(nodeList.head);
}

let commentClose = false, bracketClose = false;
let concatString = "";
let level = -1;
let cleanString;
let oneChild = false, parentTemp = null, idTemp;

window.level = level;

let removeLeaf = (level) => {

  let current = parentTree.head;

  // console.log(current);
  current = current.next;

  while (current.next.next != null) {
    current = current.next;
  }

  current.next = null;

  return current.string;
}
let stringLeaves = " ";

window.stringLeaves = stringLeaves;

let searchLeaves = (node) => {

  if (node.next != null) {
    searchLeaves(node.next);
  } else {

    stringLeaves = node.leafId;
    // console.log(node.leafId);
  }
}

let insertLeaves = (string, level) => {

  let node = new parentLeaves(string, level);
  let current;

  if (parentTree.head == null) {
    parentTree.head = node;
  } else {
    current = parentTree.head;

    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }

  // console.log(current);
}

let switchEnable = false;
let switchEnableLevel = -1;

function regExpSearch(start, end, input) {
  let string = input.substring(start, end, input);

  counter++;
  stringLeaves = " ";

  if (string.search(new RegExp(/\*\//)) != -1 && commentClose == true) {
    concatString += string;
    commentClose = false;
    // console.log(concatString);
    concatString = ""
  }

  // console.log(level);

  if (string.search(new RegExp(/\}/g)) != -1 && level > 1) {

    if (string.search(new RegExp(/\}\s*while\s*\(.*\)\;/gi)) != -1) {
      searchLeaves(parentTree.head);

      insertPoint(string, level, "dowhile-condition", "dowhile-condition-" + counter, stringLeaves);
    }
    level--;
    removeLeaf(level);
  }

  // C Preprocessor
  if (string.search(new RegExp(/\#include\s*\<\w*.h\>\s*/gi)) != -1 || string.search(new RegExp(/\#include\s*\"\w*.h\"\s*/gi)) != -1) {
    string = string.replace(new RegExp("<", "g"), '"');
    string = string.replace(new RegExp(">", "g"), '"');

    if (string.search(new RegExp(/\/\*/g)) != -1) {
      commentClose = true;
      concatString += string;
    } else {
      // console.log(string + " pPro");
    }
  } else if (string.search(new RegExp(/\#define\s*\w*\s*\w*\s*/gi)) != -1) {
    if (string.search(new RegExp(/\/\*/g)) != -1) {
      commentClose = true;
      concatString += string;
    } else {
      // console.log(string + " pPro");
    }

  } else if (string.search(new RegExp(/\s*main\s*.*\{/gi)) != -1) {
    level = 0;

    cleanString = string;
    cleanString = cleanString.replace(new RegExp(/\{/g), "");

    if (parentTemp == null) {
      insertLeaves("head", -1);
    }

    insertPoint(cleanString, level, "function", "function-" + counter, null);
    parentTemp = "function-" + counter;
    insertLeaves(parentTemp, level);

    level++;

  } else if (string.search(new RegExp(/\s*for\s*\(.*\)\s*\{/gi)) != -1) {
    bracketClose = true;
    searchLeaves(parentTree.head);

    // console.log(string);

    insertPoint(string, level, "for", "for-" + counter, stringLeaves);
    insertLeaves("for-" + counter, level);
    level++;

  } else if (string.search(new RegExp(/\s*if\s*.*\{/gi)) != -1) {
    bracketClose = true;

    searchLeaves(parentTree.head);

    if (string.search(new RegExp(/\s*else\s*/gi)) != -1) {
      // else if detected
      // addFlowControl(string, level, "else if");

      insertPoint(string, level, "elseif", "elseif-" + counter, stringLeaves);
      insertLeaves("elseif-" + counter, level);

      level++;

    } else if (string.search(new RegExp(/\s*else\s*/gi)) == -1) {
      // if detected

      insertPoint(string, level, "if", "if-" + counter, stringLeaves);
      insertLeaves("if-" + counter, level);

      level++;

    }
  } else if (string.search(new RegExp(/\s*\while\s*.*\{/gi)) != -1) {
    bracketClose = true;

    searchLeaves(parentTree.head);

    insertPoint(string, level, "while", "while-" + counter, stringLeaves);
    insertLeaves("while-" + counter, level);

    level++;

  } else if (string.search(new RegExp(/\s*do\s*\{/gi)) != -1) {

    searchLeaves(parentTree.head);

    insertPoint(string, level, "dowhile", "dowhile-" + counter, stringLeaves);

    insertLeaves("dowhile-" + counter, level);

    level++;

  } else if (string.search(new RegExp(/else/gi)) != -1) { // detecting else ig
    // console.log(string + " else detected");

    searchLeaves(parentTree.head);

    if (parentTemp == null) {
      insertPoint(string, level, "else", "else-" + counter, null);
    } else {
      insertPoint(string, level, "else", "else-" + counter, stringLeaves);
    }

    insertLeaves("else-" + counter, level);
    level++;

  } else if (string.search(new RegExp(/\s*case\s*.*\s*\:/gi)) != -1 && switchEnable == true) {

    searchLeaves(parentTree.head);

    if (stringLeaves.includes("case")) {
      level--;
      removeLeaf(level);
      searchLeaves(parentTree.head);
    }

    insertPoint(string, level, "case", "case-" + counter, stringLeaves);
    insertLeaves("case-" + counter, level);

    level++;

  } else if (string.search(new RegExp(/\s*default\s*\s*\:/gi)) != -1 && switchEnable == true) {

    searchLeaves(parentTree.head);

    if (stringLeaves.includes("case")) {
      level--;
      removeLeaf(level);
      searchLeaves(parentTree.head);
    }

    insertPoint(string, level, "default", "default-" + counter, stringLeaves);
    insertLeaves("default-" + counter, level);

    level++;

  } else if (string.search(new RegExp(/\s*switch\s*\(.*\)\s*\{/gi)) != -1) {
    searchLeaves(parentTree.head);

    switchEnable = true;
    switchEnableLevel = level;

    insertPoint(string, level, "switch", "switch-" + counter, stringLeaves);
    insertLeaves("switch-" + counter, level);


    level++;

  }
  else if (string.search(new RegExp(/\;/g)) != -1) { // statement to be improve later i guess

    if (string.search(new RegExp(/\s*while\s*\(.*\)\s*\;/gi)) == -1) {
      // console.log(string);
      searchLeaves(parentTree.head);
      insertPoint(string, level, "statement", "statement-" + counter, stringLeaves);
    }


  } else if (string.search(new RegExp(/\}/g)) != -1) { // closing of function ig
    // console.log(string);
  }

}

// nodeOperation

function insertPoint(stringStatement, genLevel, type, child, id, parent) {
  let node = new point(stringStatement, genLevel, type, child, id, parent);

  let current;

  if (nodeList.head == null) {
    nodeList.head = node;
  } else {
    current = nodeList.head;
    if (type == "function") {
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    } else {
      while (current.child) {
        current = current.child;
      }
      current.child = node;
    }
  }

  countNode++;
}


// graphics 

let countNode = 0;
let countCreate = 0;

let traverse = (node) => {

  if (countCreate < countNode) {
    countCreate++;
    create(node.string, node.id, node.parent, node.type, node.level);
    traverse(node.child);
  } else {
    return;
  }

}

let create = (string, id, parent, type, level) => {

  if (type != "dowhile-condition")
    Block(string, id, parent, type, level);

  if (type == "if") {
    Diagram_if_elseif_then(string, id, parent, type, level);
  } else if (type == "elseif") {
    Diagram_if_elseif_then(string, id, parent, type, level);
  } else if (type == "else") {
    Diagram_else_then(string, id, parent, type, level);
  } else if (type == "for" || type == "while") {
    diagram_pretestLoop(string, id, parent, type, level);
  } else if (type == "dowhile" || type == "dowhile-condition") {
    diagram_posttestloop_then(string, id, parent, type, level);
  } else if (type == "switch") {
    diagram_switch(string, id, parent, type, level);
  } else if (type == "case" || type == "default") {
    diagram_case(string, id, parent, type, level);
  }
}



let ifelifBlock = 0;
let prev_level = -2;

let Block = (string, id, parent, type, level) => {
  let divParent;
  let divChild = document.createElement('div');
  let textChild = document.createElement('p');

  // console.log({string, id, parent, type, level});

  if (parent == null) {
    divParent = document.getElementById("output");
  }

  if (type == "function" || type == "statement") {

    textChild.id = "text" + id;
    textChild.className = "px-4 py-2";
    textChild.textContent = string;

    if (type == "function") {
      divChild.className = "px-4 py-2 border-black border-[1px]";
      divChild.id = "block_" + id;
    } else if (type == "statement") {

      divChild.className = "my-2 border-black border-[1px]";
      divParent = document.getElementById("block_" + parent);
      divChild.id = "block_statement_" + id;

    }

    divChild.appendChild(textChild);

  } else if (type == "if") {
    divChild.className = "border-[1px] border-black mt-2";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_if_" + id;
  } else if (type == "elseif") {
    divChild.className = "border-x-[1px] border-b-[1px] border-black ";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_elif_" + id;
  } else if (type == "else") {
    divChild.className = "border-x-[1px] border-b-[1px] border-black ";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_else_" + id;
  } else if (type == "for" || type == "while") {
    divChild.className = "border-[1px] border-black my-2";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_pretestloop_" + id;
  } else if (type == "dowhile") {
    divChild.className = "border-[1px] border-black my-2";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_posttestloop_" + id;
  } else if (type == "switch") {
    divChild.className = "border-[1px] border-black my-2";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_switch_" + id;
  } else if (type == "case" || type == "default") {
    divChild.className = "";
    divParent = document.getElementById("block_" + parent);
    divChild.id = "diagram_case_" + id;
  }

  // console.log(divChild);
  // console.log(divParent);
  // console.log({string, id, parent, type, level});

  divParent.appendChild(divChild);

}

let diagram_case = (string, id, parent, type, level) => {
  let divParent = document.getElementById("diagram_case_" + id);

  let head = document.createElement('div');
  let text = document.createElement('p');

  let block = document.createElement('div');

  head.id = "header_" + id;
  head.className = "border-r-[1px] border-b-[1px] border-black max-w-fit";
  divParent.appendChild(head);

  text.id = "textCondition_case_" + id;
  text.className = "px-2 py-1";
  text.textContent = string;
  head.appendChild(text);

  block.id = "block_" + id;
  block.className = "grow border-black border-l-[1px] border-b-[1px] px-4 py-2";
  divParent.appendChild(block);

}

let diagram_switch = (string, id, parent, type, level) => {
  let divParent = document.getElementById("diagram_switch_" + id);

  let head = document.createElement('div');
  let text = document.createElement('p');

  let body = document.createElement('div');
  let left = document.createElement('div');
  let block = document.createElement('div');

  head.id = "header_" + id;
  head.className = "border-r-[1px] border-b-[1px] border-black max-w-fit";
  divParent.appendChild(head);


  text.id = "textCondition_" + id;
  text.textContent = formatCondition(string, type);
  text.className = "px-2 py-1";
  head.appendChild(text);

  body.id = "body_" + id;
  body.className = "flex flex-row";
  divParent.appendChild(body);

  left.id = "left_" + id;
  left.className = "px-2";
  body.appendChild(left);

  block.id = "block_" + id;
  block.className = "flex flex-col grow";
  body.appendChild(block);
}

let diagram_posttestloop_then = (string, id, parent, type, level) => {

  if (type == "dowhile") {
    let divParent = document.getElementById("diagram_posttestloop_" + id);

    let body = document.createElement('div');
    let left = document.createElement('div');
    let block_id = document.createElement('div');
    let header = document.createElement('div');
    let text = document.createElement('p');

    body.id = "body_" + id;
    body.className = "flex flex-row";
    divParent.appendChild(body);

    left.id = "left_" + id;
    left.className = "px-4 py-2";
    body.appendChild(left);

    block_id.id = "block_" + id;
    block_id.className = "grow border-black border-l-[1px] border-y-[1px] rounded-bl-md px-4 py-2";
    body.appendChild(block_id);

    header.id = "header_" + id;
    header.className = "p-2 max-w-fit";
    divParent.appendChild(header);

    text.id = "text_condition_" + id;
    text.className = "px-2 py-1";
    header.appendChild(text);
  } else if (type == "dowhile-condition") {

    let textCondition = document.getElementById("text_condition_" + parent);

    textCondition.textContent = formatCondition(string, type);

  }

}

let Diagram_else_then = (string, id, parent, type, level) => {

  let divParent = document.getElementById("diagram_else_" + id);

  let head = document.createElement('div');
  let text = document.createElement('p');
  let body = document.createElement('div');
  let block_id = document.createElement('div');

  // console.log(divParent);

  head.id = "head_" + id;
  head.className = "border-r-[1px] border-b-[1px] border-black rounded-br-md max-w-fit";
  divParent.appendChild(head);

  text.id = "textCondition_else_" + id;
  text.className = "px-2 py-1";
  text.textContent = "ELSE";
  head.appendChild(text);

  block_id.id = "block_" + id;
  block_id.className = "mx-4 my-2";
  divParent.appendChild(block_id);

}

let Diagram_if_elseif_then = (string, id, parent, type, level) => {

  // good name convention
  // need to improve parent name describing for other nested flow control okay?

  let divParent;

  if (type == "if") {
    divParent = document.getElementById("diagram_if_" + id);
  } else if (type == "elseif") {
    divParent = document.getElementById("diagram_elif_" + id);
  }

  let header = document.createElement('div');
  let body = document.createElement('div');
  let left = document.createElement('div');
  let block_type_id = document.createElement('div');
  let text = document.createElement('div');

  header.id = "header_id";
  header.className = "border-black border-b-[1px] border-r-[1px] rounded-br-md p-2 max-w-fit";
  header.textContent = formatCondition(string, type);
  divParent.appendChild(header);

  body.id = "body_" + id;
  body.className = "flex flex-row";
  divParent.appendChild(body);

  left.className = "px-4 py-2"
  left.textContent = "F";
  body.appendChild(left);

  block_type_id.id = "block_" + id;
  block_type_id.className = "grow border-black border-l-[1px] border-b-[1px] rounded-bl-md px-4 py-2";
  body.appendChild(block_type_id);

  text.className = "pl-4"
  text.textContent = "T";
  block_type_id.appendChild(text);
}

let diagram_pretestLoop = (string, id, parent, type, level) => {

  let divParent = document.getElementById("diagram_pretestloop_" + id);

  let header = document.createElement('div');
  let text = document.createElement('p');
  let body = document.createElement('div');
  let left = document.createElement('div');
  let block = document.createElement('div');

  // console.log(divParent);

  header.id = "header_" + id;
  header.className = "max-w-fit";
  divParent.appendChild(header);

  text.id = "condition_" + id;
  text.className = "px-2 py-1";
  text.textContent = formatCondition(string, type);
  header.appendChild(text);

  body.id = "body_" + id;
  body.className = "flex flex-row";
  divParent.appendChild(body);

  left.id = "left_" + id;
  left.className = "px-4 py-2";
  body.appendChild(left);

  block.id = "block_" + id;
  block.className = "grow border-black border-l-[1px] border-y-[1px] rounded-tl-md px-4 py-2";
  body.appendChild(block);

}

let formatCondition = (string, type) => {
  let temp, start = -1, end;


  start = string.indexOf("(");
  end = string.lastIndexOf(")");

  temp = string.substring(start + 1, end);

  // console.log({string, type});
  if (type == "if") {
    return "IF " + temp;
  } else if (type == "elseif") {
    return "ELSE IF " + temp;
  } else if (type == "else") {
    // none lol
  } else if (type == "for") {
    return "FOR " + temp;
  } else if (type == "while") {
    return "WHILE " + temp;
  } else if (type == "dowhile-condition") {
    return "WHILE " + temp;
  } else if (type == "switch") {
    return "SWITCH " + temp;
  }

}

let parentLevel = (string) => {
  let level = -1;
  let start = string.indexOf("_level-");
  let tempString = string.substring(start + 7, string.length);
  level = parseInt(tempString);

  return level;
}

let parentType = (string) => {
  let end = string.indexOf("-");
  return string.substring(0, end);
}

let parentId = (string) => {
  let start = string.indexOf()
}