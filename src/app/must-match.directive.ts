import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appMustMatch][ngModelGroup]',
  providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MustMatchDirective), multi: true }
    ]
})
export class MustMatchDirective implements Validator {

  constructor() { }

  validate(c: FormGroup) {
    let valid = true;
    //this fires before the form is done and throws an error becuase the input fields aren't built
    if (c.contains('password') && c.contains('confirmPassword')) {
      if (c.controls.password.value !== c.controls.confirmPassword.value) {
        valid = false;
        c.controls.confirmPassword.setErrors({notMatched: true});
      }
      else {
        c.controls.confirmPassword.setErrors(null);
      }
    }

    if (!valid) {
      return {notMatched: true};
    }
    else {
      return null;
    }
    
  }

}
