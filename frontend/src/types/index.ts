export type UserRole = 'Admin' | 'Manager' | 'SalesRep';

export type ClientStatus = 'Lead' | 'Active' | 'Prospect' | 'Churned';

export type DealStage = 'Lead' | 'Contacted' | 'ProposalSent' | 'Negotiation' | 'Won' | 'Lost';

export type DealPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'Note' | 'StageChange';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  roleName: string;
  avatarUrl: string;
  monthlyQuota: number;
  phoneNumber: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  activeDealsCount: number;
  totalSalesCurrentMonth: number;
  quotaAttainmentPercent: number;
}

export interface Client {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  region: string;
  status: ClientStatus;
  statusName: string;
  assignedUserId?: number;
  assignedUserName?: string;
  notes: string;
  createdAt: string;
  dealsCount: number;
  totalDealValue: number;
}

export interface DealActivity {
  id: number;
  dealId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  type: ActivityType;
  typeName: string;
  description: string;
  timestamp: string;
}

export interface Deal {
  id: number;
  title: string;
  clientId: number;
  clientName: string;
  clientCompany: string;
  assignedUserId: number;
  assignedUserName: string;
  assignedUserAvatar?: string;
  amount: number;
  stage: DealStage;
  stageName: string;
  probability: number;
  priority: DealPriority;
  priorityName: string;
  expectedCloseDate?: string;
  closedAt?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activities?: DealActivity[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
  dealsCount: number;
}

export interface StageDistribution {
  stage: string;
  stageId: number;
  dealsCount: number;
  totalAmount: number;
  percentage: number;
}

export interface LeaderboardItem {
  userId: number;
  fullName: string;
  role: string;
  avatarUrl: string;
  totalWonRevenue: number;
  wonDealsCount: number;
  monthlyQuota: number;
  quotaAttainmentPercent: number;
  winRatePercent: number;
}

export interface RecentDeal {
  id: number;
  title: string;
  companyName: string;
  amount: number;
  stage: string;
  assignedUserName: string;
  assignedUserAvatar?: string;
  createdAt: string;
}

export interface RecentActivityItem {
  id: number;
  dealTitle: string;
  userName: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface CategoryStat {
  category: string;
  count: number;
  totalAmount: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowthPercent: number;
  dealsWonCount: number;
  activePipelineValue: number;
  activeDealsCount: number;
  winRatePercent: number;
  averageDealSize: number;
  totalClientsCount: number;
  revenueVsTarget: MonthlyRevenue[];
  pipelineStages: StageDistribution[];
  leaderboard: LeaderboardItem[];
  recentActivities: RecentActivityItem[];
  recentDeals: RecentDeal[];
  industryBreakdown: CategoryStat[];
}

export interface SaleHistory {
  id: number;
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  salesRepName: string;
  amount: number;
  closedDate: string;
  paymentMethod: string;
  notes: string;
}

export interface DemoAccount {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
  department: string;
  defaultPassword: string;
}
