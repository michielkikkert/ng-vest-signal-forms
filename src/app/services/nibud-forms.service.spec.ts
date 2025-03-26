import { TestBed } from '@angular/core/testing';

import { NibudFormsService } from './nibud-forms.service';

describe('NibudFormsService', () => {
  let service: NibudFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NibudFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
