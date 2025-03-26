import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultaatComponent } from './resultaat.component';

describe('ResultaatComponent', () => {
  let component: ResultaatComponent;
  let fixture: ComponentFixture<ResultaatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultaatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultaatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
