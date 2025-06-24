
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types/dossier';

interface EchangesTabProps {
  dossierId: string;
}

// Mock messages
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Bonjour, j\'ai bien reçu les documents. Je vais les examiner.',
    timestamp: '2024-06-20T14:30:00',
    sender: 'Avocat',
    attachments: []
  },
  {
    id: '2',
    content: 'Merci. J\'ai également joint les derniers bulletins de paie.',
    timestamp: '2024-06-20T15:45:00',
    sender: 'Client',
    attachments: ['bulletins_paie_2024.pdf']
  }
];

// Mock quick reply templates
const quickReplies = [
  'Documents bien reçus, merci.',
  'Je vous recontacte sous 48h.',
  'Pouvez-vous préciser votre demande ?',
  'Je prépare les conclusions.',
  'Audience reportée, nouvelles dates à venir.'
];

export const EchangesTab = ({ dossierId }: EchangesTabProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'Avocat',
      attachments: selectedFiles.map(f => f.name)
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    setSelectedFiles(validFiles);
  };

  const handleQuickReply = (template: string) => {
    setNewMessage(template);
  };

  return (
    <div className="space-y-6">
      {/* Chat Messages */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'Avocat' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'Avocat' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="text-sm font-medium mb-1">{message.sender}</div>
                  <div className="text-sm">{message.content}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      {message.attachments.map((attachment, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs mr-1">
                          📎 {attachment}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Replies */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="mb-3">
            <span className="text-sm font-medium text-muted-foreground">Réponses rapides:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* File attachments */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, idx) => (
                  <Badge key={idx} variant="secondary">
                    📎 {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                type="file"
                multiple
                accept="*/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  📎 Joindre (≤10 Mo)
                </Button>
              </label>
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              
              <Button onClick={handleSendMessage}>
                Envoyer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
