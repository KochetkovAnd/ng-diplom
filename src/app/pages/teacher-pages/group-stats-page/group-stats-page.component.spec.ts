import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupStatsPageComponent } from './group-stats-page.component';

describe('GroupStatsPageComponent', () => {
  let component: GroupStatsPageComponent;
  let fixture: ComponentFixture<GroupStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupStatsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
