import { Component, OnInit } from '@angular/core';
import { CallService } from 'src/app/services/call/call.service';
import * as moment from 'moment';
import { User } from 'src/app/shared/interface/user.interface';
import { UserService } from 'src/app/services/user/user.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
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

    private searchTimeout: any;
    updateFlag: boolean = false;

    Highcharts: typeof Highcharts = Highcharts;
    caseChartOptions: Highcharts.Options = {
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        // legend: {
        //     enabled: false,
        // },
        // chart: {
        //     events: {
        //         render() {
        //             const chart = this,
        //                 series = chart.series[0];

        //             if (!series || !series.data || series.data.length === 0) {
        //                 return;
        //             }

        //             let customLabel = (chart.options.chart as any).custom?.label;
        //             let total = 0;
        //             for (let i = 0; i < series.data.length; i++) {
        //                 total += series.data[i]?.y ?? 0;
        //             }

        //             if (!(chart.options.chart as any).custom) {
        //                 (chart.options.chart as any).custom = {};
        //             }

        //             if (!customLabel) {
        //                 customLabel = (chart.options.chart as any).custom.label = chart.renderer
        //                     .label('Total<br/>' + '<strong> ' + total + '</strong>', 0, 0, 'middle')
        //                     .css({
        //                         color: '#000',
        //                         textAnchor: 'middle',
        //                     })
        //                     .add();
        //             } else {
        //                 customLabel.attr({
        //                     text: 'Total<br/>' + '<strong> ' + total + '</strong>',
        //                 });
        //             }

        //             const x = series.center[0] + chart.plotLeft;
        //             const y = series.center[1] + chart.plotTop - customLabel.attr('height') / 2;

        //             customLabel.attr({
        //                 x,
        //                 y,
        //             });

        //             customLabel.css({
        //                 fontSize: `${series.center[2] / 12}px`,
        //             });
        //         },
        //     },
        // },
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
        colors: ['#FB5F20', '#010966', '#ffd700'],
        series: [
            {
                type: 'pie',
                name: 'จำนวนเคสทั้งหมด',
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
                text: 'จำนวนผู้ติดต่อ',
            },
        },
        tooltip: {
            valueSuffix: ' (คน)',
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
        },
        colors: ['#ffd700', '#010966', '#FB5F20'],
        series: [
            {
                name: 'จำนวน',
                type: 'column',
                colorByPoint: true,
                data: [],
            },
        ],
    };

    constructor(private callService: CallService, private userService: UserService, private contactService: ContactsService) {}

    ngOnInit(): void {
        this.getDataUser();
        this.getCaseTopic();
        this.getCaseChannel();
        this.initChart(this.caseChannel, this.caseTopic);
        this.getAllContactCount();
    }

    initChart(caseChannelCount: any[], caseTopicCount: any[]) {
        (this.caseChartOptions.series as any)[0].data = caseChannelCount.map((item) => ({ name: item.name, y: item.value }));
        (this.contactChartOptions.xAxis as any).categories = caseTopicCount.map((item) => item.name);
        (this.contactChartOptions.series as any)[0].data = caseTopicCount.map((item) => item.value);
        this.updateFlag = true;
    }

    getDataUser() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.createdById = res?.role.roleTitle.toLowerCase() === 'super admin' ? 'all' : res?.userId ?? '';
            if (this.createdById) {
                this.currentPage = 1;
                this.loadTodayCases();
            }
        });
    }

    loadTodayCases(): void {
        const page = this.currentPage - 1; // Convert to 0-based index for API
        const pageSize = this.pageSize;
        const sortId = 'createdAt,DESC';
        const searchTextParam = this.searchText && this.searchText.trim() ? this.searchText.trim() : 'undefined';
        const dateFilterType = 'toDay';
        const startDate = '';
        const endDate = '';

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

                    // Calculate and store topic counts
                    this.caseTopic = Object.values(
                        this.allCases.reduce((acc, item) => {
                            const topic = item.topic;

                            if (topic) {
                                if (!acc[topic]) {
                                    acc[topic] = { name: topic, value: 0 };
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

            const matchesTopic =
                !this.selectedCaseTopic || (caseItem.topic && caseItem.topic.toLowerCase().includes(this.selectedCaseTopic.toLowerCase()));

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
                const topic = item.topic;

                if (topic) {
                    if (!acc[topic]) {
                        acc[topic] = { name: topic, value: 0 };
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

    getCaseTopic() {
        this.callService.getCaseTopic().subscribe((res: any) => {
            this.caseTopicList = res.map((item: any) => ({ id: item.caseTopicId, name: `${item.code} - ${item.name}`, value: item.name }));
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

    getChannelColor(index: number): string {
        const colors = ['#FB5F20', '#010966', '#ffd700'];
        return colors[index % colors.length];
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

    getStatusColorAndIcon(id: number) {
        const colors = ['#FB5F20', '#010966', '#006400'];
        const icons = [
            '<i class="fa-solid fa-folder-open"></i>',
            '<i class="fa-solid fa-hourglass-end"></i>',
            '<i class="fa-solid fa-folder-closed"></i>',
        ];
        return { color: colors[id % colors.length], icon: icons[id % icons.length] } as any;
    }

    getStatusColor(statusName: string): string {
        if (!statusName) return '#6c757d';
        const statusIndex = this.statusList.findIndex((s) => s.name === statusName);
        if (statusIndex >= 0) {
            return this.getStatusColorAndIcon(statusIndex).color;
        }
        // Default colors based on common status names
        const statusColors: { [key: string]: string } = {
            รอรับ: '#FB5F20',
            กำลังดำเนินการ: '#010966',
            เสร็จสิ้น: '#006400',
            ยกเลิก: '#6c757d',
        };
        return statusColors[statusName] || '#6c757d';
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
        this.callService.countContact('', this.createdById == 'all' ? '' : this.createdById).subscribe((res: any) => {
            this.allContactCount = res.count ?? 0;
        });
    }
}
