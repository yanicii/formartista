import { Injectable } from '@angular/core';
import { GeneratorOptions } from '../model/generator-options.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeWriterService {

  private FONT_SIZE_STEPS = 0.1;
  private PIXEL_ACCURACY = 1;
  private SVG_ID = 'shape_svg';
  private SVG_PATH_ID = 'shape_path';
  private TEXT_BOX_1_ID = 'text-box-1';
  private TEXT_BOX_2_ID = 'text-box-2';
  private FORMATISTA_SPACE = 'formartista-space';
  private INITIAL_AREA_MULTIPLIER = 1;

  font = "";
  text = "";
  shape = "";
  sizeFactor = 0;

  draw(generatorOptions: GeneratorOptions) {
    console.log('Draw', generatorOptions);
    const startDate = Date.now();
    this.removeAllRows()
    this.font = generatorOptions.font;
    this.text = generatorOptions.text.replace(/\n/g, ' ').replace('<br>', ' ').trim();
    this.shape = generatorOptions.shape;
    this.sizeFactor = generatorOptions.sizeFactor;
    const heightAndWidth = this.getHeightAndWidthOfSvg();
    const fontSize = this.calculateInitialFontSize();
    this.drawShape(fontSize, heightAndWidth);
    console.log(`Filling SVG took ${Date.now() - startDate} ms`);
  }

  removeAllRows() {
    while (document.getElementsByClassName('shape-row').length > 0) {
      document.getElementsByClassName('shape-row')[0].remove();
    }
  }

  private calculateAreaOfPolygon(points: any) {
    if (points.length < 3) {
      return 0;
    }
    let area = 0,
      n = points.length;
    for (let i = 0; i < n - 1; i++) {
      area += points[i].x * points[i + 1].y;
      area -= points[i + 1].x * points[i].y;
    }
    area += points[n - 1].x * points[0].y;
    area -= points[0].x * points[n - 1].y;
    return Math.abs(area) / 2;
  }

  private convertPathToPolygon(pathId: string) {
    const pathElem = document.getElementById(pathId) as any;
    const pathLen = pathElem.getTotalLength();
    const numSteps = Math.floor(pathLen * 2);
    const points = [];
    for (let i = 0; i < numSteps; i++) {
      const point = pathElem.getPointAtLength((i * pathLen) / numSteps);
      points.push(point);
    }
    return points;
  }

  private calculateInitialFontSize() {
    const textBox = document.getElementById(this.TEXT_BOX_1_ID)!!;
    textBox.innerHTML = this.text;
    textBox.style.fontFamily = this.font;
    const area = this.calculateAreaOfPolygon(
      this.convertPathToPolygon(this.SVG_PATH_ID)
    );
    const boxSize = Math.sqrt(area * this.INITIAL_AREA_MULTIPLIER);
    textBox.style.width = `${boxSize}px`;
    textBox.style.height = `${boxSize}px`;
    let textFits = true;
    let fontSize = 1;
    textBox.style.fontSize = `${fontSize}px`;
    while (textFits) {
      textFits = textBox.offsetHeight === textBox.scrollHeight;
      if (textFits) {
        fontSize = fontSize + this.FONT_SIZE_STEPS;
        textBox.style.fontSize = `${fontSize}px`;
      } else {
        fontSize = fontSize - this.FONT_SIZE_STEPS;
      }
    }
    console.log(`InitialFontSize: ${fontSize}`);
    return fontSize;
  }

  private calculateRowHeight(fontSize: number) {
    const textBox = document.getElementById(this.TEXT_BOX_2_ID)!!;
    textBox.style.fontSize = `${fontSize}px`;
    return textBox.offsetHeight;
  }

  private getHeightAndWidthOfSvg() {
    const svg = (document.getElementById(this.SVG_ID)!! as any).getBBox();
    return {
      height: svg.height,
      width: svg.width,
    };
  }

  private createRowElement(x: number, y: number, rowLength: number) {
    return {
      x: x - rowLength,
      width: rowLength,
      y: y,
    };
  }

  private getTextRows(height: number, width: number, rowHeight: number) {
    const heart = document.getElementById(this.SVG_PATH_ID) as any;
    const svg = document.getElementById(this.SVG_ID)!! as any;
    const point = svg.createSVGPoint();

    const rows = [];
    let currentRowLength;

    for (let y = 0; y < height; y = y + rowHeight) {
      currentRowLength = 0;
      for (let x = 0; x < width; x = x + this.PIXEL_ACCURACY) {
        point.x = x;
        point.y = y;
        if (heart.isPointInFill(point)) {
          currentRowLength = currentRowLength + this.PIXEL_ACCURACY;
          if (x + this.PIXEL_ACCURACY >= width) {
            rows.push(this.createRowElement(x, y, currentRowLength));
          }
        } else {
          if (currentRowLength > 0) {
            rows.push(this.createRowElement(x, y, currentRowLength));
            currentRowLength = 0;
          }
        }
      }
    }
    return rows;
  }

  private addTextRow(row: any, text: string, fontSize: number) {
    const div = document.createElement('div') as any;
    div.style.position = 'absolute';
    div.style.top = `${row.y * this.sizeFactor}px`;
    div.style.left = `${row.x * this.sizeFactor}px`;
    div.style.width = `${row.width * this.sizeFactor}px`;
    div.style.fontSize = `${fontSize * this.sizeFactor}px`;
    div.style.fontFamily = this.font;
    div.style.textAlign = text.split(' ').length > 1 ? 'justify' : 'center';
    div.classList = ['shape-row'];
    div.innerText = text;
    const subDiv = document.createElement('div') as any;
    subDiv.classList = ['spacer'];
    div.appendChild(subDiv);
    document.getElementById("formartista-space")!!.append(div);
  }

  private fillRows(textRows: any[], fontSize: number) {
    const textBox2 = document.getElementById(this.TEXT_BOX_2_ID) as any;
    let textSnippets = this.text.split(' ').filter((snippet) => !!snippet);
    for (let row of textRows) {
      let currentText = '';
      let currentWidth = 0;
      let textFits = true;
      while (textFits) {
        const newSnippet = textSnippets[0];
        textBox2.innerHTML = 'X' + newSnippet;
        currentWidth = currentWidth + textBox2.offsetWidth;
        textFits = currentWidth < row.width;
        if (textFits && textSnippets.length > 0) {
          const newWord = textSnippets[0];
          currentText =
            currentText === '' ? newWord : currentText + ' ' + newWord;
          textSnippets = textSnippets.slice(1, textSnippets.length);
        } else {
          if (currentText !== '') {
            this.addTextRow(row, currentText, fontSize);
          }
        }
      }
    }
    return textSnippets;
  }

  private drawShape(initialFontSize: number, heightAndWidth: any) {
    console.log('Draw shape', initialFontSize, heightAndWidth);
    const formartistaSpace = document.getElementById(this.FORMATISTA_SPACE)!!;
    formartistaSpace.style.height = `${heightAndWidth.height * this.sizeFactor}px`;
    formartistaSpace.style.width = `${heightAndWidth.width * this.sizeFactor}px`;
    let textFits = false;
    let fontSize = initialFontSize;

    do {
      const rowHeight = this.calculateRowHeight(fontSize);
      const textRows = this.getTextRows(
        heightAndWidth.height,
        heightAndWidth.width,
        rowHeight
      );
      const missingWords = this.fillRows(textRows, fontSize).length;
      textFits = missingWords === 0;
      if (!textFits) {
        fontSize = fontSize - this.FONT_SIZE_STEPS;
        this.removeAllRows();
      }
    } while (!textFits);
  }
}
