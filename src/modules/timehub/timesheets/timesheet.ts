export type CreateTimesheet = {
    periodStart: string
    periodEnd: string
    type?: string;
    time_entries: {
        id?: string
        projectId: string
        taskId?: string
        entryDate: string
        startAt: string
        endAt: string
        description?: string
        billable?: boolean
        totalMinutes?: number
        status?: string
    }[]
}


export interface ListTimesheets {
    id: string,
    organizationId: string,
    memberId: string,
    periodStart: string,
    periodEnd: string,
    status: string,
    isLocked: boolean,
    notes: string | null,
    submittedAt: string | null,
    approvedAt: string | null,
    approvedById: string | null,
    rejectedAt: string | null,
    rejectedById: string | null,
    createdAt: string,
    updatedAt: string,
    createdById: string,
    updatedById: string | null,
    orgMember: {
        user: {
            firstName: string,
            lastName: string
        }
    }
}

export interface Timesheet {
    id: string,
    organizationId: string,
    memberId: string,
    periodStart: string,
    periodEnd: string,
    status: string,
    isLocked: boolean,
    notes: string | null,
    submittedAt: string | null,
    approvedAt: string | null,
    approvedById: string | null,
    rejectedAt: string | null,
    rejectedById: string | null,
    createdAt: string,
    updatedAt: string,
    createdById: string,
    updatedById: string | null,
    orgMember: {
        user: {
            firstName: string,
            lastName: string
        }
    },
    timeEntries: {
        id: string,
        organizationId: string,
        memberId: string,
        projectId: string,
        taskId: string,
        timesheetId: string,
        entryDate: string,
        startAt: string,
        endAt: string,
        totalMinutes: number,
        description: string,
        status: string,
        isLocked: boolean,
        submittedAt: string | null,
        approvedAt: string | null,
        approvedById: string | null,
        rejectedAt: string | null,
        rejectedById: string | null,
        rejectedReason: string | null,
        notes: string | null,
        createdAt: string,
        updatedAt: string,
        createdById: string,
        updatedById: string | null,
        project: {
            id: string,
            name: string
        },
        task: {
            id: string,
            title: string
        }
    }[]
}

export interface ApproveReject {
    type: string;
    notes: string
}

export type TimeSheetReportItem = {
    id: string;
    entryDate: string;
    startAt: string;
    endAt: string;
    totalMinutes: number;
    description: string;
    status: "APPROVED" | "PENDING" | "REJECTED" | string;
    notes: string;
    memberId: string;
    projectId: string;
    taskId: string;
    project: {
        id: string;
        name: string;
    };
    task: {
        id: string;
        title: string;
    };
    orgMember: {
        user: {
            firstName: string;
            lastName: string;
        };
        department: {
            name: string;
        }
    };
};


export interface MultipleEntries {
    time_entries: Entry[]
}
export interface Entry {
    projectId: string,
    taskId: string,
    entryDate: string,
    startAt: string,
    endAt: string,
    description: string,
    memberId: string
}