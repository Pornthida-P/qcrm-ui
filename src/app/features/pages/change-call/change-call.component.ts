import { Component, inject } from '@angular/core';
import { Location } from '@angular/common'
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-change-call',
  templateUrl: './change-call.component.html',
  styleUrl: './change-call.component.scss'
})
export class ChangeCallComponent {

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
