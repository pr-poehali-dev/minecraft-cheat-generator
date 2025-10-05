import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Message } from '@/types/cheat';

interface ChatPanelProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

export const ChatPanel = ({ messages, input, setInput, handleSend }: ChatPanelProps) => {
  return (
    <Card className="minecraft-border bg-white p-0 overflow-hidden">
      <div className="bg-minecraft-brown p-4 border-b-4 border-minecraft-stone">
        <h2 className="pixel-font text-white text-sm">AI GENERATOR</h2>
      </div>

      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 ${
                  msg.role === 'user'
                    ? 'bg-minecraft-green text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                style={{
                  boxShadow: msg.role === 'user' 
                    ? '0 4px 0 #3A7F2A' 
                    : '0 4px 0 #999'
                }}
              >
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t-4 border-minecraft-stone bg-gray-100">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опиши модули для чита..."
            className="flex-1 border-2 border-minecraft-stone"
          />
          <Button
            type="submit"
            className="minecraft-btn"
          >
            <Icon name="Send" size={16} />
          </Button>
        </form>
      </div>
    </Card>
  );
};
