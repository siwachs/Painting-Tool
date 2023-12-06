let isAddingText = false;
const addTextBtn = document.getElementById("add-text-btn");

function openPrompt() {
  isAddingText = !isAddingText;

  if (isAddingText) {
    addTextBtn.textContent = "Cancel";
    addTextBtn.classList.remove("btn-primary");
    addTextBtn.classList.add("btn-danger");
    canvas.addEventListener("click", addText);
  } else {
    addTextBtn.textContent = "Add Text";
    addTextBtn.classList.remove("btn-danger");
    addTextBtn.classList.add("btn-primary");
    canvas.removeEventListener("click", addText);
  }
}

// Text Adding.
const canvas = document.getElementById("canvas");

function createTextBox(x, y, text) {
  const textBox = document.createElement("div");
  textBox.contentEditable = true;
  textBox.classList.add("editable-text");
  textBox.style.left = x + "px";
  textBox.style.top = y + "px";
  textBox.innerText = text;
  canvas.appendChild(textBox);
}

function addTextBox(event) {
  if (isAddingText && event.target === canvas) {
    const text = prompt("Enter text:");
    if (text !== null && text.trim() !== "") {
      createTextBox(event.clientX, event.clientY, text);
    }
  }
}

canvas.addEventListener("click", addTextBox);
