"use client";

import { useState, useEffect } from "react";
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
  Globe,
  Star,
  MessageSquare,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: "medical" | "non-medical";
  isActive: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  clientName: string;
  relationship: string;
  content: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
}

export default function CMSServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch services
        const servicesResponse = await fetch("/api/admin/services");
        if (servicesResponse.ok) {
          const data = await servicesResponse.json();
          const transformedServices = (data.services || []).map((s: { id: string; name: string; description: string; category: string; baseRate: number }, index: number) => ({
            id: s.id,
            name: s.name,
            slug: s.name.toLowerCase().replace(/\s+/g, "-"),
            shortDescription: s.description?.substring(0, 100) || "",
            description: s.description || "",
            category: s.category === "MEDICAL" ? "medical" : "non-medical",
            isActive: true,
            order: index + 1,
          }));
          setServices(transformedServices);
        }

        // Fetch testimonials
        const testimonialsResponse = await fetch("/api/testimonials?approved=false");
        if (testimonialsResponse.ok) {
          const data = await testimonialsResponse.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleSave = async (service: Service) => {
    try {
      if (editingService && !isCreating) {
        // Update existing service
        const response = await fetch(`/api/admin/services/${service.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            category: service.category === "medical" ? "MEDICAL" : "NON_MEDICAL",
          }),
        });
        if (response.ok) {
          setServices((prev) =>
            prev.map((s) => (s.id === service.id ? service : s))
          );
        }
      } else {
        // Create new service
        const response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            category: service.category === "medical" ? "MEDICAL" : "NON_MEDICAL",
            baseRate: 50,
            isActive: true,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setServices((prev) => [
            ...prev,
            { ...service, id: data.service.id, order: prev.length + 1 },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/admin/services/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setServices((prev) => prev.filter((s) => s.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Testimonial handlers
  const handleSaveTestimonial = async (testimonial: Testimonial) => {
    try {
      if (editingTestimonial && !isCreatingTestimonial) {
        const response = await fetch(`/api/testimonials/${testimonial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testimonial),
        });
        if (response.ok) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === testimonial.id ? testimonial : t))
          );
        }
      } else {
        const response = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testimonial),
        });
        if (response.ok) {
          const data = await response.json();
          setTestimonials((prev) => [...prev, { ...testimonial, id: data.testimonial.id }]);
        }
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
    setEditingTestimonial(null);
    setIsCreatingTestimonial(false);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const response = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
        if (response.ok) {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
      }
    }
  };

  const toggleTestimonialApproval = async (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      try {
        await fetch(`/api/testimonials/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...testimonial, isApproved: !testimonial.isApproved }),
        });
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isApproved: !t.isApproved } : t))
        );
      } catch (error) {
        console.error("Failed to toggle approval:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading services...</p>
      </div>
    );
  }

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pages</CardTitle>
                  <CardDescription>Manage static page content</CardDescription>
                </div>
                <Button onClick={() => {/* TODO: Add page modal */}}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">About Us</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Learn about our mission, values, and commitment to excellence in home care.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      /about
                    </span>
                    <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-700`}>
                      Published
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Contact Us</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Get in touch with our team for inquiries, support, or to schedule a consultation.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      /contact
                    </span>
                    <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-700`}>
                      Published
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">FAQ</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Frequently asked questions about our services, billing, and care process.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      /faq
                    </span>
                    <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-700`}>
                      Published
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Privacy Policy</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Our commitment to protecting your privacy and personal information.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      /privacy
                    </span>
                    <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-700`}>
                      Published
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Terms of Service</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Terms and conditions for using our services and platform.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      /terms
                    </span>
                    <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-700`}>
                      Published
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Testimonials</CardTitle>
                      <CardDescription>{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setIsCreatingTestimonial(true);
                      setEditingTestimonial({
                        id: "",
                        clientName: "",
                        relationship: "",
                        content: "",
                        rating: 5,
                        isApproved: true,
                        isFeatured: false,
                      });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Testimonial
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testimonials.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No testimonials yet. Add your first testimonial!</p>
                      </div>
                    ) : (
                      testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{testimonial.clientName}</h3>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                &quot;{testimonial.content.length > 150 ? testimonial.content.substring(0, 150) + "..." : testimonial.content}&quot;
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{testimonial.relationship || "Client"}</span>
                                <span className={`px-2 py-1 rounded text-xs ${testimonial.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                  {testimonial.isApproved ? "Published" : "Pending"}
                                </span>
                                {testimonial.isFeatured && (
                                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleTestimonialApproval(testimonial.id)}
                                title={testimonial.isApproved ? "Unpublish" : "Publish"}
                              >
                                {testimonial.isApproved ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingTestimonial(testimonial);
                                  setIsCreatingTestimonial(false);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Panel */}
            <div>
              {(editingTestimonial || isCreatingTestimonial) && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isCreatingTestimonial ? "Add Testimonial" : "Edit Testimonial"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TestimonialForm
                      testimonial={editingTestimonial!}
                      onSave={handleSaveTestimonial}
                      onCancel={() => {
                        setEditingTestimonial(null);
                        setIsCreatingTestimonial(false);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {!editingTestimonial && !isCreatingTestimonial && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Select a testimonial to edit or add a new one
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
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

function TestimonialForm({
  testimonial,
  onSave,
  onCancel,
}: {
  testimonial: Testimonial;
  onSave: (testimonial: Testimonial) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(testimonial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship">Relationship</Label>
        <select
          id="relationship"
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="Select relationship"
        >
          <option value="Client">Client</option>
          <option value="Family Member">Family Member</option>
          <option value="Spouse">Spouse</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <select
          id="rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="Select rating"
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Testimonial Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.isApproved}
            onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
            className="rounded border-gray-300"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="rounded border-gray-300"
          />
          Featured
        </label>
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
