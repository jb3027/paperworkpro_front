"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { X, ChevronDown, Film, Calendar, Play } from "lucide-react";
import { motion } from "framer-motion";

interface CreateProductionData {
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  color?: string;
}

interface CreateProductionModalProps {
  onClose: () => void;
  onSubmit: (formData: CreateProductionData) => void;
}

export default function CreateProductionModal({ onClose, onSubmit }: CreateProductionModalProps) {
  const [formData, setFormData] = useState<CreateProductionData>({
    name: "",
    description: "",
    status: "pre_production",
    start_date: "",
    color: "#065f46"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Production name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Production name must be at least 3 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to create production. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  const formatStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  return (
    <Dialog open onOpenChange={handleCancel}>
      <DialogContent className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-[#334155] text-[#fafaf9] max-w-xlg max-h-[80vh] shadow-2xl">
        <DialogHeader>
          <div className="space-y-4 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-r from-[#065f46] to-[#0d9488] rounded-xl shadow-lg"
            >
              <Film className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <DialogTitle className="text-3xl font-bold text-white">Create New Production</DialogTitle>
            </div>
          </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Global Error Message */}
          {errors.submit && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300"
            >
              <div className="flex items-center gap-2">
                <X className="w-4 h-4" />
                {errors.submit}
              </div>
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-6 p-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="name" className="text-sm font-medium text-[#e2e8f0] mb-2 block">Production Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: ''});
                }}
                placeholder="Enter production name (e.g., 'The Greatest Film')"
                required
                className={`bg-[#0f172a] border-gray-600 text-[#fafaf9] placeholder:text-gray-500 transition-all duration-200 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="description" className="text-sm font-medium text-[#e2e8f0] mb-2 block">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the production, including genre, storyline, or key details..."
                rows={3}
                className="bg-[#0f172a] border-gray-600 text-[#fafaf9] placeholder:text-gray-500 focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all duration-200 resize-none"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <Label className="text-sm font-medium text-[#e2e8f0] mb-2 block">Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="bg-[#0f172a] border-gray-600 text-[#fafaf9] hover:bg-[#1e293b] hover:border-[#0d9488] justify-between w-full transition-all duration-200 focus:ring-2 focus:ring-[#0d9488]/20"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        {formData.status ? formatStatusLabel(formData.status) : 'Select status'}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1e293b] border-gray-600 text-[#fafaf9] min-w-full !left-0 !origin-top-left !right-auto">
                    <DropdownMenuItem 
                      onClick={() => {
                        setFormData({...formData, status: 'pre_production'});
                      }}
                      className="hover:bg-[#0f172a] focus:bg-[#0f172a]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Pre-Production
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setFormData({ ...formData, status: 'in_production' });
                      }}
                      className="hover:bg-[#0f172a] focus:bg-[#0f172a]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        In Production
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setFormData({ ...formData, status: 'post_production' });
                      }}
                      className="hover:bg-[#0f172a] focus:bg-[#0f172a]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Post-Production
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setFormData({ ...formData, status: 'completed' });
                      }}
                      className="hover:bg-[#0f172a] focus:bg-[#0f172a]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Completed
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setFormData({ ...formData, status: 'archived' })}
                      className="hover:bg-[#0f172a] focus:bg-[#0f172a]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        Archived
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Label htmlFor="start_date" className="text-sm font-medium text-[#e2e8f0] mb-2 block">Start Date</Label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="bg-[#0f172a] border-gray-600 text-[#fafaf9] focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 pl-10 transition-all duration-200"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label className="text-sm font-medium text-[#e2e8f0] mb-3 block">Theme Color</Label>
              <div className="flex gap-4 flex-wrap">
                {[
                  { color: '#065f46', name: 'Forest Green' },
                  { color: '#0d9488', name: 'Teal' },
                  { color: '#f59e0b', name: 'Amber' },
                  { color: '#991b1b', name: 'Rose' },
                  { color: '#10b981', name: 'Emerald' },
                  { color: '#8b5cf6', name: 'Purple' },
                  { color: '#ef4444', name: 'Red' },
                  { color: '#06b6d4', name: 'Cyan' }
                ].map(({ color, name }) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`group relative w-12 h-12 rounded-lg transition-all duration-300 ${
                      formData.color === color ? 'ring-4 ring-[#fafaf9] scale-110' : 'hover:scale-105 hover:ring-2 hover:ring-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {formData.color === color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 ring-4 ring-[#fafaf9] rounded-lg"
                      />
                    )}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-700">
            <DialogFooter>
              <div className="flex gap-3 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 border-gray-600 text-[#e2e8f0] hover:bg-gray-700 hover:text-white transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1 bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Film className="w-4 h-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      Create Production
                    </>
                  )}
                </div>
              </Button>
              </div>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}