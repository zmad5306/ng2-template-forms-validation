import { Component } from '@angular/core';

export class Account {
  constructor(public password: string, public confirmPassword: string) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  account: Account = new Account('', '');
  submit(): void {
    console.log(this.account);
  }
}
