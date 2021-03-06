import { Component } from '@angular/core';

export class Account {
  constructor(
    public password: string, 
    public confirmPassword: string, 
    public email: string, 
    public confirmEmail: string
  ) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng2 Multiple Field Validations';
  account: Account = new Account('', '', '', '');
  submit(): void {
    console.log(this.account);
  }
}
