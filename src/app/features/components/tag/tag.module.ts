import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { RouterModule } from '@angular/router';
import { TagListModule } from '../tag-list/tag-list.module';

@NgModule({
    declarations: [TagComponent],
    imports: [
        CommonModule,
        TagListModule,
        RouterModule.forChild([
            {
                path: '',
                component: TagComponent,
            },
        ]),
    ],
    exports: [TagComponent],
})
export class TagModule {}
