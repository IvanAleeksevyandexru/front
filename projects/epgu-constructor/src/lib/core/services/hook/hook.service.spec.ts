import { TestBed } from '@angular/core/testing';

import { HookService } from './hook.service';
import { HookTypes } from './hook.constants';
import { of } from 'rxjs';

describe('HookServiceService', () => {
  let service: HookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add hooks', () => {
    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();

    service.addHook(HookTypes.ON_BEFORE_SUBMIT, of(null));

    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeTruthy();
  });

  it('should return hooks', () => {
    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();

    service.addHook(HookTypes.ON_BEFORE_SUBMIT, of(null));

    expect(service.getHooks(HookTypes.ON_BEFORE_SUBMIT).length).toBe(1);
  });

  it('should clear all hooks', () => {
    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();

    service.addHook(HookTypes.ON_BEFORE_SUBMIT, of(null));
    service.clearHooks();

    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();
  });

  it('should clear specific hooks', () => {
    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();

    service.addHook(HookTypes.ON_BEFORE_SUBMIT, of(null));
    service.clearHook(HookTypes.ON_BEFORE_SUBMIT);

    expect(service.hasHooks(HookTypes.ON_BEFORE_SUBMIT)).toBeFalsy();
  });
});
