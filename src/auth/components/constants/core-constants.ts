//submodules
export const SM_HR = {
    DASHBOARD : 'Dashboard',
    EMPLOYEE_MASTERLIST : 'Employee Masterlist',
    RECRUITMENT : 'Recruitment',
    ACTION_MEMOS : 'Action Memos',
    CREW_MOVEMENTS : 'Crew Movements',
    AWOL_CASE : 'AWOL Case',
    EMPLOYEE_RELATION : 'Employee Relations',
    LEAVE_APPLICATION : 'Leave Applications',
    OT_APPLICATION : 'OT Applications',
    UT_APPLICATION : 'UT Applications',
    OB_APPLICATION : 'OB Applications',
    OJT_TRAINEES : 'On-the-Job Trainees',
    PERFORMANCE_EVALUATION : 'Performance Evaluations',
    BULLETIN : 'Bulletin',
    VACCINE_CARD : 'Vaccine Cards',
    ORG_CHART : 'Organizational Chart',
    INCIDENT_REPORTS : 'Incident Reports',
    HR_REPORTS : 'HR Reports',
}

export const CORE_MODULE = {
    MODULE: 'Module',
    SUB_MODULE: 'Sub Module',
    ROLE: 'Role',
}

export const REPORT = {
    USER_SUMMARY : 'User Summary',
    USER_LOGIN_HISTORY : 'User Login History',
}

export const SM_ADMIN = {
    DASHBOARD : 'Dashboard',
    AUDIT_TRAIL : 'Audit Trail',
    DB_ENCONDING : 'Database Encoding',
    DB_MANUAL_QUERY : 'Database Manual Query',
    CORE_MODULE,
    //or if array approach
    //CORE_MODULE: ['Module', 'Sub-Module', 'Role'],
    // CORE_MODULE: {
    //      MODULE: 'Module',
    //      SUB_MODULE: 'Sub Module',
    //      ROLE: 'Role',
    // },

    MAINTENANCE_SCHEDULE : 'Maintenance Schedules',
    MASTER_TABLE : 'Master Table',
    USER_ACCOUNT : 'User Accounts',
    USER_TOKEN_KEY : 'User Token Keys',
    SMS_SUBSCRIPTION : 'SMS Subscriptions',
    REPORT,
    //or if array approach
    //REPORTS: ['Users Summary', 'Users Login History'],

    //nested objects appraoch
    // REPORT: {
    //     USERS_SUMMARY: 'Users Summary',
    //     USERS_LOGIN_HISTORY: 'Users Login History',
    // },
}

export const EXEC_REPORT = {
    VES_EXP_AMOUNT : 'Vessel Expenses Account Report',
    VES_DRY_DOCK : 'Vessel Dry-dock Repairs Statistics',
    VES_TRADE_PUR : 'Vessel Trading Purchase History',
    PROC_KPI_REP : 'Procurement KPI Report',
    RFP_APPROVAL_HIS: 'RFP Approval History', 
}

export const SM_MANAGER = {
    DASHBOARD   : 'Dashboard',
    INBOX       : 'Inbox',
    EXEC_REPORT,
    //or if array approach
    //nested objects appraoch
    // EXEC_REPORT: {
    //      VES_EXP_AMOUNT : 'Vessel Expenses Account Report',
    //      VES_DRY_DOCK : 'Vessel Dry-dock Repairs Statistics',
    //      VES_TRADE_PUR : 'Vessel Trading Purchase History',
    //      PROC_KPI_REP : 'Procurement KPI Report',
    //      RFP_APPROVAL_HIS: 'RFP Approval History', 
    // },
}

