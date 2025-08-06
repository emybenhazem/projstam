import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poste2Component } from './poste2.component';

describe('Poste2Component', () => {
  let component: Poste2Component;
  let fixture: ComponentFixture<Poste2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Poste2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Poste2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
