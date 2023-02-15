import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationPageComponent } from './examination-page.component';

describe('ExaminationPageComponent', () => {
  let component: ExaminationPageComponent;
  let fixture: ComponentFixture<ExaminationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
