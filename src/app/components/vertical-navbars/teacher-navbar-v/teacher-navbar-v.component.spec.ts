import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherNavbarVComponent } from './teacher-navbar-v.component';

describe('TeacherNavbarVComponent', () => {
  let component: TeacherNavbarVComponent;
  let fixture: ComponentFixture<TeacherNavbarVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherNavbarVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherNavbarVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
