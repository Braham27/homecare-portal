import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  CheckCheck,
  User,
  Search,
  Filter,
} from "lucide-react";

// Mock data - would come from API
const conversations = [
  {
    id: "1",
    participant: "Sarah Johnson, RN - Care Coordinator",
    lastMessage: "I've updated your care plan based on yesterday's assessment.",
    timestamp: "2026-01-08 10:30 AM",
    unread: true,
    avatar: "SJ",
  },
  {
    id: "2",
    participant: "Jane Smith - Caregiver",
    lastMessage: "Thank you for the update. I'll make sure to bring the supplies tomorrow.",
    timestamp: "2026-01-07 3:45 PM",
    unread: false,
    avatar: "JS",
  },
  {
    id: "3",
    participant: "Dr. Michael Chen - Medical Director",
    lastMessage: "The lab results look good. Continue with current medication regimen.",
    timestamp: "2026-01-06 11:20 AM",
    unread: false,
    avatar: "MC",
  },
  {
    id: "4",
    participant: "Billing Department",
    lastMessage: "Your January invoice is now available in the billing section.",
    timestamp: "2026-01-05 9:00 AM",
    unread: false,
    avatar: "BD",
  },
];

const selectedConversation = {
  id: "1",
  participant: "Sarah Johnson, RN - Care Coordinator",
  role: "Registered Nurse",
  messages: [
    {
      id: "1",
      sender: "Sarah Johnson",
      isClient: false,
      content: "Good morning! I wanted to follow up on our conversation from last week about adjusting the morning care routine.",
      timestamp: "2026-01-07 9:15 AM",
      read: true,
    },
    {
      id: "2",
      sender: "You",
      isClient: true,
      content: "Yes, thank you for following up. We've noticed that Mom does better with a later wake-up time on Tuesdays and Thursdays.",
      timestamp: "2026-01-07 10:05 AM",
      read: true,
    },
    {
      id: "3",
      sender: "Sarah Johnson",
      isClient: false,
      content: "That's helpful information. I've made a note in her care plan. I'll coordinate with Jane to adjust the Tuesday and Thursday schedule to start at 9:00 AM instead of 8:00 AM. Does that work for you?",
      timestamp: "2026-01-07 10:12 AM",
      read: true,
    },
    {
      id: "4",
      sender: "You",
      isClient: true,
      content: "Perfect! That should work much better. Also, I wanted to ask about the physical therapy exercises you mentioned.",
      timestamp: "2026-01-07 2:30 PM",
      read: true,
    },
    {
      id: "5",
      sender: "Sarah Johnson",
      isClient: false,
      content: "Great question! I've attached a PDF with the recommended exercises. Jane will help with these during her visits. The physical therapist will also visit next week for a more detailed assessment.",
      timestamp: "2026-01-07 2:45 PM",
      read: true,
      attachment: "PT_Exercises_Jan2026.pdf",
    },
    {
      id: "6",
      sender: "Sarah Johnson",
      isClient: false,
      content: "I've updated your care plan based on yesterday's assessment.",
      timestamp: "2026-01-08 10:30 AM",
      read: false,
    },
  ],
};

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Secure, HIPAA-compliant messaging with your care team
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    conversation.id === "1" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      conversation.unread
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {conversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm font-semibold truncate ${
                          conversation.unread ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {conversation.participant}
                        </p>
                        {conversation.unread && (
                          <span className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${
                        conversation.unread ? "font-medium text-gray-700" : "text-gray-500"
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  SJ
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.participant}</CardTitle>
                  <CardDescription>{selectedConversation.role}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isClient ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.isClient
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-lg p-4`}
                  >
                    {!message.isClient && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    {message.attachment && (
                      <div className={`mt-3 p-3 rounded border flex items-center gap-2 ${
                        message.isClient
                          ? "bg-white/10 border-white/20"
                          : "bg-white border-gray-200"
                      }`}>
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs">{message.attachment}</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-1 mt-2 text-xs ${
                      message.isClient ? "justify-end opacity-75" : "opacity-60"
                    }`}>
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp}</span>
                      {message.isClient && (
                        <CheckCheck className={`h-3 w-3 ml-1 ${message.read ? "opacity-100" : "opacity-50"}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="message" className="sr-only">Type your message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attach File
                  </Button>
                  <Button className="gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  All messages are encrypted and HIPAA-compliant. Messages are reviewed during business hours (Mon-Fri, 8 AM - 6 PM).
                  For urgent matters, please call 1-800-HOME-CARE.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Messaging Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Response time: Within 24 hours</li>
              <li>• For urgent needs, call us directly</li>
              <li>• Messages are monitored Mon-Fri 8 AM - 6 PM</li>
              <li>• All communications are secure and private</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Your Care Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Care Coordinator: Sarah Johnson, RN</li>
              <li>• Primary Caregiver: Jane Smith</li>
              <li>• Medical Director: Dr. Michael Chen</li>
              <li>• Billing Contact: Billing Department</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-primary" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              You can attach the following file types:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Documents: PDF, DOC, DOCX</li>
              <li>• Images: JPG, PNG</li>
              <li>• Maximum size: 10 MB per file</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
