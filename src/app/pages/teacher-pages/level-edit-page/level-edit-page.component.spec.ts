import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelEditPageComponent } from './level-edit-page.component';

describe('LevelEditPageComponent', () => {
  let component: LevelEditPageComponent;
  let fixture: ComponentFixture<LevelEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelEditPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
