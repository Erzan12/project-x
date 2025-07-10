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

export enum Status {
    ACTIVE   = 'active',
    INACTIVE = 'inactive',
    PENDING  = 'pending',
    DELETED  = 'deleted',
}

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

export enum CreateUserRole {
    ADMINISTRATOR            = 'Administrator',
    HUMAN_RESOURCES          = 'Human Resources',
    INFORMATION_TECHNOLOGY   = 'Information Technology',
    MANAGERS                 = 'Manager',
}