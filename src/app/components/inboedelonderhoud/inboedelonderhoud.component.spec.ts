import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboedelonderhoudComponent } from './inboedelonderhoud.component';

describe('InboedelonderhoudComponent', () => {
  let component: InboedelonderhoudComponent;
  let fixture: ComponentFixture<InboedelonderhoudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboedelonderhoudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboedelonderhoudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
