import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlikaczComponent } from './klikacz.component';

describe('KlikaczComponent', () => {
  let component: KlikaczComponent;
  let fixture: ComponentFixture<KlikaczComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlikaczComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlikaczComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
