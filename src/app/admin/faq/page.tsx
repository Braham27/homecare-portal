"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

const categories = [
  { value: "general", label: "General" },
  { value: "services", label: "Services" },
  { value: "billing", label: "Billing" },
  { value: "caregivers", label: "Caregivers" },
];

export default function FAQManagementPage() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch("/api/faq");
        if (response.ok) {
          const data = await response.json();
          const transformedFAQs = (data.faqs || []).map((faq: { id: string; question: string; answer: string; category: string; isActive: boolean }, index: number) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category?.toLowerCase() || "general",
            isActive: faq.isActive !== false,
            order: index + 1,
          }));
          setFAQs(transformedFAQs);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const handleSave = async (faq: FAQ) => {
    try {
      if (editingFAQ && !isCreating) {
        const response = await fetch(`/api/faq/${faq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        });
        if (response.ok) {
          setFAQs((prev) => prev.map((f) => (f.id === faq.id ? faq : f)));
        }
      } else {
        const response = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        });
        if (response.ok) {
          const data = await response.json();
          setFAQs((prev) => [
            ...prev,
            { ...faq, id: data.faq?.id || String(prev.length + 1), order: prev.length + 1 },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    }
    setEditingFAQ(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const response = await fetch(`/api/faq/${id}`, { method: "DELETE" });
        if (response.ok) {
          setFAQs((prev) => prev.filter((f) => f.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete FAQ:", error);
      }
    }
  };

  const toggleActive = (id: string) => {
    setFAQs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const filteredFAQs = faqs.filter(
    (faq) => filterCategory === "all" || faq.category === filterCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingFAQ({
              id: "",
              question: "",
              answer: "",
              category: "general",
              isActive: true,
              order: faqs.length + 1,
            });
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>FAQs</CardTitle>
                  <CardDescription>
                    {filteredFAQs.length} question{filteredFAQs.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFAQs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className={`border rounded-lg ${
                        !faq.isActive ? "bg-gray-50 opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 p-4">
                        <button className="cursor-grab text-gray-400 hover:text-gray-600" aria-label="Drag to reorder">
                          <GripVertical className="h-5 w-5" />
                        </button>
                        <button
                          className="flex-1 text-left"
                          onClick={() =>
                            setExpandedId(expandedId === faq.id ? null : faq.id)
                          }
                        >
                          <p className="font-medium text-gray-900">
                            {faq.question}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              faq.category === "general"
                                ? "bg-gray-100 text-gray-700"
                                : faq.category === "billing"
                                ? "bg-green-100 text-green-700"
                                : faq.category === "services"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {faq.category}
                          </span>
                        </button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActive(faq.id)}
                            title={faq.isActive ? "Hide" : "Show"}
                          >
                            {faq.isActive ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingFAQ(faq);
                              setIsCreating(false);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setExpandedId(expandedId === faq.id ? null : faq.id)
                            }
                          >
                            {expandedId === faq.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {expandedId === faq.id && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-9 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No FAQs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Panel */}
        <div>
          {(editingFAQ || isCreating) && (
            <Card>
              <CardHeader>
                <CardTitle>{isCreating ? "Add FAQ" : "Edit FAQ"}</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQForm
                  faq={editingFAQ!}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingFAQ(null);
                    setIsCreating(false);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {!editingFAQ && !isCreating && (
            <Card>
              <CardContent className="pt-6 text-center">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select an FAQ to edit or add a new one
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function FAQForm({
  faq,
  onSave,
  onCancel,
}: {
  faq: FAQ;
  onSave: (faq: FAQ) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(faq);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="Select FAQ category"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          rows={6}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
