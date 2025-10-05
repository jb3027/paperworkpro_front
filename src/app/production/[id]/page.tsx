"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductionService, FileService, UserService } from "@/lib/services";
import { Production, File, User } from "@/lib/mockData";
import { ArrowLeft, FileVideo, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ProductionNavbar } from "@/app/components/ui/production-navbar";
import BroadcastModeModal from "@/app/components/modals/BroadcastModeModal";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-[var(--black)] text-xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">Production not found</p>
              <Link href="/">
                <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9]">
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
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Production Navbar */}
        <ProductionNavbar productionId={productionId} />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="mb-6 inline-flex p-6 rounded-full bg-[#991b1b]/20">
                <FileVideo className="w-12 h-12 text-[#991b1b]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--black)] mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-6">You don't have permission to view this production</p>
              <Link href="/">
                <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9]">
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
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto mt-20">
          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-[var(--black)] hover:bg-gray-100 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

        {/* Header with mode navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#0d9488]/20">
                <FileVideo className="w-8 h-8 text-[#0d9488]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[var(--black)]">
                  {production.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {production.description || 'No description available'}
                </p>
              </div>
            </div>
            {/* Mode Navigation */}
            <div className="flex gap-4">
              <Link href={`/production/${productionId}/edit-mode`}>
                <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9] px-8 py-6 text-lg">
                  Create Paperwork
                </Button>
              </Link>
              
                <Button 
                onClick={handleBroadcastMode}
                className="bg-[#991b1b] hover:bg-[#991b1b]/80 text-[#fafaf9] px-8 py-6 text-lg">
                  Broadcast Mode
                </Button>

                <Link href={`/production/${productionId}/broadcast-mode`}>
              </Link>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[var(--black)]">Files</h2>
            <Button
              onClick={handleAddFile}
              className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-[#fafaf9] px-4 py-2 flex items-center gap-2 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add File
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.length > 0 ? (
              files.map((file) => (
                <Card key={file.id} className="bg-white border-gray-200 p-5 hover:border-[#0d9488] transition-colors shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[var(--black)] font-medium flex-1">{file.name}</h3>
                    <Badge className="bg-[#0d9488]/20 text-[#10b981] border-[#0d9488]/30 text-xs">
                      {file.file_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  
                  {file.description && (
                    <p className="text-gray-600 text-sm mb-3">{file.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>{new Date(file.created_date).toLocaleDateString()}</span>
                    {file.file_size && (
                      <span>{(file.file_size / 1024).toFixed(0)} KB</span>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No files in this production yet</p>
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
    </div>
  );
}
