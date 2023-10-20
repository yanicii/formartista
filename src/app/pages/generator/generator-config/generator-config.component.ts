import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneratorOptions } from 'src/app/model/generator-options.model';

@Component({
  selector: 'generator-config',
  templateUrl: './generator-config.component.html',
  styleUrls: ['./generator-config.component.scss'],
})
export class GeneratorConfigComponent {
  fonts = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Courier New',
    'Brush Script MT',
  ];

  shapes = ['Heart', 'Star', 'Circle', 'Square', 'Triangle'];

  @Output() draw = new EventEmitter<GeneratorOptions>();
  @Output() download = new EventEmitter<void>();

  generatorSearchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.generatorSearchForm = this.formBuilder.group({
      font: ['Arial', Validators.required],
      shape: ['Heart', Validators.required],
      text: ['', Validators.required],
    });
  }
  
  onSubmit() {
    this.draw.emit(this.generatorSearchForm.value as GeneratorOptions);
  }

  onDownload() {
    this.download.emit();
  }
}
