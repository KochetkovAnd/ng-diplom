import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditAdminPageComponent } from './group-edit-admin-page.component';

describe('GroupEditAdminPageComponent', () => {
  let component: GroupEditAdminPageComponent;
  let fixture: ComponentFixture<GroupEditAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEditAdminPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupEditAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
