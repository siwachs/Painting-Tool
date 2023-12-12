const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const header = document.getElementById("header");
const addTextBtn = document.getElementById("add-text-btn");
const editTextBtn = document.getElementById("edit-text-btn");
const contextMenu = document.getElementById("context-menu");
const drawingElements = [];

class TextBox {
  constructor(x, y, text, textColor, fontSize, font) {
    this.x = x;
    this.y = y;
    this.text = text || "Edit me";
    this.textColor = textColor || "#000000";
    this.fontSize = fontSize || "22";
    this.font = font || "sans-serif";
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

  static delete(index) {
    drawingElements.splice(index, 1);
    drawPage();
    contextMenu.classList.remove("active");
  }

  static changeColor(index) {
    const textBox = drawingElements[index];
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.addEventListener("input", function (event) {
      textBox.textColor = event.target.value;
      drawPage();
    });

    colorPicker.click();
    drawPage();
    contextMenu.classList.remove("active");
  }

  static changeFontSize(index) {
    const fontSize = prompt();
    if (
      !isNaN(parseFloat(fontSize)) &&
      isFinite(fontSize) &&
      fontSize > 0 &&
      fontSize <= 256 &&
      fontSize !== null &&
      fontSize.trim() !== ""
    ) {
      drawingElements[index].fontSize = fontSize;
      drawPage();
    }

    contextMenu.classList.remove("active");
  }
}

function setCanvasSize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight - header.offsetHeight;
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
    const mouseY = event.clientY - header.offsetHeight;
    const text = prompt("Enter text:");
    if (text !== null && text.trim() !== "") {
      const textBox = new TextBox(mouseX, mouseY, text);

      drawingElements.push(textBox);
      toggleAddText();
      drawPage();
    }
  }

  if (isEditText) {
    const mouseX = event.clientX;
    const mouseY = event.clientY - header.offsetHeight;

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

  contextMenu.classList.remove("active");
});

function generateContextMenu(index) {
  contextMenu.innerHTML = `<div class="context-item" onclick="TextBox.delete(${index})"><i class="fas fa-trash"></i> Delete</div>`;
  contextMenu.innerHTML += `<hr>`;
  contextMenu.innerHTML += `<div class="context-item" onclick="TextBox.changeColor(${index})"><i class="fas fa-adjust"></i> Change Color <input type="color" id="colorPicker" hidden="true" /></div>`;
  contextMenu.innerHTML += `<div class="context-item" onclick="TextBox.changeFontSize(${index})"><i class="fas fa-text-height"></i> Change Font Size</div>`;
}

canvas.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  const mouseX = event.clientX;
  const mouseY = event.clientY - header.offsetHeight;

  for (let i = drawingElements.length - 1; i >= 0; i--) {
    if (drawingElements[i].isClicked(mouseX, mouseY)) {
      generateContextMenu(i);

      const textWidth = ctx.measureText(drawingElements[i].text).width;
      const textHeight = parseInt(drawingElements[i].fontSize);

      const textBottomRightX = drawingElements[i].x + textWidth;
      const textBottomRightY = drawingElements[i].y + textHeight + 40;

      contextMenu.style.top = textBottomRightY + "px";
      contextMenu.style.left = textBottomRightX + "px";
      contextMenu.classList.add("active");

      return;
    }
  }
});

function drawPage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingElements.forEach((item) => {
    item.draw();
  });
}

// Drag and drop text
let isDragging = false;
let selectedElementIndex = -1;
let offsetX, offsetY;

canvas.addEventListener("mousedown", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY - header.offsetHeight;

  for (let i = drawingElements.length - 1; i >= 0; i--) {
    if (drawingElements[i].isClicked(mouseX, mouseY)) {
      isDragging = true;
      selectedElementIndex = i;
      offsetX = mouseX - drawingElements[i].x; // Calculate the offset between the mouse click and the text element's X coordinate.
      offsetY = mouseY - drawingElements[i].y; // Calculate the offset between the mouse click and the text element's Y coordinate.
      return;
    }
  }
});

canvas.addEventListener("mousemove", function (event) {
  if (isDragging && selectedElementIndex !== -1) {
    const mouseX = event.clientX;
    const mouseY = event.clientY - header.offsetHeight;

    // Calculate the new position within the canvas boundaries
    let newX = mouseX - offsetX;
    let newY = mouseY - offsetY;

    // Ensure the text element stays within the canvas boundaries
    newX = Math.max(
      0,
      Math.min(
        newX,
        canvas.width -
          ctx.measureText(drawingElements[selectedElementIndex].text).width
      )
    );
    newY = Math.max(0, Math.min(newY, canvas.height));

    drawingElements[selectedElementIndex].x = newX;
    drawingElements[selectedElementIndex].y = newY;

    drawPage();
  }
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
  selectedElementIndex = -1;
});
