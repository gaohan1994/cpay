export interface IHomeData {
  toBeAuditedAppCount: number;
  downloadJobList: Array<{
    activateType: number;
    cupConnMode: number;
    dccSupFlag: number;
    deptId: number;
    executeCount: number;
    executingCount: number;
    failureCount: number;
    firmId: number;
    id: number;
    isGroupUpdate: number;
    jobCopsSign: number;
    releaseType: number;
    showNotify: number;
    status: number;
    successCount: number;
    taskCountList: Array<{
      count: number;
      status: number;
    }>;
    activateTypes: string;
    bussType: string;
    createBy: string;
    createTime: string;
    groupIds: string;
    jobName: string;
    terminalTypes: string;
    updateBy: string;
    updateTime: string;
    validDateShow: string;
    validEndTime: string;
    validStartTime: string;
    zzFlag: string;
  }>
}