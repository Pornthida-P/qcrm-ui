import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-call',
  templateUrl: './create-call.component.html',
  styleUrl: './create-call.component.scss'
})
export class CreateCallComponent {

  selectedDate: Date;

  constructor(private location: Location) {
    this.selectedDate = new Date();
   }

  prev() {
    this.location.back();
  }

  submit() {

  }

  // time = selectedDate;
  time = true;
  time1 = true;
  meridian = true;
  seconds = true;
  seconds1 = true;

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());


}
