
import { CreateUserAccount } from 'src/Auth/components/decorators/global.enums';

export function canUserCreateAccounts(roleName: string): boolean {
    const allowedRoles = [
        CreateUserAccount.ADMINISTRATOR,
        CreateUserAccount.HUMAN_RESOURCES_MAN,
        CreateUserAccount.ACCOUNTING_MAN,
        CreateUserAccount.IT_MAN,
        CreateUserAccount.MARKETING_MAN,
        CreateUserAccount.ASST_OPS_MAN,
        CreateUserAccount.OPS_MAN_LIGHT,   
        CreateUserAccount.OPS_MAN_INLAND_LOGI,
        CreateUserAccount.OPS_MAN_ICHS,
        CreateUserAccount.OPS_MAN_SVP,
        CreateUserAccount.ASST_OPS_MAN,
        CreateUserAccount.TRUCK_MAN,
        CreateUserAccount.FINANCE_MAN,
        CreateUserAccount.ASSET_MANAGEMENT,
        CreateUserAccount.PROCUREMENT_MAN, 
        CreateUserAccount.NATL_LOGISTIC_MAN,
        CreateUserAccount.WAREHOUSE_MAN,
        CreateUserAccount.ENGR_SUPP_MAN,
        CreateUserAccount.CONSTRUCTION_MAN,
        CreateUserAccount.TRAFFIC_CON_MAN,
        CreateUserAccount.IT_MAN
    ];

    return allowedRoles.includes(roleName as CreateUserAccount);
}