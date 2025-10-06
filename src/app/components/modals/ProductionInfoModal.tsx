"use client";

import React from "react";
import { Production } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, Users, FileVideo, Clock } from "lucide-react";

interface ProductionInfoModalProps {
  production: Production;
  onClose: () => void;
}

export default function ProductionInfoModal({ production, onClose }: ProductionInfoModalProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pre_production':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_production':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'post_production':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pre_production':
        return 'Pre-Production';
      case 'in_production':
        return 'In Production';
      case 'post_production':
        return 'Post-Production';
      case 'completed':
        return 'Completed';
      case 'archived':
        return 'Archived';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <FileVideo className="w-5 h-5 text-emerald-600" />
            Production Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Production Name */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{production.name}</h3>
            {production.description && (
              <p className="text-slate-600 leading-relaxed">{production.description}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Status:</span>
            </div>
            <Badge className={`${getStatusColor(production.status)} text-sm font-medium px-3 py-1 rounded-lg`}>
              {getStatusLabel(production.status)}
            </Badge>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Start Date:</span>
            </div>
            <span className="text-slate-800">{formatDate(production.start_date)}</span>
          </div>

          {/* Members */}
          {production.members && production.members.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-slate-600 mt-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">Members:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {production.members.map((member, index) => (
                  <Badge 
                    key={index}
                    className="text-xs bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    {member}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Production ID */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              <span className="font-medium">Production ID:</span> {production.id || 'N/A'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
