import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './account-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [AccountProfileComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule],
    exports: [AccountProfileComponent],
})
export class AccountProfileModule {}
