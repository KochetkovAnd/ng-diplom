import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAdminPageComponent } from './groups-admin-page.component';

describe('GroupsAdminPageComponent', () => {
  let component: GroupsAdminPageComponent;
  let fixture: ComponentFixture<GroupsAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsAdminPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
