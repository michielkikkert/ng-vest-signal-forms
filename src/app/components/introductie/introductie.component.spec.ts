import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductieComponent } from './introductie.component';

describe('IntroductieComponent', () => {
  let component: IntroductieComponent;
  let fixture: ComponentFixture<IntroductieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
