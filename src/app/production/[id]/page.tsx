"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductionService, FileService } from "@/lib/services";
import { Production, File } from "@/lib/mockData";
import { FileVideo, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductionNavbar } from "@/components/ui/production-navbar";
import { ProductionLayout } from "@/components/ui/production-layout";
import { useUser } from "@/hooks/use-user";
import BroadcastModeModal from "@/app/components/modals/BroadcastModeModal";
import EditProductionModal from "@/app/components/modals/EditProductionModal";


export default function ProductionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productionId = params.id as string;

  const [production, setProduction] = useState<Production | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useUser();

  

  useEffect(() => {
    loadData();
  }, [productionId]);

  const loadData = async () => {
    try {
      const [productionsData, filesData] = await Promise.all([
        ProductionService.getAll(),
        FileService.getByProduction(productionId)
      ]);

      const prod = productionsData.find(p => p.id === productionId);
      setProduction(prod || null);
      setFiles(filesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = () => {
    if (!user || !production) return false;
    if (user.role === 'admin') return true;
    return production.members?.includes(user.email) || false;
  };

  const handleAddFile = () => {
    // TODO: Implement add file functionality
    console.log("Add file clicked for production:", productionId);
  };

  const handleBroadcastMode = () => {
    setShowBroadcastModal(true);
  };

  const handleBroadcastSubmit = (formData: { selectedPaperwork: string[]; displayType: string }) => {
    console.log("Starting broadcast session:", formData);
    // TODO: Implement actual broadcast session creation
    setShowBroadcastModal(false);
    // Navigate to broadcast mode page after successful creation
    router.push(`/production/${productionId}/broadcast-mode`);
  };

  const handleBroadcastCancel = () => {
    setShowBroadcastModal(false);
  };

  const handleOpenEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleSubmitEdit = async (data: { name: string; description?: string; status?: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'archived'; start_date?: string; color?: string }) => {
    if (!production) return;
    try {
      const updated = await ProductionService.update(production.id!, {
        name: data.name,
        description: data.description,
        status: data.status,
        start_date: data.start_date,
        color: data.color
      });
      setProduction(updated);
      setShowEditModal(false);
    } catch (e) {
      console.error('Failed to update production', e);
    }
  };

  // Status-driven color mapping
  const getStatusColors = (status?: string) => {
    const colorMap = {
      pre_production: {
        primary: '#065f46',
        secondary: '#0d9488',
        accent: '#35c29a',
        background: '#073229',
        text: '#fafaf9',
        textSecondary: '#e2e8f0',
        border: '#35c29a'
      },
      in_production: {
        primary: '#7c2d12',
        secondary: '#dc2626',
        accent: '#f87171',
        background: '#431407',
        text: '#fef2f2',
        textSecondary: '#fecaca',
        border: '#f87171'
      },
      post_production: {
        primary: '#9a3412',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#431407',
        text: '#fff7ed',
        textSecondary: '#fed7aa',
        border: '#fb923c'
      },
      completed: {
        primary: '#a16207',
        secondary: '#eab308',
        accent: '#fde047',
        background: '#451a03',
        text: '#fefce8',
        textSecondary: '#fef3c7',
        border: '#fde047'
      },
      archived: {
        primary: '#0f766e',
        secondary: '#14b8a6',
        accent: '#5eead4',
        background: '#042f2e',
        text: '#f0fdfa',
        textSecondary: '#ccfbf1',
        border: '#5eead4'
      }
    } as const;
    return colorMap[(status as keyof typeof colorMap) || 'pre_production'];
  };


  if (isLoading) {
    return (
      <ProductionLayout>
        <div></div>
      </ProductionLayout>
    );
  }

  if (!production) {
    return (
      <ProductionLayout>
        <ProductionNavbar productionId={productionId} />
        <div className="p-6 relative z-10 pt-24">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileVideo className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Production not found</h1>
              <p className="text-slate-600 mb-6">The production you&apos;re looking for doesn&apos;t exist or has been removed</p>
            </div>
          </div>
        </div>
      </ProductionLayout>
    );
  }

  const userHasAccess = hasAccess();

  if (!userHasAccess) {
    return (
      <ProductionLayout>
        <ProductionNavbar productionId={productionId} />
        <div className="p-6 relative z-10 pt-24">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-4V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
              <p className="text-slate-600 mb-6">You don&apos;t have permission to view this production</p>
            </div>
          </div>
        </div>
      </ProductionLayout>
    );
  }

  return (
    <ProductionLayout>

      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} onOpenBroadcast={handleBroadcastMode} />

      <div className="p-6 relative z-10">

        {/* Header with mode navigation */}
        <div className="mb-12">
          <div className="bg-[var(--white)] p-8" style={{ boxShadow: 'none', border: 'none' }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div 
                  className="p-4 rounded-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${getStatusColors(production.status).accent}20, ${getStatusColors(production.status).secondary}20)`
                  }}
                >
                  <FileVideo 
                    className="w-10 h-10" 
                    style={{ color: getStatusColors(production.status).accent }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2 tracking-tight">
                      {production.name}
                    </h1>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleOpenEdit}
                      className="mb-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      aria-label="Edit production"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {production.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Files</h2>
            <Button
              onClick={handleAddFile}
              className="bg-[var(--dark-green)]/80 text-[var(--white)] px-6 py-3 flex items-center gap-2 transition-all duration-300 rounded-xl font-semibold group"
            >
              <Plus className="w-5 h-5" />
              Add File
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.length > 0 ? (
              files.map((file, index) => {
                // Cycle through accent colors for file cards
                const accentColors = [
                  { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                  { bg: 'from-red-50 to-orange-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-200' },
                  { bg: 'from-yellow-50 to-orange-50', border: 'border-yellow-200', icon: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                  { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', icon: 'text-teal-600', badge: 'bg-teal-100 text-teal-700 border-teal-200' }
                ];
                const colors = accentColors[index % accentColors.length];
                
                return (
                  <Card key={file.id} className={`bg-gradient-to-br ${colors.bg} ${colors.border} p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl border-2 group cursor-pointer`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/80 ${colors.icon}`}>
                          <FileVideo className="w-5 h-5" />
                        </div>
                        <h3 className="text-slate-800 font-semibold flex-1 group-hover:text-slate-900 transition-colors duration-200">{file.name}</h3>
                      </div>
                      <Badge className={`${colors.badge} text-xs font-medium px-2 py-1 rounded-lg`}>
                        {file.file_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    {file.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{file.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span>{new Date(file.created_date).toLocaleDateString()}</span>
                      </div>
                      {file.file_size && (
                        <span className="font-medium">{(file.file_size / 1024).toFixed(0)} KB</span>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No files yet</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Mode Modal */}
      {showBroadcastModal && production && (
        <BroadcastModeModal
          onClose={handleBroadcastCancel}
          onSubmit={handleBroadcastSubmit}
          productionName={production.name}
          userRole="admin"
        />
      )}

      {/* Edit Production Modal */}
      {showEditModal && production && (
        <EditProductionModal
          initialData={{
            name: production.name,
            description: production.description,
            status: production.status,
            start_date: production.start_date,
            color: production.color
          }}
          onClose={handleCloseEdit}
          onSubmit={handleSubmitEdit}
        />
      )}
    </ProductionLayout>
  );
}
