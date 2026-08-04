import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountProfileComponent } from './account-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [AccountProfileComponent],
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgbModule, TranslateModule],
    exports: [AccountProfileComponent],
})
export class AccountProfileModule {}
