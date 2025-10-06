"use client";

import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { X, ChevronDown, Film, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export interface EditProductionData {
  name: string;
  description?: string;
  status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived';
  start_date?: string;
  color?: string;
}

interface EditProductionModalProps {
  initialData: EditProductionData;
  onClose: () => void;
  onSubmit: (formData: EditProductionData) => Promise<void> | void;
}

export default function EditProductionModal({ initialData, onClose, onSubmit }: EditProductionModalProps) {
  const [formData, setFormData] = useState<EditProductionData>({
    name: initialData.name || "",
    description: initialData.description || "",
    status: initialData.status || "pre_production",
    start_date: initialData.start_date || "",
    color: initialData.color || "#065f46"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const getStatusColors = useMemo(() => (status: string) => {
    const colorMap = {
      pre_production: {
        primary: '#065f46',
        secondary: '#0d9488',
        accent: '#35c29a',
        background: '#073229',
        text: '#fafaf9',
        textSecondary: '#e2e8f0'
      },
      in_production: {
        primary: '#7c2d12',
        secondary: '#dc2626',
        accent: '#f87171',
        background: '#431407',
        text: '#fef2f2',
        textSecondary: '#fecaca'
      },
      post_production: {
        primary: '#9a3412',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#431407',
        text: '#fff7ed',
        textSecondary: '#fed7aa'
      },
      completed: {
        primary: '#a16207',
        secondary: '#eab308',
        accent: '#fde047',
        background: '#451a03',
        text: '#fefce8',
        textSecondary: '#fef3c7'
      },
      archived: {
        primary: '#0f766e',
        secondary: '#14b8a6',
        accent: '#5eead4',
        background: '#042f2e',
        text: '#f0fdfa',
        textSecondary: '#ccfbf1'
      }
    };
    return colorMap[status as keyof typeof colorMap] || colorMap.pre_production;
  }, []);

  const currentColors = getStatusColors(formData.status || 'pre_production');

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
      setErrors({ submit: 'Failed to save changes. Please try again.' });
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
      <div 
        style={{
          '--modal-bg': currentColors.background,
          '--modal-border': currentColors.accent,
          '--modal-text': currentColors.text,
          '--modal-text-secondary': currentColors.textSecondary,
          '--modal-primary': currentColors.primary,
          '--modal-secondary': currentColors.secondary,
          '--modal-accent': currentColors.accent
        } as React.CSSProperties}
      >
        <DialogContent className="w-[475px] max-w-[95vw] max-h-[80vh] shadow-2xl transition-all duration-300 bg-[var(--modal-bg)] border-[var(--modal-border)] text-[var(--modal-text)]">
          <DialogHeader>
            <div className="space-y-4 pb-6 border-b border-[var(--modal-accent)]/40">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-[var(--modal-primary)] to-[var(--modal-secondary)]"
                >
                  <Film className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-[var(--modal-text)]">Edit Production</DialogTitle>
                </div>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
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

            <div className="space-y-6 p-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="name" className="text-sm font-medium mb-2 block text-[var(--modal-text-secondary)]">Production Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Enter production name"
                  required
                  className={`transition-all duration-200 bg-[var(--modal-text)] text-[var(--modal-bg)] ${
                    errors.name ? 'border-red-500' : 'border-[var(--modal-accent)]/60'
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
                <Label htmlFor="description" className="text-sm font-medium mb-2 block text-[var(--modal-text-secondary)]">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the production, including genre, storyline, or key details..."
                  rows={3}
                  className="transition-all duration-200 resize-none bg-[var(--modal-text)] text-[var(--modal-bg)] border-[var(--modal-accent)]/60"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <Label className="text-sm font-medium mb-2 block text-[var(--modal-text-secondary)]">Status</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="justify-between w-50 transition-all duration-200 bg-[var(--modal-text)] text-[var(--modal-bg)] border-[var(--modal-accent)]/60"
                      >
                        <div className="flex items-center">
                          {formData.status ? formatStatusLabel(formData.status) : 'Select status'}
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-full !left-0 !origin-top-left !right-auto bg-[var(--modal-text)] text-[var(--modal-bg)] border-[var(--modal-accent)]/60">
                      <DropdownMenuItem 
                        onClick={() => setFormData({ ...formData, status: 'pre_production' })}
                        className={`transition-all duration-200 hover:bg-[#35c29a]/20 ${formData.status === 'pre_production' ? 'bg-[var(--modal-accent)]/20' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#35c29a]"></div>
                          Pre-Production
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFormData({ ...formData, status: 'in_production' })}
                        className={`transition-all duration-200 hover:bg-[#dc2626]/20 ${formData.status === 'in_production' ? 'bg-[var(--modal-accent)]/20' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#dc2626]"></div>
                          In Production
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFormData({ ...formData, status: 'post_production' })}
                        className={`transition-all duration-200 hover:bg-[#ea580c]/20 ${formData.status === 'post_production' ? 'bg-[var(--modal-accent)]/20' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#ea580c]"></div>
                          Post-Production
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFormData({ ...formData, status: 'completed' })}
                        className={`transition-all duration-200 hover:bg-[#eab308]/20 ${formData.status === 'completed' ? 'bg-[var(--modal-accent)]/20' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#eab308]"></div>
                          Completed
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFormData({ ...formData, status: 'archived' })}
                        className={`transition-all duration-200 hover:bg-[#14b8a6]/20 ${formData.status === 'archived' ? 'bg-[var(--modal-accent)]/20' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>
                          Archived
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label htmlFor="start_date" className="text-sm font-medium mb-2 block text-[var(--modal-text-secondary)]">Start Date</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--modal-accent)]/80" />
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="pl-10 transition-all duration-200 bg-[var(--modal-text)] text-[var(--modal-bg)] border-[var(--modal-accent)]/60"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pt-6 border-t border-[var(--modal-accent)]/40">
              <DialogFooter>
                <div className="flex gap-3 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 transition-all duration-200 disabled:opacity-50 border-[var(--modal-accent)]/60 text-[var(--modal-text-secondary)] bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.name.trim()}
                    className="flex-1 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--modal-primary)] to-[var(--modal-secondary)]"
                  >
                    <div className="flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Film className="w-4 h-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Film className="w-4 h-4" />
                          Save changes
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}


