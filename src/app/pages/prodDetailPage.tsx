"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Production } from "@/app/components/entities/Production";
import { File } from "@/app/components/entities/File";
import { User } from "@/app/components/entities/User";
import { ArrowLeft, Edit3, Plus, Grid, List, Loader2 } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/app/components/utils";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

import FileCard from "../components/files/FileCard";
import FileUploadZone from "../components/files/FileUploadZone";
import CreateFileModal from "../components/files/CreateFileModal";
import EditModeToggle from "../components/files/EditModeToggle";

export default function ProductionDetailPage() {
  const searchParams = useSearchParams();
  const productionId = searchParams.get("id");

  const [production, setProduction] = useState<Production | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const prod = await Production.filter({ id: productionId || undefined });
      if (prod.length > 0) {
        setProduction(prod[0]);
      }

      const prodFiles = await File.filter({ production_id: productionId || undefined }, "-created_date");
      setFiles(prodFiles);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [productionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileUpload = async (uploadedFiles: any[]) => {
    await Promise.all(uploadedFiles.map(file => 
      File.create({
        production_id: productionId || undefined,
        ...file
      })
    ));
    loadData();
  };

  const handleCreateFile = async (fileData: any) => {
    await File.create({
      production_id: productionId || undefined,
      ...fileData
    });
    setShowCreateModal(false);
    loadData();
  };

  const handleDeleteFile = async (fileId: string) => {
    await File.delete(fileId);
    loadData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  const filteredFiles = filterType === "all" 
    ? files 
    : files.filter(f => f.file_type === filterType);

  const fileTypes = ["all", "contract", "script", "schedule", "budget", "call_sheet", "release_form", "permit", "invoice", "other"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-gray-400">Production not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href={createPageUrl("Productions")}>
            <Button variant="ghost" className="text-gray-400 hover:text-[#fafaf9] hover:bg-[#1e293b] mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Productions
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#fafaf9] mb-3">
                {production.name}
              </h1>
              {production.description && (
                <p className="text-gray-400 text-lg">{production.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {canEdit && (
                <>
                  <EditModeToggle 
                    editMode={editMode} 
                    onToggle={() => setEditMode(!editMode)}
                  />
                  {editMode && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-[#0d9488] to-[#10b981] hover:from-[#0f766e] hover:to-[#059669] text-[#fafaf9]"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create File
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
              <TabsList className="bg-[#1e293b] border border-gray-800 overflow-x-auto flex-nowrap">
                {fileTypes.map(type => (
                  <TabsTrigger 
                    key={type}
                    value={type}
                    className="data-[state=active]:bg-[#065f46] data-[state=active]:text-[#fafaf9] text-gray-400"
                  >
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`border-gray-800 ${viewMode === 'grid' ? 'bg-[#065f46] text-[#fafaf9]' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`border-gray-800 ${viewMode === 'list' ? 'bg-[#065f46] text-[#fafaf9]' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {editMode && canEdit && (
          <div className="mb-8">
            <FileUploadZone 
              onFilesUploaded={handleFileUpload}
              productionId={productionId}
            />
          </div>
        )}

        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
          : "space-y-3"
        }>
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <FileCard 
                key={file.id}
                file={file}
                editMode={editMode}
                viewMode={viewMode}
                onDelete={handleDeleteFile}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#1e293b] rounded-2xl flex items-center justify-center">
              <Grid className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-[#fafaf9] mb-2">
              No files yet
            </h3>
            <p className="text-gray-400">
              {editMode ? "Upload or create files to get started" : "No files have been added to this production"}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateFileModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFile}
        />
      )}
    </div>
  );
}
