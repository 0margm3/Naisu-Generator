"use strict"

import { parseString } from "./Parser.js";

var input;

let getInputUser, onClickTextarea;

window.userInput = getInputUser = () => {
  var getInput = document.getElementById("inputTxtArea");

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
  // printOutput();
}

window.textArea = onClickTextarea = () => {
  const textArea = document.getElementById("inputTxtArea");

  textArea.style.borderColor = "black";
  textArea.style.borderWidth = "thin";
}

// export { input };