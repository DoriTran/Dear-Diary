import { useEffect, useState, type RefObject } from 'react';

import { TICKET_DECORATOR_CONFIG } from './ticket.config';
import { resolveTicketStubVariant } from './ticket.shape';

const SHELL_SELECTOR = '[data-decorated-shell]';
const COMPOSER_SURFACE_SELECTOR = '[data-composer-surface]';
const COMPOSER_BODY_SELECTOR = '[data-composer-body]';
const SURFACE_CARD_SELECTOR = '[data-decorated-surface-card]';

export type TicketEditorMetrics = {
  width: number;
  height: number;
  topOffset: number;
  isCompact: boolean;
};

const EMPTY_METRICS: TicketEditorMetrics = {
  width: 0,
  height: 0,
  topOffset: 0,
  isCompact: false,
};

function findComposerInputSurface(column: HTMLElement): HTMLElement | null {
  const shell = column.closest(SHELL_SELECTOR);
  if (shell) {
    const surfaceCard = shell.querySelector<HTMLElement>(SURFACE_CARD_SELECTOR);
    return (
      surfaceCard?.querySelector<HTMLElement>(COMPOSER_SURFACE_SELECTOR) ?? null
    );
  }

  return column.closest(COMPOSER_SURFACE_SELECTOR);
}

function findComposerBody(inputSurface: HTMLElement): HTMLElement | null {
  return inputSurface.querySelector<HTMLElement>(COMPOSER_BODY_SELECTOR);
}

export function useTicketEditorMetrics(
  columnRef: RefObject<HTMLElement | null>,
): TicketEditorMetrics {
  const [metrics, setMetrics] = useState<TicketEditorMetrics>(EMPTY_METRICS);

  useEffect(() => {
    const column = columnRef.current;
    if (!column) {
      return;
    }

    const measure = () => {
      const currentColumn = columnRef.current;
      if (!currentColumn) {
        return;
      }

      const inputSurface = findComposerInputSurface(currentColumn);
      if (!inputSurface) {
        setMetrics(EMPTY_METRICS);
        return;
      }

      const composerBody = findComposerBody(inputSurface);
      const columnRect = currentColumn.getBoundingClientRect();
      const inputRect = inputSurface.getBoundingClientRect();
      const height = Math.round(inputRect.height);
      const width = Math.round(columnRect.width);
      const topOffset = Math.round(inputRect.top - columnRect.top);
      const bodyHeight = composerBody
        ? Math.round(composerBody.getBoundingClientRect().height)
        : height;

      setMetrics({
        width,
        height,
        topOffset,
        isCompact:
          resolveTicketStubVariant(bodyHeight, TICKET_DECORATOR_CONFIG) ===
          'compact',
      });
    };

    measure();

    const inputSurface = findComposerInputSurface(column);
    const composerBody = inputSurface ? findComposerBody(inputSurface) : null;
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    if (inputSurface) {
      observer.observe(inputSurface);
    }
    if (composerBody) {
      observer.observe(composerBody);
    }

    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [columnRef]);

  return metrics;
}
