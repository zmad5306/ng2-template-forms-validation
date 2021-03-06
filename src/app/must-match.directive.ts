import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormGroup, NgModel } from '@angular/forms';

function getMatchCase(config: any): boolean {
  let matchCase: boolean = true;
  if (config) {
    if (config.matchCase != null && config.matchCase != undefined) {
      if (config.matchCase === false) {
        matchCase = false;
      }
    }
  }
  return matchCase;
}

function getErrorTarget(config: any): AbstractControl {
  if (config) {
    if (config.errorTarget != null && config.errorTarget != undefined) {
      const errorTarget: NgModel = config.errorTarget;
      return errorTarget.control;
    }
  }

  return null;
}

function getValid(formGroup: FormGroup, matchCase: boolean): boolean {
  const values = new Set();

  //add each value in the group to a set (will only add matching values once)
  Object.keys(formGroup.controls).forEach(key => {
    if (matchCase) {
      values.add(formGroup.controls[key].value);
    }
    else {
      if (formGroup.controls[key].value) {
        values.add(formGroup.controls[key].value.toLowerCase());
      }
      else {
        values.add(formGroup.controls[key].value);
      }
    }
  });

  //if the set has more than 1 then there are multiple unique values
  //thus validation will fail
  return values.size <= 1;
}

function setControlValid(control: AbstractControl) {
  //get the errors
  let errors = control.errors;
  
  //errors already has not matched, so remove it
  if (errors && errors.notMatched) {
    delete errors.notMatched;

    //there are still other errors, leave them
    if (Object.keys(errors).length > 0) {
      control.setErrors(errors); 
    }

    //no other errors
    else {
      control.setErrors(null); 
    }
    
  }
}

function setControlInvalid(control: AbstractControl) {
  //get the errors
  let errors = control.errors;

  //if there are other errors add the notMatched error
  if (errors && Object.keys(errors).length > 0) {
    errors.notMatched = true;
  }
  //no other errors, build a new error object
  else {
    errors = {notMatched: true};
  }

  //set the errors on the control
  control.setErrors(errors); 
}

function setErrorsOnControls(formGroup: FormGroup, valid: boolean, errorTarget: AbstractControl) {
  if (errorTarget) {
    if (valid) {
      setControlValid(errorTarget);
    }
    else {
      setControlInvalid(errorTarget);
    }
  }
  else {
    //loop over controls and set errors
    //sets errors on all controls in group, messages can be displayed as necessary
    Object.keys(formGroup.controls).forEach(key => {
      //get the control
      let control = formGroup.controls[key];

      //validation success
      if (valid) {
        setControlValid(control);
      }

      //validation failed
      else {
        setControlInvalid(control);
        if(control.touched) {
          control.markAsDirty();
        }
      }
    });
  }
}

@Directive({
  selector: '[appMustMatch][ngModelGroup]',
  providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MustMatchDirective), multi: true }
    ]
})
export class MustMatchDirective implements Validator {

  @Input('appMustMatch') config: any;

  constructor() { }

  validate(formGroup: FormGroup) {

    const matchCase: boolean = getMatchCase(this.config);
    const errorTarget: AbstractControl = getErrorTarget(this.config);
    const valid: boolean = getValid(formGroup, matchCase);

    setErrorsOnControls(formGroup, valid, errorTarget);

    
    //mark the group invalid
    if (valid) {
      return null;    
    }
    
    //mark the group invalid
    return {notMatched: true};
  }

}
