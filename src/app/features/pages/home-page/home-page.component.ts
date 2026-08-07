import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CallService } from 'src/app/services/call/call.service';
import * as moment from 'moment';
import { User } from 'src/app/shared/interface/user.interface';
import { UserService } from 'src/app/services/user/user.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { StatusService } from 'src/app/services/status/status.service';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { TranslateService } from '@ngx-translate/core';
import { chartPalette } from 'src/app/shared/theme/colors';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    cases: any[] = [];
    allCases: any[] = []; // เก็บข้อมูลทั้งหมดสำหรับคำนวณตัวเลข
    filteredCases: any[] = [];
    searchText: string = '';
    selectedStatus: string = '';
    userData: User | null = null;
    pageSizeOptions = [5, 10, 15];
    pageSize = 5;
    pages: number[] = [];
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;
    createdById = '';
    selectedCaseTopic = '';
    selectedCaseChannel = '';
    dateFilterType: string = 'toDay';
    dateRangeStart: string = '';
    dateRangeEnd: string = '';
    dateRangeForm!: FormGroup;
    filterDateOptions: { name: string; type: string }[] = [];
    caseTopicList: any[] = [];
    caseChannelList: any[] = [];
    caseChannel: any[] = [];
    caseTopic: any[] = [];
    contactCount: number = 0;
    caseChannelCount: number = 0;
    caseTopicCount: number = 0;
    channelPercentage: any[] = [];
    statusList: any[] = [];
    allContactCount: number = 0;
    statusListLoaded: boolean = false;
    agentWorkload: any[] = [];
    isAdmin: boolean = false;

    valueSearch: string = '';

    private searchTimeout: any;
    private langChangeSub: any;
    updateFlag: boolean = false;

    Highcharts: typeof Highcharts = Highcharts;
    caseChartOptions: Highcharts.Options = {
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                borderWidth: 0,
                size: '100%',
                colorByPoint: true,
                dataLabels: {
                    enabled: false,
                    crop: false,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16px',
                    },
                },
            } as any,
        },
        colors: [...chartPalette],
        series: [
            {
                type: 'pie',
                name: '',
                data: [],
            },
        ],
    };

    contactChartOptions: Highcharts.Options = {
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            categories: ['001-ติดตามผล', '002-ประสานงาน', '003-อื่นๆ'],
            crosshair: true,
            accessibility: {
                description: 'Countries',
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
            },
        },
        tooltip: {
            valueSuffix: '',
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
        },
        colors: [...chartPalette],
        series: [
            {
                name: '',
                type: 'column',
                colorByPoint: true,
                data: [],
            },
        ],
    };

    constructor(
        private callService: CallService,
        private userService: UserService,
        private contactService: ContactsService,
        public statusService: StatusService,
        private callListService: CallListService,
        private router: Router,
        private translate: TranslateService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        // Set chart name with translation
        (this.caseChartOptions.series as any)[0].name = this.translate.instant('chart.totalCases');
        (this.contactChartOptions.yAxis as any).title.text = this.translate.instant('chart.contactCount');
        (this.contactChartOptions.series as any)[0].name = this.translate.instant('chart.count');
        (this.contactChartOptions.tooltip as any).valueSuffix = ` (${this.translate.instant('dashboard.contact')})`;

        this.getDataUser();
        this.updateFilterDateOptions();
        this.langChangeSub = this.translate.onLangChange.subscribe(() => this.updateFilterDateOptions());
        this.dateRangeForm = this.fb.group({
            startDate: [''],
            endDate: [''],
        });
        this.dateRangeForm.get('startDate')?.valueChanges.subscribe((value) => {
            this.dateRangeStart = value ? moment(value).format('YYYY-MM-DD') : '';
            this.onDateRangeChange();
        });
        this.dateRangeForm.get('endDate')?.valueChanges.subscribe((value) => {
            this.dateRangeEnd = value ? moment(value).format('YYYY-MM-DD') : '';
            this.onDateRangeChange();
        });
        this.getCaseTopics();
        this.getCaseChannel();
        this.initChart(this.caseChannel, this.caseTopic);
        this.getAllContactCount();
    }

    ngOnDestroy(): void {
        if (this.langChangeSub) {
            this.langChangeSub.unsubscribe();
        }
    }

    private updateFilterDateOptions(): void {
        this.filterDateOptions = [
            { name: this.translate.instant('filter.today'), type: 'toDay' },
            { name: this.translate.instant('filter.thisWeek'), type: 'thisWeek' },
            { name: this.translate.instant('filter.thisMonth'), type: 'thisMonth' },
            { name: this.translate.instant('filter.customDate'), type: 'custom' },
        ];
    }

    initChart(caseChannelCount: any[], caseTopicCount: any[]) {
        (this.caseChartOptions.series as any)[0].data = caseChannelCount.map((item) => ({
            name: item.name,
            y: item.value,
            color: this.statusService.getChannelBgColor(item.name),
        }));
        (this.contactChartOptions.xAxis as any).categories = caseTopicCount.map((item) => item.code);
        (this.contactChartOptions.series as any)[0].data = caseTopicCount.map((item) => item.value);
        this.updateFlag = true;
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAdmin = res?.role.roleTitle.toLowerCase().includes('admin') ?? false;
            this.createdById = this.isAdmin ? 'all' : (res?.userId ?? '');
            if (this.createdById) {
                this.currentPage = 1;
                this.loadTodayCases();
                // Load agent workload if admin
                if (this.isAdmin) {
                    this.loadAgentWorkload();
                }
            }
        });
    }

    loadTodayCases(): void {
        const page = this.currentPage - 1; // Convert to 0-based index for API
        const pageSize = this.pageSize;
        const sortId = 'createdAt,DESC';
        const searchTextParam =
            this.valueSearch != null && String(this.valueSearch).trim() !== '' ? String(this.valueSearch).trim() : 'undefined';
        const dateFilterType = this.dateFilterType || 'toDay';
        let startDate = '';
        let endDate = '';
        if (dateFilterType === 'custom') {
            const startVal = this.dateRangeForm?.get('startDate')?.value;
            const endVal = this.dateRangeForm?.get('endDate')?.value;
            startDate = startVal ? moment(startVal).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            endDate = endVal ? moment(endVal).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        }

        // ดึงข้อมูลทั้งหมดสำหรับคำนวณตัวเลข (ไม่มี pagination)
        this.callService
            .getCasesAllWithoutPagination(sortId, searchTextParam, this.createdById, dateFilterType, startDate, endDate)
            .subscribe({
                next: (response: any) => {
                    this.allCases = typeof response === 'string' ? JSON.parse(response) : response;

                    this.caseChannel = Object.values(
                        this.allCases.reduce((acc, item) => {
                            const channel = item.channel;

                            if (channel) {
                                if (!acc[channel]) {
                                    acc[channel] = { name: channel, value: 0 };
                                }

                                acc[channel].value += 1;
                            }
                            return acc;
                        }, {}),
                    );
                    this.caseChannelCount = this.caseChannel.length;
                    this.channelPercentage = this.caseChannel.map((item) => ({
                        name: item.name,
                        value: (item.value / this.allCases.length) * 100,
                    }));

                    this.caseTopic = Object.values(
                        this.allCases.reduce((acc, item) => {
                            const topic = item.caseTopic;
                            if (topic) {
                                if (!acc[topic]) {
                                    acc[topic] = { code: topic, name: topic, value: 0 };
                                }

                                acc[topic].value += 1;
                            }
                            return acc;
                        }, {}),
                    );
                    this.caseTopicCount = this.caseTopic.length;
                    this.contactCount = [...new Set(this.allCases.map((item) => item.contactId))].length;

                    // เรียก filterCases เพื่อ filter และ paginate จาก allCases
                    this.filterCases();
                },
                error: (error) => {
                    console.error('Error loading all cases:', error);
                },
            });
    }

    filterCases(resetPage: boolean = true): void {
        // Reset หน้าเป็น 1 เมื่อ filter เปลี่ยน (แต่ไม่ reset เมื่อเปลี่ยนหน้า)
        if (resetPage) {
            this.currentPage = 1;
        }

        // Filter จากข้อมูลทั้งหมด (allCases) ก่อน
        const filteredAllCases = this.allCases.filter((caseItem) => {
            const matchesStatus = !this.selectedStatus || caseItem.status === this.selectedStatus;

            const matchesChannel = !this.selectedCaseChannel || caseItem.channel === this.selectedCaseChannel;

            const matchesTopic = !this.selectedCaseTopic || caseItem.caseTopic === this.selectedCaseTopic;

            const hasAnyFilter = this.selectedStatus || this.selectedCaseChannel || this.selectedCaseTopic;

            if (!hasAnyFilter) {
                return true;
            }

            let matches = true;

            if (this.selectedStatus) {
                matches = matches && matchesStatus;
            }
            if (this.selectedCaseChannel) {
                matches = matches && matchesChannel;
            }
            if (this.selectedCaseTopic) {
                matches = matches && matchesTopic;
            }

            return matches;
        });

        this.totalCount = filteredAllCases.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.calculatePages();

        if (this.selectedStatus && !this.selectedCaseChannel && !this.selectedCaseTopic) {
            this.getStatusList(this.allCases);
        } else {
            this.getStatusList(filteredAllCases);
        }
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.filteredCases = filteredAllCases.slice(start, end);

        let caseChannel = Object.values(
            filteredAllCases.reduce((acc, item) => {
                const channel = item.channel;

                if (channel) {
                    if (!acc[channel]) {
                        acc[channel] = { name: channel, value: 0 };
                    }

                    acc[channel].value += 1;
                }
                return acc;
            }, {}),
        );
        this.caseChannelCount = caseChannel.length;
        this.channelPercentage = caseChannel.map((item: any) => ({
            name: item.name,
            value: filteredAllCases.length > 0 ? (item.value / filteredAllCases.length) * 100 : 0,
        }));

        let caseTopic = Object.values(
            filteredAllCases.reduce((acc, item) => {
                const topic = item.caseTopic;
                if (topic) {
                    if (!acc[topic]) {
                        acc[topic] = { code: topic, name: topic, value: 0 };
                    }

                    acc[topic].value += 1;
                }
                return acc;
            }, {}),
        );
        this.caseTopicCount = caseTopic.length;
        this.contactCount = [...new Set(filteredAllCases.map((item) => item.contactId))].length;
        this.initChart(caseChannel, caseTopic);
    }

    isOverOneDay(createdAt: string): boolean {
        if (!createdAt) return false;
        const createdDate = moment(createdAt);
        const now = moment();
        const hoursDiff = now.diff(createdDate, 'hours');
        return hoursDiff > 24;
    }

    onSearchInput(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.loadTodayCases();
        }, 300);
    }

    getCaseTopics() {
        this.callService.getCaseTopics().subscribe((res: any) => {
            this.caseTopicList = res.map((item: any) => ({
                id: item.caseTopicId ?? item.id,
                code: item.code,
                name: item.name || item.code,
                value: item.name || item.code,
            }));
        });
    }

    getCaseChannel() {
        this.callService.getAllChannels().subscribe((res: any) => {
            this.caseChannelList = res.map((item: any) => ({ id: item.channelId, name: item.name, value: item.name }));
        });
    }

    get hasCaseChartData(): boolean {
        const series = (this.caseChartOptions.series as any)?.[0];
        return series?.data && Array.isArray(series.data) && series.data.length > 0;
    }

    get hasContactChartData(): boolean {
        const series = (this.contactChartOptions.series as any)?.[0];
        return series?.data && Array.isArray(series.data) && series.data.length > 0;
    }

    getChannelColor(channelName: string): string {
        return this.statusService.getChannelBgColor(channelName);
    }

    calculatePages(): void {
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

    pageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.filterCases(false);
        }
    }

    pageSizeChange(): void {
        this.currentPage = 1;
        this.filterCases();
    }

    getStatusList(filteredCases?: any[]) {
        // ถ้า statusList ยังไม่โหลด ให้เรียก API
        if (!this.statusListLoaded) {
            this.callService.getAllStatus().subscribe((res: any) => {
                this.statusList = res.map((item: any) => ({
                    id: item.id,
                    name: item.status,
                    caseCount: 0,
                }));
                this.statusListLoaded = true;

                // นับ caseCount จาก filteredCases ถ้ามี
                if (filteredCases) {
                    this.statusList.forEach((status) => {
                        status.caseCount = filteredCases.filter((item) => item.status === status.name).length;
                    });
                }
            });
        } else if (filteredCases) {
            // statusList โหลดแล้ว ใช้ filteredCases อัปเดต caseCount
            this.statusList.forEach((status) => {
                status.caseCount = filteredCases.filter((item) => item.status === status.name).length;
            });
        }
    }

    getStatusColorAndIcon(statusName: string) {
        return {
            color: this.statusService.getStatusBgColor(statusName),
            icon: `<i class="${this.statusService.getStatusIcon(statusName)}"></i>`,
        };
    }

    getStatusColor(statusName: string): string {
        return this.statusService.getStatusBgColor(statusName);
    }

    onDateFilterChange(): void {
        this.currentPage = 1;
        if (this.dateFilterType === 'custom') {
            const startVal = this.dateRangeForm?.get('startDate')?.value;
            const endVal = this.dateRangeForm?.get('endDate')?.value;
            if (!startVal && !endVal) {
                const today = new Date();
                this.dateRangeForm?.patchValue({ startDate: today, endDate: today });
                return; // valueChanges จะเรียก loadTodayCases
            }
        }
        this.loadTodayCases();
    }

    onDateRangeChange(): void {
        const startVal = this.dateRangeForm?.get('startDate')?.value;
        const endVal = this.dateRangeForm?.get('endDate')?.value;
        if (startVal && endVal) {
            this.currentPage = 1;
            this.loadTodayCases();
        }
    }

    filterByStatus(statusName: string): void {
        // ถ้าคลิกที่ status เดิมอีกครั้ง ให้ clear filter
        if (this.selectedStatus === statusName) {
            this.selectedStatus = '';
        } else {
            this.selectedStatus = statusName;
        }
        this.filterCases();
    }

    getAllContactCount() {
        this.contactService.countByAssignedUserId(this.createdById === 'all' ? '' : this.createdById).subscribe((res: any) => {
            this.allContactCount = res.count ?? 0;
        });
    }

    loadAgentWorkload() {
        this.callListService.getAgentWorkloadWithOpenCases().subscribe({
            next: (response: any) => {
                const data = typeof response === 'string' ? JSON.parse(response) : response;
                // Filter agents with open cases and sort by open cases count (descending)
                this.agentWorkload = (data || [])
                    .filter((agent: any) => agent.openCases > 0)
                    .sort((a: any, b: any) => b.openCases - a.openCases);
            },
            error: (error) => {
                console.error('Error loading agent workload:', error);
                this.agentWorkload = [];
            },
        });
    }

    getWorkloadSeverity(pendingLeads: number): string {
        return 'high';
    }

    getWorkloadBadgeClass(pendingLeads: number): string {
        const severity = this.getWorkloadSeverity(pendingLeads);
        switch (severity) {
            case 'high':
                return 'bg-danger';
            case 'medium':
                return 'bg-warning';
            default:
                return 'bg-info';
        }
    }

    navigateToCallWithAgentFilter(agentId: string) {
        this.router.navigate(['/call'], {
            queryParams: { agentId: agentId },
        });
    }

    navigateToEditCase(caseId: string, contactId: string) {
        this.router.navigate(['/contacts/edit'], {
            queryParams: { caseId, key: contactId },
        });
    }

    search(): void {
        this.currentPage = 1;
        this.loadTodayCases();
    }
}
