import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface FileFormData {
  name: string;
  file_type: string;
  notes: string;
  category: string;
}

interface CreateFileModalProps {
  onClose: () => void;
  onSubmit: (data: FileFormData) => void;
}

export default function CreateFileModal({ onClose, onSubmit }: CreateFileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    file_type: "other",
    notes: "",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fileTypes = [
    "contract", "script", "schedule", "budget", 
    "call_sheet", "release_form", "permit", "invoice", "other"
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e293b] border-gray-800 text-[#fafaf9] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New File Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">File Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter file name"
              required
              className="bg-dark-green border-gray-800 text-[#fafaf9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Type</Label>
              <Select value={formData.file_type} onValueChange={(value) => setFormData({...formData, file_type: value})}>
                <SelectTrigger className="bg-dark-green border-gray-800 text-[#fafaf9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-gray-800">
                  {fileTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Custom Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Optional"
                className="bg-dark-green border-gray-800 text-[#fafaf9]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any notes about this file"
              rows={3}
              className="bg-dark-green border-gray-800 text-[#fafaf9]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-800 text-gray-400 hover:text-[#fafaf9]">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#0d9488] to-[#10b981] hover:from-[#0f766e] hover:to-[#059669] text-[#fafaf9]">
              Create File Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}