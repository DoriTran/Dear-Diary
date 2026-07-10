import type { PathCommand } from './types';

function formatNum(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function serializeCommands(commands: PathCommand[]): string {
  const parts: string[] = [];

  for (const cmd of commands) {
    switch (cmd.type) {
      case 'M':
        parts.push(`M ${formatNum(cmd.x)} ${formatNum(cmd.y)}`);
        break;
      case 'L':
        parts.push(`L ${formatNum(cmd.x)} ${formatNum(cmd.y)}`);
        break;
      case 'H':
        parts.push(`H ${formatNum(cmd.x)}`);
        break;
      case 'V':
        parts.push(`V ${formatNum(cmd.y)}`);
        break;
      case 'A':
        parts.push(
          `A ${formatNum(cmd.rx)} ${formatNum(cmd.ry)} ${formatNum(cmd.rotation)} ${cmd.largeArc ? 1 : 0} ${cmd.sweep ? 1 : 0} ${formatNum(cmd.x)} ${formatNum(cmd.y)}`,
        );
        break;
      case 'Q':
        parts.push(
          `Q ${formatNum(cmd.cx)} ${formatNum(cmd.cy)} ${formatNum(cmd.x)} ${formatNum(cmd.y)}`,
        );
        break;
      case 'C':
        parts.push(
          `C ${formatNum(cmd.c1x)} ${formatNum(cmd.c1y)} ${formatNum(cmd.c2x)} ${formatNum(cmd.c2y)} ${formatNum(cmd.x)} ${formatNum(cmd.y)}`,
        );
        break;
      case 'Z':
        parts.push('Z');
        break;
    }
  }

  return parts.join(' ');
}
