import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationPersonalProfile } from './registration-personal-profile';

describe('RegistrationPersonalProfile', () => {
  let component: RegistrationPersonalProfile;
  let fixture: ComponentFixture<RegistrationPersonalProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPersonalProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPersonalProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields and default country', () => {
    expect(component.form.value.firstName).toBe('');
    expect(component.form.value.lastName).toBe('');
    expect(component.form.value.country).toBe('United States');
  });

  it('should emit skipped when onSkip is called', () => {
    const spy = jasmine.createSpy('skipped');
    component.skipped.subscribe(spy);
    component.onSkip();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled when onCancel is called', () => {
    const spy = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(spy);
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit next with form value when onNext is called', () => {
    const spy = jasmine.createSpy('next');
    component.next.subscribe(spy);
    component.form.patchValue({ firstName: 'Elena', lastName: 'Kovac' });
    component.onNext();
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ firstName: 'Elena', lastName: 'Kovac' }));
  });
});
