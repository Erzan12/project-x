//permissions or action
export const MODULE_ADMIN = 'Administrator';
export const MODULE_HR = 'Human Resources';
export const MODULE_MNGR = 'Manager';
export const MODULE_COPR_SERV = 'Corporate Services';
export const MODULE_PAYROLL = 'Payroll';
export const MODULE_PURCHASING = 'Purchasing';
export const MODULE_INVENTORY = 'Inventory';
export const MODULE_ACCOUNTING = 'Accounting';
export const MODULE_FINANCE = 'Finance';
export const MODULE_MRKTOPS = 'Marketing and Operations';
export const MODULE_AST_MGT = 'Asset Management';
export const MODULE_COMPLIANCE = 'Compliance';
export const MODULE_IT = 'IT Helpdesk';

// permission flow -> check user role -> permission can create? -> module manager? -> submodule useraccount
// 
export const UserRole = {
    ADMINISTRATOR            : 'Administrator',
    HUMAN_RESOURCES          : 'Human Resources',
    PAYROLL                  : 'Payroll',
    PURCHASING               : 'Purchasing',
    INVENTORY                : 'Inventory',
    ACCOUNTING               : 'Accounting',
    OPERATIONS               : 'Operations',
    FINANCE                  : 'Finance',
    ASSET_MANAGEMENT         : 'Asset Management',
    COMPLIANCE               : 'Compliance',
    INFORMATION_TECHNOLOGY   : 'Information Technology',
    MANAGERS                 : 'Manager',
    EPORTAL_USER             : 'Eportal User',
}

//actions or permissions kani nga permission sa user padolung sa user account then unsay mabuhat niya under sa user account submodule
export const ACTION_CREATE = 'create';
export const ACTION_READ = 'read';
export const ACTION_UPDATE = 'update';
export const ACTION_DELETE = 'delete';
export const ACTION_MANAGE = 'manage';
// export const ACTION_SHOW = 'show';
// export const ACTION_CANCEL = 'cancel';
// export const ACTION_VERIFY = 'verify';
// export const ACTION_APPROVE= 'approve';
// export const ACTION_NOTE = 'note';


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

export const SM_USER_ACCOUNT = 'User Account'
export const SM_EMPLOYEE_MASTERLIST = 'Employee Masterlist'