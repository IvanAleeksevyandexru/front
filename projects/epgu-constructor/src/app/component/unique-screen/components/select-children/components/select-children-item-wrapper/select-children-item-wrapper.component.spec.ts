import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { By } from '@angular/platform-browser';

import { SelectChildrenItemWrapperComponent } from './select-children-item-wrapper.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';

describe('SelectChildrenItemWrapperComponent', () => {
  let component: SelectChildrenItemWrapperComponent;
  let fixture: ComponentFixture<SelectChildrenItemWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectChildrenItemWrapperComponent],
      imports: [RouterTestingModule, BaseModule, BaseComponentsModule],
      providers: [HealthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenItemWrapperComponent);
    component = fixture.componentInstance;
    component.hint = 'hint';
    component.idx = 1;
    component.isMoreThanOneChild = true;
    component.isSingleChild = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeChildEvent', () => {
    jest.spyOn(component.removeChildEvent, 'emit');
    component.removeChild();
    expect(component.removeChildEvent.emit).toHaveBeenCalled();
  });

  it('should call removeChild()', () => {
    jest.spyOn(component, 'removeChild');
    const debugEl = fixture.debugElement.query(By.css('.button-close'));
    debugEl.nativeElement.click();

    expect(component.removeChild).toHaveBeenCalled();
  });

  describe('close button', () => {
    it('should be show close button', () => {
      const debugEl = fixture.debugElement.query(By.css('.card__close'));

      expect(debugEl).toBeTruthy();
    });

    it('should be not show close button', () => {
      component.isMoreThanOneChild = false;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css('.card__close'));

      expect(debugEl).toBeTruthy();
    });
  });

  describe('card header', () => {
    it('should be show card header', () => {
      const debugEl = fixture.debugElement.query(By.css('.card__header'));

      expect(debugEl).toBeTruthy();
    });

    it('should be not show card header', () => {
      component.isSingleChild = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css('.card__header'));

      expect(debugEl).toBeTruthy();
    });
  });
});
