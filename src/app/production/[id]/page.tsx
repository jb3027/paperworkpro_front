"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductionService, FileService, UserService } from "@/lib/services";
import { Production, File, User } from "@/lib/mockData";
import { ArrowLeft, Lock, LockOpen } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ProductionNavbar } from "@/app/components/ui/production-navbar";
import Link from "next/link";

export default function ProductionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productionId = params.id as string;

  const [production, setProduction] = useState<Production | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [productionId]);

  const loadData = async () => {
    try {
      const [userData, productionsData, filesData] = await Promise.all([
        UserService.me(),
        ProductionService.getAll(),
        FileService.getAll()
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--white)] flex items-center justify-center">
        <div className="text-[var(--black)] text-xl">Loading...</div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen bg-[var(--white)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Production not found</p>
          <Link href="/">
            <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userHasAccess = hasAccess();

  if (!userHasAccess) {
    return (
      <div className="min-h-screen bg-[var(--white)] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 inline-flex p-6 rounded-full bg-[#991b1b]/20">
            <Lock className="w-12 h-12 text-[#991b1b]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--black)] mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to view this production</p>
          <Link href="/">
            <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--white)]">
      {/* Production Navbar */}
      <ProductionNavbar productionId={productionId} onAddFile={handleAddFile} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-[var(--black)] hover:bg-gray-100 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

        {/* Header with mode navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[#0d9488]/20">
              <LockOpen className="w-6 h-6 text-[#10b981]" />
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
          <div className="flex gap-4 mt-6">
            <Link href={`/production/${productionId}/edit-mode`}>
              <Button className="bg-[#0d9488] hover:bg-[#0d9488]/80 text-[#fafaf9] px-8 py-6 text-lg">
                Edit Mode
              </Button>
            </Link>
            <Link href={`/production/${productionId}/broadcast-mode`}>
              <Button className="bg-[#f59e0b] hover:bg-[#f59e0b]/80 text-[#fafaf9] px-8 py-6 text-lg">
                Broadcast Mode
              </Button>
            </Link>
          </div>
        </div>

        {/* Files Section */}
        <div>
          <h2 className="text-2xl font-semibold text-[var(--black)] mb-6">Files</h2>
          
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
    </div>
  );
}
