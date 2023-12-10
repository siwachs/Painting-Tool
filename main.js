const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const addTextBtn = document.getElementById("add-text-btn");
const editTextBtn = document.getElementById("edit-text-btn");
const drawingElements = [];

class TextBox {
  constructor(x, y, text, textColor, fontSize, font) {
    this.x = x;
    this.y = y;
    this.text = text || "Edit me";
    this.textColor = textColor || "#000000";
    this.fontSize = fontSize || "16";
    this.font = font || "Arial";
  }

  draw() {
    ctx.fillStyle = this.textColor;
    ctx.font = this.fontSize + "px " + this.font;
    ctx.fillText(this.text, this.x, this.y);
  }

  isClicked(mouseX, mouseY) {
    const textWidth = ctx.measureText(this.text).width;
    const textHeight = parseInt(this.fontSize);
    return (
      mouseX >= this.x &&
      mouseX <= this.x + textWidth &&
      mouseY >= this.y - textHeight &&
      mouseY <= this.y
    );
  }
}

function setCanvasSize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight - document.querySelector("header").offsetHeight;
  drawPage();
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

let isAddText = false;
let isEditText = false;

function toggleAddText() {
  if (isEditText) {
    isEditText = false;
    editTextBtn.textContent = "Edit Text";
    editTextBtn.classList.remove("btn-danger");
    editTextBtn.classList.add("btn-primary");
  }

  isAddText = !isAddText;

  if (isAddText) {
    addTextBtn.textContent = "Cancel";
    addTextBtn.classList.add("btn-danger");
    addTextBtn.classList.remove("btn-primary");
  } else {
    addTextBtn.textContent = "Add Text";
    addTextBtn.classList.remove("btn-danger");
    addTextBtn.classList.add("btn-primary");
  }
}

function toggleEditText() {
  if (isAddText) {
    isAddText = false;
    addTextBtn.textContent = "Add Text";
    addTextBtn.classList.remove("btn-danger");
    addTextBtn.classList.add("btn-primary");
  }

  isEditText = !isEditText;

  if (isEditText) {
    editTextBtn.textContent = "Cancel";
    editTextBtn.classList.add("btn-danger");
    editTextBtn.classList.remove("btn-primary");
  } else {
    editTextBtn.textContent = "Edit Text";
    editTextBtn.classList.remove("btn-danger");
    editTextBtn.classList.add("btn-primary");
  }
}

canvas.addEventListener("click", function (event) {
  if (isAddText) {
    const mouseX = event.clientX;
    const mouseY =
      event.clientY - document.querySelector("header").offsetHeight;
    const text = prompt("Enter text:");
    if (text !== null && text.trim() !== "") {
      const textBox = new TextBox(
        mouseX,
        mouseY,
        text,
        "#000000",
        "18",
        "Arial"
      );

      drawingElements.push(textBox);
      toggleAddText();
      drawPage();
    }
  }

  if (isEditText) {
    const mouseX = event.clientX;
    const mouseY =
      event.clientY - document.querySelector("header").offsetHeight;

    for (let i = drawingElements.length - 1; i >= 0; i--) {
      if (drawingElements[i].isClicked(mouseX, mouseY)) {
        const newText = prompt("Update the text:", drawingElements[i].text);
        if (newText !== null && newText.trim() !== "") {
          drawingElements[i].text = newText;
          toggleEditText();
          drawPage();
        }

        return;
      }
    }

    toggleEditText();
  }
});

canvas.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  const mouseX = event.clientX;
  const mouseY = event.clientY - document.querySelector("header").offsetHeight;
});

function drawPage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingElements.forEach((item) => {
    item.draw();
  });
}
