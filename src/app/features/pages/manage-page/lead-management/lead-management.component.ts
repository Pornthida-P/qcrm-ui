import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallListService } from 'src/app/services/call-list/call-list.service';
import { UserService } from 'src/app/services/user/user.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ContactImportManagementComponent } from 'src/app/features/modals/contact-import-management/contact-import-management.component';

@Component({
    selector: 'app-lead-management',
    templateUrl: './lead-management.component.html',
    styleUrls: ['./lead-management.component.scss'],
})
export class LeadManagementComponent implements OnInit {
    // Data
    leads: any[] = [];
    deadPoolLeads: any[] = [];
    agentWorkload: any[] = [];
    agents: any[] = [];

    // UI State
    activeTab: 'leads' | 'dead-pool' | 'workload' = 'leads';
    activeFilter: string = 'all';
    filterAgent: string = ''; // กรองตาม agent
    selectedLeads: Set<string> = new Set();
    selectAll: boolean = false;
    bulkSelectedAgent: string = ''; // สำหรับ bulk reassign
    selectedAgentMap: Map<string, string> = new Map(); // สำหรับ single reassign แต่ละ row
    loading: boolean = false;

    // Auto Reassign Modal
    showAutoReassignModal: boolean = false;
    selectedAgentsForReassign: Set<string> = new Set();
    selectAllAgents: boolean = false;

    // Reassign From Agent Modal
    showReassignFromAgentModal: boolean = false;
    sourceAgent: any = null;
    selectedTargetAgents: Set<string> = new Set();
    selectAllTargetAgents: boolean = false;

    // Pagination
    currentPage = 1;
    pageSize = 15;
    pageSizeOptions = [5, 10, 15, 20, 25, 50, 100];
    pages: number[] = [];

    // User data
    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');

    constructor(
        private callListService: CallListService,
        private userService: UserService,
        private sweetAlertService: SweetAlertService,
        private translate: TranslateService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loadAgents();
        this.loadLeads();
        this.loadDeadPoolLeads();
        this.loadAgentWorkload();
    }

    // Tab switching
    switchTab(tab: 'leads' | 'dead-pool' | 'workload') {
        this.activeTab = tab;
        this.selectedLeads.clear();
        this.selectAll = false;

        if (tab === 'dead-pool') {
            this.loadDeadPoolLeads();
        } else if (tab === 'workload') {
            this.loadAgentWorkload();
        }
    }

    // Filter switching
    switchFilter(filter: string) {
        this.activeFilter = filter;
        this.loadLeads();
        this.selectedLeads.clear();
        this.selectAll = false;
        this.currentPage = 1;
    }

    // Agent filter
    onAgentFilterChange() {
        this.currentPage = 1;
        this.selectedLeads.clear();
        this.selectAll = false;
        this.updatePages();
    }

    // Load data
    loadAgents() {
        this.callListService.getActiveAgents().subscribe({
            next: (res: any) => {
                this.agents = res;
            },
            error: (err) => console.error('Error loading agents:', err),
        });
    }

    loadLeads() {
        this.loading = true;
        this.callListService.getAdminLeads(this.activeFilter).subscribe({
            next: (res: any) => {
                this.leads = res;
                this.loading = false;
                this.updatePages();
            },
            error: (err) => {
                console.error('Error loading leads:', err);
                this.loading = false;
            },
        });
    }

    loadDeadPoolLeads() {
        this.loading = true;
        this.callListService.getAdminLeads('dead-pool').subscribe({
            next: (res: any) => {
                this.deadPoolLeads = res;
                this.loading = false;
                this.updatePages();
            },
            error: (err) => {
                console.error('Error loading dead pool leads:', err);
                this.loading = false;
            },
        });
    }

    loadAgentWorkload() {
        this.callListService.getAgentWorkload().subscribe({
            next: (res: any) => {
                this.agentWorkload = res;
            },
            error: (err) => console.error('Error loading agent workload:', err),
        });
    }

    // Selection
    toggleSelectAll() {
        if (this.selectAll) {
            this.paginatedLeads.forEach((lead) => this.selectedLeads.add(lead.caseId));
        } else {
            this.selectedLeads.clear();
        }
    }

    toggleLeadSelection(caseId: string) {
        if (this.selectedLeads.has(caseId)) {
            this.selectedLeads.delete(caseId);
        } else {
            this.selectedLeads.add(caseId);
        }
        this.selectAll = this.selectedLeads.size === this.paginatedLeads.length;
    }

    isSelected(caseId: string): boolean {
        return this.selectedLeads.has(caseId);
    }

    // Actions
    async bulkReassign() {
        if (this.selectedLeads.size === 0) {
            this.sweetAlertService.warning('leadManagement.selectLeadsFirst');
            return;
        }
        if (!this.bulkSelectedAgent) {
            this.sweetAlertService.warning('leadManagement.selectAgentFirst');
            return;
        }

        const confirmed = await this.sweetAlertService.confirmSwal(
            'warning',
            this.translate.instant('leadManagement.confirmBulkReassign', { count: this.selectedLeads.size }),
            '',
            this.translate.instant('alert.confirm'),
            this.translate.instant('alert.cancel'),
        );

        if (confirmed.isConfirmed) {
            this.callListService.bulkReassignLeads(Array.from(this.selectedLeads), this.bulkSelectedAgent, this.userData.userId).subscribe({
                next: (res: any) => {
                    this.sweetAlertService.success('leadManagement.reassignSuccess');
                    this.loadLeads();
                    this.loadAgentWorkload();
                    this.selectedLeads.clear();
                    this.selectAll = false;
                    this.bulkSelectedAgent = '';
                },
                error: (err) => {
                    this.sweetAlertService.error('common.error');
                },
            });
        }
    }

    // Get/Set agent for single row
    getRowAgent(caseId: string): string {
        return this.selectedAgentMap.get(caseId) || '';
    }

    setRowAgent(caseId: string, agentId: string): void {
        this.selectedAgentMap.set(caseId, agentId);
    }

    async reassignSingle(caseId: string) {
        const agentId = this.selectedAgentMap.get(caseId);
        if (!agentId) {
            this.sweetAlertService.warning('leadManagement.selectAgentFirst');
            return;
        }

        this.callListService.reassignCase(caseId, agentId, this.userData.userId).subscribe({
            next: (res: any) => {
                this.sweetAlertService.success('leadManagement.reassignSuccess');
                this.selectedAgentMap.delete(caseId);
                this.loadLeads();
                this.loadAgentWorkload();
            },
            error: (err) => {
                this.sweetAlertService.error('common.error');
            },
        });
    }

    async restoreFromDeadPool(caseId: string) {
        const confirmed = await this.sweetAlertService.confirmSwal(
            'warning',
            this.translate.instant('leadManagement.confirmRestore'),
            '',
            this.translate.instant('alert.confirm'),
            this.translate.instant('alert.cancel'),
        );

        if (confirmed.isConfirmed) {
            this.callListService.restoreFromDeadPool(caseId, this.userData.userId).subscribe({
                next: (res: any) => {
                    this.sweetAlertService.success('leadManagement.restoreSuccess');
                    this.loadDeadPoolLeads();
                    this.loadAgentWorkload();
                },
                error: (err) => {
                    this.sweetAlertService.error('common.error');
                },
            });
        }
    }

    // Open Auto Reassign Modal
    openAutoReassignModal() {
        this.showAutoReassignModal = true;
        this.selectedAgentsForReassign.clear();
        this.selectAllAgents = false;
        // Pre-select all agents by default
        this.agents.forEach((agent) => this.selectedAgentsForReassign.add(agent.userId));
        this.selectAllAgents = true;
    }

    closeAutoReassignModal() {
        this.showAutoReassignModal = false;
    }

    toggleSelectAllAgents() {
        if (this.selectAllAgents) {
            this.agents.forEach((agent) => this.selectedAgentsForReassign.add(agent.userId));
        } else {
            this.selectedAgentsForReassign.clear();
        }
    }

    toggleAgentSelection(agentId: string) {
        if (this.selectedAgentsForReassign.has(agentId)) {
            this.selectedAgentsForReassign.delete(agentId);
        } else {
            this.selectedAgentsForReassign.add(agentId);
        }
        this.selectAllAgents = this.selectedAgentsForReassign.size === this.agents.length;
    }

    isAgentSelected(agentId: string): boolean {
        return this.selectedAgentsForReassign.has(agentId);
    }

    async confirmAutoReassign() {
        if (this.selectedAgentsForReassign.size === 0) {
            this.sweetAlertService.warning('leadManagement.selectAgentFirst');
            return;
        }

        const confirmed = await this.sweetAlertService.confirmSwal(
            'warning',
            this.translate.instant('leadManagement.confirmAutoReassign', { count: this.selectedAgentsForReassign.size }),
            '',
            this.translate.instant('alert.confirm'),
            this.translate.instant('alert.cancel'),
        );

        if (confirmed.isConfirmed) {
            const agentIds = Array.from(this.selectedAgentsForReassign);
            this.callListService.reassignLeads(agentIds, this.userData.userId).subscribe({
                next: (res: any) => {
                    const count = res.reassignedCount || 0;
                    const title = this.translate.instant('alert.success');
                    const text = '';
                    this.sweetAlertService.getSwal('success', title, text, false, '');
                    this.closeAutoReassignModal();
                    this.loadLeads();
                    this.loadAgentWorkload();
                },
                error: (err) => {
                    this.sweetAlertService.error('common.error');
                },
            });
        }
    }

    // ==================== Reassign From Agent Modal ====================

    openReassignFromAgentModal(agent: any) {
        this.sourceAgent = agent;
        this.showReassignFromAgentModal = true;
        this.selectedTargetAgents.clear();
        this.selectAllTargetAgents = false;
        // Pre-select all other agents
        this.agents.filter((a) => a.userId !== agent.userId).forEach((a) => this.selectedTargetAgents.add(a.userId));
        this.selectAllTargetAgents = true;
    }

    closeReassignFromAgentModal() {
        this.showReassignFromAgentModal = false;
        this.sourceAgent = null;
    }

    getTargetAgents(): any[] {
        if (!this.sourceAgent) return this.agents;
        return this.agents.filter((a) => a.userId !== this.sourceAgent.userId);
    }

    toggleSelectAllTargetAgents() {
        const targetAgents = this.getTargetAgents();
        if (this.selectAllTargetAgents) {
            targetAgents.forEach((agent) => this.selectedTargetAgents.add(agent.userId));
        } else {
            this.selectedTargetAgents.clear();
        }
    }

    toggleTargetAgentSelection(agentId: string) {
        if (this.selectedTargetAgents.has(agentId)) {
            this.selectedTargetAgents.delete(agentId);
        } else {
            this.selectedTargetAgents.add(agentId);
        }
        this.selectAllTargetAgents = this.selectedTargetAgents.size === this.getTargetAgents().length;
    }

    isTargetAgentSelected(agentId: string): boolean {
        return this.selectedTargetAgents.has(agentId);
    }

    async confirmReassignFromAgent() {
        if (!this.sourceAgent || this.selectedTargetAgents.size === 0) {
            this.sweetAlertService.warning('leadManagement.selectAgentFirst');
            return;
        }

        const confirmed = await this.sweetAlertService.confirmSwal(
            'warning',
            this.translate.instant('leadManagement.confirmReassignFromAgent', { agent: this.sourceAgent.username }),
            '',
            this.translate.instant('alert.confirm'),
            this.translate.instant('alert.cancel'),
        );

        if (confirmed.isConfirmed) {
            const targetAgentIds = Array.from(this.selectedTargetAgents);
            this.callListService.reassignFromAgent(this.sourceAgent.userId, targetAgentIds, this.userData.userId).subscribe({
                next: (res: any) => {
                    const count = res.reassignedCount || 0;
                    const title = this.translate.instant('alert.success');
                    const text = '';
                    this.sweetAlertService.getSwal('success', title, text, false, '');
                    this.closeReassignFromAgentModal();
                    this.loadLeads();
                    this.loadAgentWorkload();
                },
                error: (err) => {
                    this.sweetAlertService.error('common.error');
                },
            });
        }
    }

    // Filtered data by agent
    get filteredLeads(): any[] {
        const data = this.activeTab === 'dead-pool' ? this.deadPoolLeads : this.leads;
        if (!this.filterAgent) {
            return data;
        }
        return data.filter((lead) => lead.assignedUserId === this.filterAgent);
    }

    // Pagination
    get paginatedLeads(): any[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredLeads.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.ceil(this.filteredLeads.length / this.pageSize) || 1;
    }

    get totalFilteredItems(): number {
        return this.filteredLeads.length;
    }

    updatePages(): void {
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    pageChange(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    pageSizeChange(): void {
        this.currentPage = 1;
        this.updatePages();
    }

    // Get workload count for agent (for modal display)
    getAgentWorkloadCount(agentId: string): number | null {
        const workload = this.agentWorkload.find((w) => w.userId === agentId);
        return workload ? workload.leadCount : null;
    }

    // Helpers
    getAttemptClass(attemptCount: number): string {
        if (attemptCount >= 3) return 'attempt-danger';
        if (attemptCount >= 2) return 'attempt-warning';
        return '';
    }

    getCallStatusClass(callStatus: string): string {
        if (!callStatus) return 'status-not-called';
        const status = callStatus.trim();

        // สีแดง - ไม่รับสาย, ไม่สนทนาต่อ
        if (status === 'ไม่รับสาย' || status === 'ไม่สนทนาต่อ') {
            return 'status-no-answer';
        }

        // สีส้ม/เหลือง - ไม่สะดวกสนทนา (ต้องติดตาม)
        if (status === 'ไม่สะดวกสนทนา') {
            return 'status-followup';
        }

        // สีเขียว - สนทนาต่อ, ติดต่อสำเร็จ
        if (status === 'สนทนาต่อ' || status === 'ติดต่อสำเร็จ') {
            return 'status-success';
        }

        return '';
    }

    // Import Leads
    openImportDialog(): void {
        const dialogRef = this.dialog.open(ContactImportManagementComponent, {
            width: '60%',
            maxWidth: '90vw',
            data: { mode: 'add' },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.loadLeads();
                this.loadAgentWorkload();
            }
        });
    }
}
