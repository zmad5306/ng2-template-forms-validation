import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appMustMatch][ngModelGroup]',
  providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MustMatchDirective), multi: true }
    ]
})
export class MustMatchDirective implements Validator {

  @Input('appMustMatch') config: any;

  constructor() { }

  validate(c: FormGroup) {

    //get match case from config if it was passed
    let matchCase: boolean = true;
    if (this.config) {
      if (this.config.matchCase != null && this.config.matchCase != undefined) {
        if (this.config.matchCase === false) {
          matchCase = false;
        }
      }
    }

    const values = new Set();

    //add each value in the group to a set (will remove dupes)
    Object.keys(c.controls).forEach(key => {
      if (matchCase) {
        values.add(c.controls[key].value);
      }
      else {
        if (c.controls[key].value) {
          values.add(c.controls[key].value.toLowerCase());
        }
        else {
          values.add(c.controls[key].value);
        }
      }
    });

    //if the set has more than 1 there are dupes
    //thus validation will fail
    const valid: boolean = values.size <= 1;
    
    //loop over controls and set errors
    //sets errors on all controls in group, messages can be displayed as necessary
    Object.keys(c.controls).forEach(key => {

      //get the control
      let control = c.controls[key];

      //validation success
      if (valid) {
        //get the errors
        let errors = control.errors;
        
        //errors already has not matched, so remove it
        if (errors && errors.notMatched) {
          delete errors.notMatched;

          //there are still other errors, leave them
          if (Object.keys(errors).length > 0) {
            control.setErrors(errors); 
          }

          //no existing errors
          else {
            control.setErrors(null); 
          }
          
        }
      }

      //validation failed
      else {
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
    });

    //mark the group valid
    if (valid) {
      return null;
    }

    //mark the group invalid, messages can be displayed 
    //for the group as necessary
    else {
      return {notMatched: true};
    }
    
  }

}
