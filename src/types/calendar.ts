
import { TransactionStatus, PaymentMethod, TransactionType } from "./transaction";

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  type: TransactionType;
  time?: string;
  initiatedBy?: string;
  needsApproval?: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface MonthData {
  weeks: CalendarWeek[];
  monthYear: string;
}

export type CalendarViewType = 'month' | 'week';
export type CalendarFilterType = 'all' | 'recurring' | 'scheduled' | 'completed' | 'pending';
