import type { Bug, BugSeverity, BugStatus } from '../types';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatusInfo {
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

export function getSeverityColor(severity: BugSeverity): string {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusInfo(status: BugStatus): StatusInfo {
  switch (status) {
    case 'Open':
      return { color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50', icon: AlertCircle };
    case 'In Progress':
      return { color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50', icon: Clock };
    case 'Resolved':
      return { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50', icon: CheckCircle };
    case 'Closed':
      return { color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50', icon: XCircle };
    default:
      return { color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50', icon: AlertCircle };
  }
}

export interface BugStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
}

export function calculateStats(bugs: Bug[]): BugStats {
  return {
    total: bugs.length,
    open: bugs.filter(bug => bug.status === 'Open').length,
    inProgress: bugs.filter(bug => bug.status === 'In Progress').length,
    resolved: bugs.filter(bug => bug.status === 'Resolved').length,
    critical: bugs.filter(bug => bug.severity === 'Critical').length,
  };
}