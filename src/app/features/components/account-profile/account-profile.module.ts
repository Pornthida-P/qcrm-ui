import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './account-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [AccountProfileComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    exports: [AccountProfileComponent],
})
export class AccountProfileModule {}
