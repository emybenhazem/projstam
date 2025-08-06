import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poste1Component } from './poste1.component';

describe('Poste1Component', () => {
  let component: Poste1Component;
  let fixture: ComponentFixture<Poste1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Poste1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Poste1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
