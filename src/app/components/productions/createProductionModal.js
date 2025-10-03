import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function CreateProductionModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pre_production",
    start_date: "",
    color: "#065f46"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e293b] border-gray-800 text-[#fafaf9] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Production</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Production Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter production name"
              required
              className="bg-[#0f172a] border-gray-800 text-[#fafaf9]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of the production"
              rows={3}
              className="bg-[#0f172a] border-gray-800 text-[#fafaf9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-[#0f172a] border-gray-800 text-[#fafaf9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-gray-800">
                  <SelectItem value="pre_production">Pre-Production</SelectItem>
                  <SelectItem value="in_production">In Production</SelectItem>
                  <SelectItem value="post_production">Post-Production</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="bg-[#0f172a] border-gray-800 text-[#fafaf9]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="flex gap-3">
              {['#065f46', '#0d9488', '#f59e0b', '#991b1b', '#10b981'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-12 h-12 rounded-lg transition-all duration-300 ${
                    formData.color === color ? 'ring-4 ring-[#fafaf9] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-800 text-gray-400 hover:text-[#fafaf9]">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-[#fafaf9]">
              Create Production
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}