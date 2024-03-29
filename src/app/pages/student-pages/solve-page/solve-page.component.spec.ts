import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvePageComponent } from './solve-page.component';

describe('SolvePageComponent', () => {
  let component: SolvePageComponent;
  let fixture: ComponentFixture<SolvePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolvePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolvePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
