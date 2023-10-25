import { Component } from '@angular/core';
import domtoimage from 'dom-to-image-more';
import { GeneratorOptions } from 'src/app/model/generator-options.model';
import { ShapeWriterService } from 'src/app/service/shape-writer.service';

@Component({
  selector: 'generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent {

  shape = "";

  constructor(private shapeWriterService: ShapeWriterService) {}


  draw(generatorOptions: GeneratorOptions) {
    this.shape = generatorOptions.shape;
    this.shapeWriterService.draw(generatorOptions)
  }

  downloadFile() {
    const shape = this.shape;
    domtoimage.toPng(document.getElementById('formartista-space')!!, { quality: 0.95 })
    .then(function (dataUrl: any) {
        var link = document.createElement('a');
        link.download = `${shape}-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
    });
  }

  
}
