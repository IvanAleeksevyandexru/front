import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { AgeType, Gender, UserInfoType } from './user-info.type';
import { ConfigService, TypeHelperService } from '@epgu/epgu-constructor-ui-kit';

import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  const mockMaleValue: UserInfoType = {
    name: 'Name',
    ageText: 'ageText',
    gender: Gender.M,
    ageType: AgeType.MATURE,
  };
  const mockFemaleValue: UserInfoType = {
    name: 'Name',
    ageText: 'ageText',
    gender: Gender.F,
    ageType: AgeType.MATURE,
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      providers: [TypeHelperService, { provide: ConfigService, useClass: ConfigServiceStub }],
    })
      .overrideComponent(UserInfoComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    component.value = mockMaleValue;
    fixture.detectChanges();
  });

  it('should be text info', () => {
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-text'))
      ?.nativeElement;

    expect(div).not.toBeNull();
    expect(div.innerHTML?.indexOf('Name, ageText')).not.toBe(-1);
  });

  it('should be male icon', () => {
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-icon'))
      ?.nativeElement;
    expect(div).not.toBeNull();
    expect(div.getAttribute('src').indexOf('male-child.svg')).not.toBe(-1);
  });

  it('should be female icon', () => {
    component.value = mockFemaleValue;
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-icon'))
      ?.nativeElement;
    expect(div).not.toBeNull();
    expect(div?.getAttribute('src')?.indexOf('female-child.svg')).not.toBe(-1);
  });
});
