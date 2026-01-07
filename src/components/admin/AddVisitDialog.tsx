"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Employee {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  type: string;
}

interface AddVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisitAdded?: () => void;
}

export function AddVisitDialog({ open, onOpenChange, onVisitAdded }: AddVisitDialogProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    employeeId: "",
    scheduledDate: "",
    scheduledStart: "",
    scheduledEnd: "",
    serviceType: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchEmployees();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients");
      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/admin/employees");
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Combine date and time for start and end
      const scheduledStart = new Date(
        `${formData.scheduledDate}T${formData.scheduledStart}`
      ).toISOString();
      const scheduledEnd = new Date(
        `${formData.scheduledDate}T${formData.scheduledEnd}`
      ).toISOString();

      const response = await fetch("/api/admin/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          employeeId: formData.employeeId,
          scheduledDate: formData.scheduledDate,
          scheduledStart,
          scheduledEnd,
          serviceType: formData.serviceType,
          notes: formData.notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create visit");
      }

      // Reset form
      setFormData({
        clientId: "",
        employeeId: "",
        scheduledDate: "",
        scheduledStart: "",
        scheduledEnd: "",
        serviceType: "",
        notes: "",
      });

      onOpenChange(false);
      onVisitAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Visit</DialogTitle>
          <DialogDescription>
            Create a new visit by selecting a client, employee, and visit details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
                required
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.user.firstName} {client.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                required
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.user.firstName} {employee.user.lastName} ({employee.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
                required
              >
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL_CARE">Personal Care</SelectItem>
                  <SelectItem value="COMPANION_CARE">Companion Care</SelectItem>
                  <SelectItem value="SKILLED_NURSING">Skilled Nursing</SelectItem>
                  <SelectItem value="RESPITE_CARE">Respite Care</SelectItem>
                  <SelectItem value="HOMEMAKER">Homemaker Services</SelectItem>
                  <SelectItem value="PHYSICAL_THERAPY">Physical Therapy</SelectItem>
                  <SelectItem value="OCCUPATIONAL_THERAPY">Occupational Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Visit Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.scheduledStart}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledStart: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.scheduledEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledEnd: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Visit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
