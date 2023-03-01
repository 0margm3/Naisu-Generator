import { addFunc, addStatement, addFlowControl } from "./node.js";

class nodeList {
  constructor() {
    this.head = null;
  }
}

class nodeFunction {
  constructor(stringFunc, genLevel) {
    // this.currentNodeFunc = currentNodeFunc; // flag for current node // note: i think i dont need this.
    this.stringFunc = stringFunc; // holds string header data
    this.genLevel = genLevel; // level of {}
    // this.cFunc = cFunc;                     // hmmm?
    this.childSFC = null; // pointer to child (statement or flow control)
    this.nextFunc = null; // pointer to next Function
  }
}

class nodeFlowControl {
  constructor(type, headerFC, genLevel, acceptingChild) {
    this.genLevel = genLevel; // node level / level of "{}"
    this.acceptingChild = acceptingChild; // flag for accepting child node
    this.type = type; // type of flow control
    this.headerFC = headerFC; // data header of flow control
    this.childSFC = null; // pointer to child node SFC
    this.nextSFC = null; // pointer to next node SFC
    // sfc == Statement / Flow Control
  }
}

class nodeStatement {
  constructor(dataS, genLevel) {
    // this.currentNodeSFC = currentNodeSFC; // flag for current node
    // this.currentSiblingS = currentSiblingS; // flag for accepting next sibling node
    this.genLevel = genLevel; // node level / level of "{}"
    this.dataS = dataS; // string statement
    this.nextSFC = null; // pointer to next SFC
    // this.childSFC = null;                // a statement does not have the ability to have a child ig
  }
}

window.nodeList = nodeList;
window.nodeFunction = nodeFunction;
window.nodeStatement = nodeStatement;
window.nodeFlowControl = nodeFlowControl;

function parseString(input) {

  input += "\n";

  let lastNewline = -1;
  let i;

  for(i = 0; i < input.length; i++){
    if(input[i] == '\n'){
      if(lastNewline == -1){
        lastNewline = i;
        regExpSearch(0, i, input);
      } else if(lastNewline != -1) {
        regExpSearch(lastNewline + 1, i, input);
        lastNewline = i;
      }
    }
  }

  if(i == input.length){
    console.log("Done reading");
  }
  
  console.log(nodeList.head);
}

let commentClose = false, bracketClose = false;
let concatString = "";
let level = -1;
let cleanString;
let child = false, newChild = true;

window.level = level;

function regExpSearch(start, end, input){
  let string = input.substring(start, end, input);

  if(string.search(new RegExp(/\*\//)) != -1 && commentClose == true){
    concatString += string;
    commentClose = false;
    console.log(concatString);
    concatString = ""
  }

  if (string.search(new RegExp(/\}/g)) != -1){
    level--;
  }

  // C Preprocessor
  if(string.search(new RegExp(/\#include\s*\<\w*.h\>\s*/gi)) != -1 || string.search(new RegExp(/\#include\s*\"\w*.h\"\s*/gi)) != -1){
    string = string.replace(new RegExp("<", "g"), '"');
    string = string.replace(new RegExp(">", "g"), '"');
    
    if(string.search(new RegExp(/\/\*/g)) != -1){
      commentClose = true;
      concatString += string;
    } else {
      console.log(string + " pPro");
    }
  } else if (string.search(new RegExp(/\#define\s*\w*\s*\w*\s*/gi)) != -1){
    if(string.search(new RegExp(/\/\*/g)) != -1){
      commentClose = true;
      concatString += string;
    } else {
      console.log(string + " pPro");
    }
    
  } else if (string.search(new RegExp(/\s*\(.*\)\s*\{/g)) != -1) { // function or flow control
    console.log(string + " F or FC"); 

    if(string.search(new RegExp(/\s*main\s*/gi)) != -1) {
      level = 0;

      cleanString = string;
      cleanString = cleanString.replace(new RegExp(/\{/g), "");

      addFunc(cleanString, level, child);

      level++;
      child = true;
      newChild = true;
      
    } else if (string.search(new RegExp(/\s*if\s*\(.*\)\{/gi)) != -1){
      bracketClose = true;
      if (string.search(new RegExp(/\s*else\s*/gi)) != -1){
        // else if detected
        addFlowControl("else if", string, level, false, true);
        
        level++;
        newChild = true;
        child = true;

      } else if(string.search(new RegExp(/\s*else\s*/gi)) == -1){
        // if detected
        addFlowControl("if", string, level, false, true);

        level++;
        newChild = true;
        child = true;

      }
    }
  } else if (string.search(new RegExp(/\s*\w*\s*\w*\(.*\)\;/gi)) != -1) { // function prototype 
    // function prototype can also be considered as a statement/instruction;
    if (string.search(new RegExp(/\s*while\s*/gi)) != -1){
      console.log("do while detected");
    }

    if (string.search(new RegExp(/\/\*/g)) != -1){
      commentClose = true;
      concatString += string;
    } else {
      console.log(string);
    }
  } else if (string.search(new RegExp(/else/gi)) != -1) { // detecting else ig
    console.log(string + " else detected");
    if (string.search(new RegExp(/{/gi)) != -1){
      // multiple child to be inserted to the parent 
    } else if(string.search(new RegExp(/{/gi)) == -1){
      // single child to be inserted to the parent
    }

  } else if (string.search(new RegExp(/\;/g)) != -1) { // statement to be improve later i guess
    console.log(string);

    if (newChild == true){
      addStatement(string, level, child);
      newChild = false;
      child = false;
    } else if (newChild == false){
      addStatement(string, level, child);
    }

  } else if (string.search(new RegExp(/\}/g)) != -1){ // closing of function ig
    console.log(string);
  }
}

export { parseString, nodeList, nodeFlowControl, nodeFunction, nodeStatement};