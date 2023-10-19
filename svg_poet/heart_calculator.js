const FONT_SIZE_STEPS = 0.1;
const PIXEL_ACCURACY = 1;
const SVG_ID = "shape_svg";
const SVG_PATH_ID = "shape_path";
const TEXT_BOX_1_ID = "text-box-1";
const TEXT_BOX_2_ID = "text-box-2";
const INITIAL_AREA_MULTIPLIER = 1;
const SIZE_FACTOR = 1;
const startDate = Date.now();

function calculateAreaOfPolygon(points) {
  if (points.length < 3) {
    return 0;
  }
  let area = 0, n = points.length;
  for (let i = 0; i < (n - 1); i++) {
    area += points[i].x * points[i + 1].y;
    area -= points[i + 1].x * points[i].y;
  }
  area += points[n - 1].x * points[0].y;
  area -= points[0].x * points[n - 1].y;
  return Math.abs(area) / 2;
}

function convertPathToPolygon(pathId) {
  const pathElem = document.getElementById(pathId);
  const pathLen = pathElem.getTotalLength();
  const numSteps = Math.floor(pathLen * 2);
  const points = [];
  for (let i = 0; i < numSteps; i++) {
    const p = pathElem.getPointAtLength(i * pathLen / numSteps);
    points.push(p);
  }
  return points;
}

function calculateInitialFontSize() {
  const textBox = document.getElementById(TEXT_BOX_1_ID);
  const area = calculateAreaOfPolygon(convertPathToPolygon(SVG_PATH_ID));
  const boxSize = Math.sqrt(area * INITIAL_AREA_MULTIPLIER);
  textBox.style.width = `${boxSize}px`;
  textBox.style.height = `${boxSize}px`;
  let textFits = true;
  let fontSize = 1;
  while (textFits) {
    textFits = textBox.offsetHeight === textBox.scrollHeight;
    if (textFits) {
      fontSize = fontSize + FONT_SIZE_STEPS;
      textBox.style.fontSize = `${fontSize}px`;
    } else {
      fontSize = fontSize - FONT_SIZE_STEPS;
    }
  }
  return fontSize;
}

function calculateRowHeight(fontSize) {
  const textBox = document.getElementById(TEXT_BOX_2_ID);
  textBox.style.fontSize = `${fontSize}px`;
  return textBox.offsetHeight;
}

function getHeightAndWidthOfSvg() {
  const svg = document.getElementById(SVG_ID).getBBox();
  return {
    height: svg.height,
    width: svg.width
  }
}

function createRowElement(x, y, rowLength) {
  return {
    x: x - rowLength,
    width: rowLength,
    y: y
  }
}

function getTextRows(height, width, rowHeight) {
  const heart = document.getElementById(SVG_PATH_ID);
  const svg = document.getElementById(SVG_ID);
  const point = svg.createSVGPoint();

  const rows = [];
  let currentRowLength;

  for (let y = 0; y < height; y = y + rowHeight) {
    currentRowLength = 0;
    for (let x = 0; x < width; x = x + PIXEL_ACCURACY) {
      point.x = x;
      point.y = y;
      if (heart.isPointInFill(point)) {
        currentRowLength = currentRowLength + PIXEL_ACCURACY;
        if ((x + PIXEL_ACCURACY) >= width) {
          rows.push(createRowElement(x, y, currentRowLength));
        }
      } else {
        if (currentRowLength > 0) {
          rows.push(createRowElement(x, y, currentRowLength));
          currentRowLength = 0;
        }
      }
    }
  }
  return rows;
}

function addTextRow(row, text, fontSize) {
  const div = document.createElement("div");
  div.style.position = "absolute"
  div.style.top = `${row.y * SIZE_FACTOR}px`;
  div.style.left = `${row.x * SIZE_FACTOR}px`;
  div.style.width = `${row.width * SIZE_FACTOR}px`;
  div.style.fontSize = `${fontSize* SIZE_FACTOR}px`;
  div.style.textAlign = text.split(" ").length > 1 ? 'justify' : 'center';
  div.classList = ['shape-row'];
  div.innerText = text;
  const subDiv = document.createElement("div");
  subDiv.classList = ["spacer"];
  div.appendChild(subDiv);
  document.body.append(div);
}

function removeAllRows() {
  while (document.getElementsByClassName('shape-row').length > 0) {
    document.getElementsByClassName('shape-row')[0].remove();
  }
}

function fillRows(textRows, fontSize) {
  const textBox2 = document.getElementById(TEXT_BOX_2_ID);
  let textSnippets = document.getElementById(TEXT_BOX_1_ID).innerText.split(' ').filter(snippet => !!snippet);
  for (let row of textRows) {
    let currentText = "";
    let currentWidth = 0;
    let textFits = true;
    while (textFits) {
      const newSnippet = textSnippets[0];
      textBox2.innerText = "x" + newSnippet;
      currentWidth = currentWidth + textBox2.offsetWidth;
      textFits = currentWidth < row.width;
      if (textFits && textSnippets.length > 0) {
        const newWord = textSnippets[0];
        currentText = currentText === "" ? newWord : currentText + " " + newWord;
        textSnippets = textSnippets.slice(1, textSnippets.length);
      } else {
        if (currentText !== "") {
          addTextRow(row, currentText, fontSize);
        }
      }
    }
  }
  return textSnippets;
}

function drawShape(initialFontSize, heightAndWidth) {
  let textFits = false;
  let fontSize = initialFontSize;
  do {
    const rowHeight = calculateRowHeight(fontSize);
    const textRows = getTextRows(heightAndWidth.height, heightAndWidth.width, rowHeight);
    const missingWords = fillRows(textRows, fontSize).length;
    textFits = missingWords === 0;
    console.log(missingWords, fontSize);
    if (!textFits) {
      fontSize = fontSize - FONT_SIZE_STEPS;
      removeAllRows();
    }
  } while (!textFits);

}

const heightAndWidth = getHeightAndWidthOfSvg();
console.log(`SVG-Height: ${heightAndWidth.height} SVG-Width: ${heightAndWidth.width}`)
const fontSize = calculateInitialFontSize();
console.log(`InitialFontSize: ${fontSize}`)
drawShape(fontSize, heightAndWidth);
console.log(`Filling SVG took ${Date.now() - startDate} ms`);
