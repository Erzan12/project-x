export enum Actions {
    CREATE  = 'create',
    SHOW    = 'show',
    VIEW    = 'view',
    EDIT    = 'edit',
    UPDATE  = 'update',
    CANCEL  = 'cancel',
    VERIFY  = 'verify',
    APPROVE = 'approve',
    NOTE    = 'note',
}

export enum RolePermStatus {
    ACTIVE = 'true',
    INACTIVE  = 'false',
}

export enum Status {
    ACTIVE   = 'active',
    INACTIVE = 'inactive',
    PENDING  = 'pending',
    DEACTIVATED  = 'deactivated',
}

export enum UserStatus {
    ACTIVE      = 1,     //1
    INACTIVE    = 2,   //2
    DEACTIVATED = 3,
}

export enum PositionStatus {
    ACTIVE      = 'true',
    INACTIVE    = 'false',
}

export enum DepartmentStatus {
    ACTIVE = 'true',
    INACTIVE = 'false'
}

export enum EmploymentStatus {

}
// map in employees role based for validation if belonged to role that has access
export enum Role {
    ADMINISTRATOR            = 'Administrator',
    HUMAN_RESOURCES          = 'Human Resources',
    PAYROLL                  = 'Payroll',
    PURCHASING               = 'Purchasing',
    INVENTORY                = 'Inventory',
    ACCOUNTING               = 'Accounting',
    OPERATIONS               = 'Operations',
    FINANCE                  = 'Finance',
    ASSET_MANAGEMENT         = 'Asset Management',
    COMPLIANCE               = 'Compliance',
    INFORMATION_TECHNOLOGY   = 'Information Technology',
    MANAGERS                 = 'Manager',
    EPORTAL_USER             = 'Eportal User',
}

// map in employees positions based for validation in createUserAccount
export enum CreateUserAccount {
    ADMINISTRATOR            = 'Administrator',
    HUMAN_RESOURCES_MAN      = 'HR Manager',
    MARKETING_MAN            = 'Marketing Manager III',
    ACCOUNTING_MAN           = 'Accounting Manager',
    OPS_MAN_LIGHT            = 'Operations Manager(Lighterage)',
    OPS_MAN_INLAND_LOGI      = 'Operations Manager(Inland Logistics',
    OPS_MAN_ICHS             = 'Operations Manager(ICHS)',
    OPS_MAN_SVP              = 'Operations Manager',
    ASST_OPS_MAN             = 'Asst. Operations Manager',
    TRUCK_MAN                = 'Trucking Manager',
    FINANCE_MAN              = 'Finance Manager',
    ASSET_MANAGEMENT         = 'Asset Management',
    PROCUREMENT_MAN          = 'Procurement Manager',
    NATL_LOGISTIC_MAN        = 'National Logistics Manager',
    WAREHOUSE_MAN            = 'Warehouse Manager',
    ENGR_SUPP_MAN            = 'Engineering and Supply Chain Manager',
    CONSTRUCTION_MAN         = 'Construction Project Manager', 
    TRAFFIC_CON_MAN          = 'Traffic Control Manager',
    IT_MAN                   = 'IT Manager'            
}

