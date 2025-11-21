import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-call-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './call-list.component.html',
    styleUrl: './call-list.component.scss',
})
export class CallListComponent implements OnInit {
    currentPage = 1;
    totalPages = 1;
    pageSize = 15;
    pageSizeOptions = [10, 15, 20, 25, 50, 100];
    calls: any[] = [];
    pages: number[] = [];

    ngOnInit(): void {
        this.calculatePages();
    }

    pageChange(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.calculatePages();
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.calculatePages();
    }

    calculatePages() {
        this.totalPages = Math.ceil(this.calls.length / this.pageSize) || 1;
        this.pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            this.pages.push(i);
        }
    }

    get paginatedCalls(): any[] {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.calls.slice(start, end);
    }
}
