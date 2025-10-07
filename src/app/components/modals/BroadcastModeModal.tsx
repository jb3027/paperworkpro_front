"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Radio, Split, SplitSquareHorizontalIcon, SplitSquareVerticalIcon, StickyNote } from "lucide-react";
import { motion } from "framer-motion";

interface BroadcastModeData {
  selectedPaperwork: string[];
  displayType: string;
}

interface BroadcastModeModalProps {
  onClose: () => void;
  onSubmit: (formData: BroadcastModeData) => void;
  productionName: string;
  userRole: string;
}

export default function BroadcastModeModal({ onClose, onSubmit, productionName, userRole }: BroadcastModeModalProps) {
  const [formData, setFormData] = useState<BroadcastModeData>({
    selectedPaperwork: [],
    displayType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (formData.selectedPaperwork.length === 0) {
      newErrors.paperwork = "Please select at least one paperwork type";
    }
    
    if (!formData.displayType) {
      newErrors.displayType = "Display type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Log the data as requested
      console.log('Broadcast Mode Data:', {
        role: userRole,
        selectedPaperwork: formData.selectedPaperwork,
        displayType: formData.displayType
      });
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to start broadcast session. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handlePaperworkToggle = (paperwork: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPaperwork: prev.selectedPaperwork.includes(paperwork)
        ? prev.selectedPaperwork.filter(p => p !== paperwork)
        : [...prev.selectedPaperwork, paperwork]
    }));
  };

  const handleDisplayTypeSelect = (displayType: string) => {
    setFormData(prev => ({
      ...prev,
      displayType
    }));
  };

  return (
    <Dialog open onOpenChange={handleCancel}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg max-h-[80vh] shadow-2xl">
        <DialogHeader>
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="p-3 bg-gradient-to-r from-[#991b1b] to-[#dc2626] rounded-xl shadow-lg"
              >
                <Radio className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <DialogTitle className="text-3xl font-bold text-gray-900">Start Broadcast Session</DialogTitle>
                <p className="text-gray-600 mt-1">Configure your live paperwork view</p>
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
          <div className="space-y-4 p-4">
            {/* Your Role Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-lg font-semibold text-red-600 py-1">
                Your role: {userRole}
              </div>
            </motion.div>

            {/* Paperwork Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Paperwork Access</Label>
              <div className="space-y-2">
                {['Script', 'Running Order', 'Camera Cards', 'Floorplan'].map((paperwork) => (
                  <div key={paperwork} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-300">
                    <span className="text-sm text-gray-900">{paperwork}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handlePaperworkToggle(paperwork)}
                      className={`w-10 h-5 rounded-full transition-all duration-200 ${
                        formData.selectedPaperwork.includes(paperwork) ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                        formData.selectedPaperwork.includes(paperwork) ? 'translate-x-2' : '-translate-x-2'
                      }`} />
                    </Button>
                  </div>
                ))}
              </div>
              {errors.paperwork && (
                <p className="text-red-400 text-sm mt-1">{errors.paperwork}</p>
              )}
            </motion.div>

            {/* Display Type Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Display Type *</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '1', label: 'Single View', icon: StickyNote },
                  { value: '2', label: 'Split Across', icon: SplitSquareVerticalIcon },
                  { value: '3', label: 'Split Down', icon: SplitSquareHorizontalIcon }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => handleDisplayTypeSelect(value)}
                    className={`p-3 h-12 border transition-all duration-200 ${
                      formData.displayType === value
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                    </div>
                  </Button>
                ))}
              </div>
              {errors.displayType && (
                <p className="text-red-400 text-sm mt-1">{errors.displayType}</p>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200">
            <DialogFooter>
              <div className="flex gap-3 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || formData.selectedPaperwork.length === 0 || !formData.displayType}
                  className="flex-1 bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Radio className="w-4 h-4" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4" />
                        Go Live
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
