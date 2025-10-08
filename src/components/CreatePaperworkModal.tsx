"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { paperworkService, CreatePaperworkRequest } from '@/lib/paperwork-api';

interface CreatePaperworkModalProps {
  onClose: () => void;
  onSuccess?: (paperwork: any) => void;
}

export default function CreatePaperworkModal({ onClose, onSuccess }: CreatePaperworkModalProps) {
  const [formData, setFormData] = useState<CreatePaperworkRequest>({
    title: '',
    description: '',
    content: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await paperworkService.create(formData);
      console.log('Paperwork created:', result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating paperwork:', err);
      setError('Failed to create paperwork. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePaperworkRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Create New Paperwork</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter paperwork title"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter paperwork description"
              rows={3}
              className="mt-1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Paperwork
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
