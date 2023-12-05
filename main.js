let isAddingText = false;
const addTextBtn = document.getElementById("add-text-btn");
const canvas = document.getElementById("canvas");
const fontSizeInput = document.getElementById("font-size-input");
let selectedTextBox = null;
let initialMouseX = 0;
let initialMouseY = 0;
let initialTextBoxX = 0;
let initialTextBoxY = 0;

function openPrompt() {
  isAddingText = !isAddingText;

  if (isAddingText) {
    addTextBtn.textContent = "Cancel";
    addTextBtn.classList.remove("add-text-btn");
    addTextBtn.classList.add("cancel-btn");

    canvas.removeEventListener("mousedown", startDrag);
  } else {
    addTextBtn.textContent = "Add Text";
    addTextBtn.classList.remove("cancel-btn");
    addTextBtn.classList.add("add-text-btn");

    canvas.addEventListener("mousedown", startDrag);
  }
}

function createTextBox(x, y, text) {
  const textBox = document.createElement("div");
  textBox.contentEditable = true;
  textBox.classList.add("text-box");
  textBox.style.left = x + "px";
  textBox.style.top = y + "px";
  textBox.innerText = text;
  canvas.appendChild(textBox);

  // Enable dragging of the text box
  textBox.addEventListener("mousedown", function (event) {
    selectedTextBox = textBox;
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    initialTextBoxX = parseInt(selectedTextBox.style.left, 10) || 0;
    initialTextBoxY = parseInt(selectedTextBox.style.top, 10) || 0;
  });

  // Prevent text selection while dragging
  textBox.addEventListener("selectstart", function (event) {
    event.preventDefault();
  });
}

function startDrag(event) {
  if (isAddingText) return;

  const target = event.target;
  if (target && target.classList.contains("text-box")) {
    selectedTextBox = target;
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    initialTextBoxX = parseInt(selectedTextBox.style.left, 10) || 0;
    initialTextBoxY = parseInt(selectedTextBox.style.top, 10) || 0;
  }
}

function moveTextBox(event) {
  if (selectedTextBox) {
    const offsetX = event.clientX - initialMouseX;
    const offsetY = event.clientY - initialMouseY;
    selectedTextBox.style.left = initialTextBoxX + offsetX + "px";
    selectedTextBox.style.top = initialTextBoxY + offsetY + "px";
  }
}

function dropTextBox() {
  selectedTextBox = null;
}

function addTextBox(event) {
  if (isAddingText && event.target === canvas) {
    const text = prompt("Enter text:");
    if (text !== null && text.trim() !== "") {
      createTextBox(event.clientX, event.clientY, text);
    }
  }
}

function applyFontSize() {
  const fontSizeValue = fontSizeInput.value;
  if (selectedTextBox && fontSizeValue !== "") {
    selectedTextBox.style.fontSize = fontSizeValue + "px";
    selectedTextBox.focus(); // Re-focus the selected text box
  }
}

canvas.addEventListener("mousemove", moveTextBox);
canvas.addEventListener("mouseup", dropTextBox);
canvas.addEventListener("click", addTextBox);
canvas.addEventListener("mousedown", startDrag);
