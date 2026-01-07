"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

// Mock data for services
const initialServices = [
  {
    id: "1",
    name: "Personal Care",
    slug: "personal-care",
    shortDescription: "Assistance with daily living activities",
    description: "Our personal care services include assistance with bathing, grooming, dressing, and mobility. Our trained caregivers provide dignified, compassionate support.",
    category: "medical",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    name: "Companion Care",
    slug: "companion-care",
    shortDescription: "Social interaction and emotional support",
    description: "Combat loneliness and isolation with our companion care services. Our caregivers provide meaningful conversation, activities, and emotional support.",
    category: "non-medical",
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    name: "Skilled Nursing",
    slug: "skilled-nursing",
    shortDescription: "Professional medical care at home",
    description: "Licensed nurses provide medical care including medication management, wound care, IV therapy, and chronic disease management.",
    category: "medical",
    isActive: true,
    order: 3,
  },
];

type Service = typeof initialServices[0];

export default function CMSServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = (service: Service) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    } else {
      setServices((prev) => [
        ...prev,
        { ...service, id: String(prev.length + 1), order: prev.length + 1 },
      ]);
    }
    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage website content and services</p>
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>Manage your service offerings</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setIsCreating(true);
                      setEditingService({
                        id: "",
                        name: "",
                        slug: "",
                        shortDescription: "",
                        description: "",
                        category: "non-medical",
                        isActive: true,
                        order: services.length + 1,
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services
                      .sort((a, b) => a.order - b.order)
                      .map((service) => (
                        <div
                          key={service.id}
                          className={`flex items-center gap-4 p-4 border rounded-lg ${
                            !service.isActive ? "bg-gray-50 opacity-60" : ""
                          }`}
                        >
                          <button className="cursor-grab text-gray-400 hover:text-gray-600" aria-label="Drag to reorder">
                            <GripVertical className="h-5 w-5" />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {service.name}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  service.category === "medical"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {service.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {service.shortDescription}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleActive(service.id)}
                              title={service.isActive ? "Hide" : "Show"}
                            >
                              {service.isActive ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingService(service);
                                setIsCreating(false);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Panel */}
            <div>
              {(editingService || isCreating) && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isCreating ? "Add Service" : "Edit Service"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServiceForm
                      service={editingService!}
                      onSave={handleSave}
                      onCancel={() => {
                        setEditingService(null);
                        setIsCreating(false);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {!editingService && !isCreating && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Select a service to edit or add a new one
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>Manage static page content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Page management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Manage client testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Testimonial management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(service);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
              slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as "medical" | "non-medical" })
          }
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="Select service category"
        >
          <option value="medical">Medical</option>
          <option value="non-medical">Non-Medical</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={5}
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
