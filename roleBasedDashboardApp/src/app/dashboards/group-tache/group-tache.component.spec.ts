import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTacheComponent } from './group-tache.component';

describe('GroupTacheComponent', () => {
  let component: GroupTacheComponent;
  let fixture: ComponentFixture<GroupTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTacheComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
