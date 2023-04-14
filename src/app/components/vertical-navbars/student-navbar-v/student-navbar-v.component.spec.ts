import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentNavbarVComponent } from './student-navbar-v.component';

describe('StudentNavbarVComponent', () => {
  let component: StudentNavbarVComponent;
  let fixture: ComponentFixture<StudentNavbarVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentNavbarVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentNavbarVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
