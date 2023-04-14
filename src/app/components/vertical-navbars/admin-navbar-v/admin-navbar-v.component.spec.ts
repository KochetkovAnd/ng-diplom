import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarVComponent } from './admin-navbar-v.component';

describe('AdminNavbarVComponent', () => {
  let component: AdminNavbarVComponent;
  let fixture: ComponentFixture<AdminNavbarVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNavbarVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNavbarVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
