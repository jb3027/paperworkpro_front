"use client";

import React, { useState, useEffect } from "react";
import { Production } from "@/app/components/entities/Production";
import { User } from "@/app/components/entities/User";
import { createPageUrl } from "@/app/components/utils";
import { Plus, Folder, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import ProductionCard from "../components/productions/productionCard";
import CreateProductionModal from "../components/productions/createProductionModal";

export default function ProductionsPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allProductions = await Production.filter({});
      const accessibleProductions = allProductions.filter(prod => 
        prod.members?.includes(currentUser.email) || 
        currentUser.role === 'admin'
      );
      setProductions(accessibleProductions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateProduction = async (data: Omit<Production, 'id'>) => {
    await Production.create({
      ...data,
      members: [user?.email || '']
    });
    setShowCreateModal(false);
    loadData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="min-h-screen bg-dark-green p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#fafaf9] mb-3">
              Productions
            </h1>
            <p className="text-gray-400 text-lg">
              Access and manage your production files
            </p>
          </div>
          {canEdit && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#065f46] to-[#0d9488] hover:from-[#064e3b] hover:to-[#0f766e] text-[#fafaf9] shadow-lg shadow-[#065f46]/20 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Production
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
          </div>
        ) : productions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#1e293b] rounded-2xl flex items-center justify-center">
              <Folder className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-[#fafaf9] mb-2">
              No productions yet
            </h3>
            <p className="text-gray-400 mb-6">
              {canEdit ? "Create your first production to get started" : "You don't have access to any productions yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {productions.map((production) => (
                <ProductionCard 
                  key={production.id} 
                  production={production} 
                  user={user}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateProductionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProduction}
        />
      )}
    </div>
  );
}