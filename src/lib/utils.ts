import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(date);
}

export function formatTokens(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function parseToolName(name: string): { icon: string; label: string } {
  const toolMap: Record<string, { icon: string; label: string }> = {
    bash: { icon: 'terminal', label: 'Terminal' },
    edit: { icon: 'edit-3', label: 'Edit File' },
    write: { icon: 'file-plus', label: 'Write File' },
    read: { icon: 'file-text', label: 'Read File' },
    glob: { icon: 'search', label: 'Find Files' },
    grep: { icon: 'search', label: 'Search Content' },
    webfetch: { icon: 'globe', label: 'Web Fetch' },
    task: { icon: 'layers', label: 'Task' },
  };

  return toolMap[name.toLowerCase()] || { icon: 'tool', label: name };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
