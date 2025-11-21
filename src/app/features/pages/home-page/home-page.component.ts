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
    filteredCases: any[] = [];
    searchText: string = '';
    selectedStatus: string = '';
    userData: User | null = null;
    pageSizeOptions = [15, 50, 100];
    pageSize = 15;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;
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
            this.createdById = res?.role.roleTitle.toLowerCase() === 'super admin' ? 'all' : res?.username ?? '';
            if (this.createdById) {
                this.loadTodayCases(0, this.pageSize);
            }
        });
    }

    loadTodayCases(page: number, pageSize: number): void {
        const sortId = 'createdAt,DESC';
        const searchTextParam = this.searchText && this.searchText.trim() ? this.searchText.trim() : 'undefined';
        const dateFilterType = 'toDay';
        const startDate = '';
        const endDate = '';

        this.callService
            .getCallsPage(page, pageSize, sortId, searchTextParam, this.createdById, dateFilterType, startDate, endDate)
            .subscribe({
                next: (response: any) => {
                    console.log('response', response);
                    let data = response;
                    if (typeof response === 'string') {
                        data = JSON.parse(response);
                    }
                    if (Array.isArray(data)) {
                        this.cases = data.map((item: any) => ({
                            ...item,
                            type:
                                item.type === 'I'
                                    ? 'I'
                                    : item.type === 'O'
                                    ? 'O'
                                    : item.type === 'Inbound'
                                    ? 'I'
                                    : item.type === 'Outbound'
                                    ? 'O'
                                    : item.type,
                        }));
                    } else if (data && Array.isArray(data.data)) {
                        this.cases = data.data.map((item: any) => ({
                            ...item,
                            type:
                                item.type === 'I'
                                    ? 'I'
                                    : item.type === 'O'
                                    ? 'O'
                                    : item.type === 'Inbound'
                                    ? 'I'
                                    : item.type === 'Outbound'
                                    ? 'O'
                                    : item.type,
                        }));
                    }
                    // Calculate and store channel counts
                    this.caseChannel = Object.values(
                        this.cases.reduce((acc, item) => {
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
                        value: (item.value / this.cases.length) * 100,
                    }));
                    console.log('this.channelPercentage', this.channelPercentage);
                    // Calculate and store topic counts
                    this.caseTopic = Object.values(
                        this.cases.reduce((acc, item) => {
                            const topic = item.casetype;

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
                    this.contactCount = [...new Set(this.cases.map((item) => item.contactId))].length;

                    // Update pagination info if available
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        this.totalItems = data.totalElements || data.total || this.cases.length;
                        this.totalPages = data.totalPages || Math.ceil(this.totalItems / this.pageSize);
                    } else {
                        this.totalItems = this.cases.length;
                        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                    }

                    this.filterCases();
                },
                error: (error) => {
                    console.error('Error loading cases:', error);
                },
            });
    }

    filterCases(): void {
        this.filteredCases = this.cases.filter((caseItem) => {
            const matchesStatus =
                !this.selectedStatus ||
                caseItem.type === this.selectedStatus ||
                (this.selectedStatus === 'I' && caseItem.type === 'Inbound') ||
                (this.selectedStatus === 'O' && caseItem.type === 'Outbound');

            const matchesChannel = !this.selectedCaseChannel || caseItem.channel === this.selectedCaseChannel;

            const matchesTopic =
                !this.selectedCaseTopic ||
                (caseItem.casetype && caseItem.casetype.toLowerCase().includes(this.selectedCaseTopic.toLowerCase()));

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

        let caseChannel = Object.values(
            this.filteredCases.reduce((acc, item) => {
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
            value: (item.value / this.filteredCases.length) * 100,
        }));
        console.log('this.channelPercentage', this.channelPercentage);

        let caseTopic = Object.values(
            this.filteredCases.reduce((acc, item) => {
                const topic = item.casetype;

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
        this.contactCount = [...new Set(this.filteredCases.map((item) => item.contactId))].length;
        this.initChart(caseChannel, caseTopic);
    }

    isOverOneDay(createdAt: string): boolean {
        if (!createdAt) return false;
        const createdDate = moment(createdAt);
        const now = moment();
        const hoursDiff = now.diff(createdDate, 'hours');
        return hoursDiff > 24;
    }

    async pageChange(page: number) {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.loadTodayCases((this.currentPage - 1) * this.pageSize, this.pageSize);
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.loadTodayCases((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    get pages(): number[] {
        var page: number[] = [];
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        for (var i = -this.pagesToShow; i <= this.pagesToShow; i++) {
            if (this.currentPage + i > 0 && this.currentPage + i <= this.totalPages) {
                page.push(this.currentPage + i);
            }
        }
        return page;
    }

    onSearchInput(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.loadTodayCases(0, this.pageSize);
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
}
