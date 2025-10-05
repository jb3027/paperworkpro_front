"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/app/components/ui/badge";
import { Production } from "@/app/components/entities/Production";
import { User } from "@/app/components/entities/User";

const statusColors = {
  pre_production: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30",
  in_production: "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30",
  post_production: "bg-[#0d9488]/20 text-[#0d9488] border-[#0d9488]/30",
  completed: "bg-[#065f46]/20 text-[#065f46] border-[#065f46]/30",
  archived: "bg-gray-700/20 text-gray-400 border-gray-700/30"
};

interface ProductionCardProps {
  production: Production;
  user: User | null;
}

export default function ProductionCard({ production }: ProductionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/production/${production.id}`}>
        <div className="group relative bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-[#0d9488]/20">
          {production.cover_image ? (
            <div className="h-48 overflow-hidden">
              <Image 
                src={production.cover_image} 
                alt={production.name}
                width={400}
                height={192}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div 
              className="h-48 flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${production.color || '#065f46'} 0%, ${production.color || '#0d9488'} 100%)`
              }}
            >
              <span className="text-6xl font-bold text-[#fafaf9]/20">
                {production.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Badge className={`${statusColors[production.status || 'archived']} border font-medium`}>
              {production.status?.replace(/_/g, ' ') || 'Unknown'}
            </Badge>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-[#fafaf9] mb-2 group-hover:text-[#10b981] transition-colors duration-300">
              {production.name}
            </h3>
            
            {production.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {production.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                {production.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(production.start_date), "MMM d, yyyy")}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{production.members?.length || 0}</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#10b981] group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}