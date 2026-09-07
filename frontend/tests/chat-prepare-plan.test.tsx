// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ChatPanel } from '../src/layout/ChatPanel';

describe('ChatPanel plan preparation', () => {
  it('prevents duplicate submissions while the plan request is pending', async () => {
    let resolvePlan!: () => void;
    const onPreparePlan = vi.fn(() => new Promise<void>((resolve) => {
      resolvePlan = resolve;
    }));
    const props: Parameters<typeof ChatPanel>[0] = {
      snapshot: null,
      turns: [],
      drafts: { chat: 'Describe a sufficiently long task for the plan action' },
      chatMode: 'live',
      history: null,
      conversations: null,
      canChat: true,
      routerEntries: [],
      sessionModel: null,
      activeProvider: null,
      activeModels: new Set(),
      onSetChatMode: vi.fn(),
      onDraftChange: vi.fn(),
      onSendChat: vi.fn().mockResolvedValue(undefined),
      onInspect: vi.fn(),
      onRunCommand: vi.fn().mockResolvedValue(null),
      onRunContextCommand: vi.fn().mockResolvedValue(undefined),
      onNavigate: vi.fn(),
      onSetSessionModel: vi.fn().mockResolvedValue(undefined),
      reasoningDepth: 'standard',
      onSetReasoningDepth: vi.fn().mockResolvedValue(undefined),
      contextPatches: [],
      isDocked: true,
      onPreparePlan,
    };

    const { getByRole } = render(<ChatPanel {...props} />);
    const button = getByRole('button', { name: /preparar plan/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(onPreparePlan).toHaveBeenCalledOnce();
    expect(button).toBeDisabled();

    resolvePlan();
    await waitFor(() => expect(button).toBeEnabled());
  });
});
