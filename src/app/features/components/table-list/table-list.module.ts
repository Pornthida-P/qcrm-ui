import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from './table-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [TableListComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltip,
        MatSelectModule,
        MatMenuModule,
        MatPaginatorModule,
    ],
    exports: [TableListComponent],
})
export class TableListModule {}
