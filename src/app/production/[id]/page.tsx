"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductionService, FileService, UserService } from "@/lib/services";
import { Production, File, User } from "@/lib/mockData";
import { ArrowLeft, FileVideo, Plus, Pencil, Info } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ProductionNavbar } from "@/app/components/ui/production-navbar";
import BroadcastModeModal from "@/app/components/modals/BroadcastModeModal";
import EditProductionModal from "@/app/components/modals/EditProductionModal";
import ProductionInfoModal from "@/app/components/modals/ProductionInfoModal";
import Link from "next/link";

export default function ProductionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productionId = params.id as string;

  const [production, setProduction] = useState<Production | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  

  useEffect(() => {
    loadData();
  }, [productionId]);

  const loadData = async () => {
    try {
      const [userData, productionsData, filesData] = await Promise.all([
        UserService.me(),
        ProductionService.getAll(),
        FileService.getByProduction(productionId)
      ]);

      setUser(userData);
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

  const handleBroadcastSubmit = (formData: any) => {
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

  const handleOpenInfo = () => {
    setShowInfoModal(true);
  };

  const handleCloseInfo = () => {
    setShowInfoModal(false);
  };

  const handleSubmitEdit = async (data: any) => {
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


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #35c29a 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #35c29a 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6 relative z-10">
          <div className="max-w-7xl mx-auto pt-40 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <FileVideo className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-slate-700 text-xl font-semibold">Loading production...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #35c29a 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #35c29a 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6 relative z-10">
          <div className="max-w-7xl mx-auto pt-40 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileVideo className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Production not found</h1>
              <p className="text-slate-600 mb-6">The production you're looking for doesn't exist or has been removed</p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userHasAccess = hasAccess();

  if (!userHasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #35c29a 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #35c29a 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6 relative z-10">
          <div className="max-w-7xl mx-auto pt-40 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-4V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
              <p className="text-slate-600 mb-6">You don't have permission to view this production</p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #35c29a 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #35c29a 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} />
      
      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto pt-20">
          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 mb-8 transition-all duration-200 rounded-xl px-4 py-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

        {/* Header with mode navigation */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-sm">
                  <FileVideo className="w-10 h-10 text-emerald-600" />
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
                    <Button 
                    size="icon"
                    onClick={handleOpenInfo}
                    className="mb-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    aria-label="Production Info"
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {production.description || 'No description available'}
                  </p>
                </div>
              </div>
              {/* Mode Navigation */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/production/${productionId}/edit-mode`}>
                  <Button className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 group">
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Paperwork
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleBroadcastMode}
                  className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 group">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Broadcast Mode
                </Button>
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

      {/* Production Info Modal */}
      {showInfoModal && production && (
        <ProductionInfoModal
          production={production}
          onClose={handleCloseInfo}
        />
      )}
    </div>
  );
}
