import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleOcrComponent } from './sample-ocr.component';

describe('SampleOcrComponent', () => {
  let component: SampleOcrComponent;
  let fixture: ComponentFixture<SampleOcrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleOcrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleOcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
