import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from './table-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [TableListComponent],
    imports: [CommonModule, FontAwesomeModule, MatTableModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatMenuModule],
    exports: [TableListComponent],
})
export class TableListModule {}
