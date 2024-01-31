import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-announce-list',
    templateUrl: './announce-list.component.html',
    styleUrl: './announce-list.component.scss',
})
export class AnnounceListComponent implements OnInit {
    @Input() cards: any[] = [];

    ngOnInit(): void {}
}
