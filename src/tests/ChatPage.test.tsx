import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ChatPage from '@/app/chat/page';
import * as aiSdkReact from '@ai-sdk/react';

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

describe('Chat Message Renderer', () => {
  it('renders text, input-streaming state, and tool-result components correctly', () => {
    
    vi.mocked(aiSdkReact.useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'assistant',
          parts: [
            { 
              type: 'text', 
              text: 'Here is a great jazz track for you!' 
            },
            { 
              type: 'tool-searchItunes', 
              state: 'input-available', 
              input: { query: 'jazz' } 
            },
            { 
              type: 'tool-searchItunes', 
              state: 'output-available', 
              output: [
                { trackId: 999, title: 'Take Five', artist: 'Dave Brubeck', coverArt: '/fake-art.jpg' }
              ] 
            }
          ]
        }
      ],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      status: 'ready',
      stop: vi.fn(),
      error: undefined,
      reload: vi.fn(),
      sendMessage: vi.fn(),
    } as any); 

    render(<ChatPage />);

    const inputField = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Send/i });
    
    expect(inputField).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();

    expect(screen.getByText('Here is a great jazz track for you!')).toBeInTheDocument();
    expect(screen.getByText(/Searching iTunes for "jazz".../i)).toBeInTheDocument();

    expect(screen.getByText('Take Five')).toBeInTheDocument();
    expect(screen.getByText('Dave Brubeck')).toBeInTheDocument();
  });
});