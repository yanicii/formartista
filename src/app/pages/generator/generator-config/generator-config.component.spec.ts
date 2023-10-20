import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorConfigComponent } from './generator-config.component';

describe('GeneratorSearchComponent', () => {
  let component: GeneratorConfigComponent;
  let fixture: ComponentFixture<GeneratorConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratorConfigComponent]
    });
    fixture = TestBed.createComponent(GeneratorConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
