import { useEffect, useState, type RefObject } from 'react';

import { TICKET_DECORATOR_CONFIG } from './ticket.config';
import { resolveTicketStubVariant } from './ticket.shape';

const SHELL_SELECTOR = '[data-decorated-shell]';
const COMPOSER_SURFACE_SELECTOR = '[data-composer-surface]';
const VARIANT_EDITOR_SELECTOR = '[data-composer-variant-editor]';

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

function findVariantEditor(column: HTMLElement): HTMLElement | null {
  const shell = column.closest(SHELL_SELECTOR);
  if (shell) {
    const surfaceCard = shell.querySelector<HTMLElement>(
      '[data-decorated-surface-card]',
    );
    return (
      surfaceCard?.querySelector<HTMLElement>(VARIANT_EDITOR_SELECTOR) ?? null
    );
  }

  const composerSurface = column.closest(COMPOSER_SURFACE_SELECTOR);
  return (
    composerSurface?.querySelector<HTMLElement>(VARIANT_EDITOR_SELECTOR) ?? null
  );
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

      const editor = findVariantEditor(currentColumn);
      if (!editor) {
        setMetrics(EMPTY_METRICS);
        return;
      }

      const columnRect = currentColumn.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      const height = Math.round(editorRect.height);
      const width = Math.round(columnRect.width);
      const topOffset = Math.round(editorRect.top - columnRect.top);

      setMetrics({
        width,
        height,
        topOffset,
        isCompact:
          resolveTicketStubVariant(height, TICKET_DECORATOR_CONFIG) ===
          'compact',
      });
    };

    measure();

    const editor = findVariantEditor(column);
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    if (editor) {
      observer.observe(editor);
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
