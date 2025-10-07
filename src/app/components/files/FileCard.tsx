import React from "react";
import { motion } from "framer-motion";
import { FileText, Film, Calendar, DollarSign, FileCheck, ClipboardList, ShieldCheck, Receipt, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { FileData } from "@/app/components/entities/File";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

type FileType = 'contract' | 'script' | 'schedule' | 'budget' | 'call_sheet' | 'release_form' | 'permit' | 'invoice' | 'other';

const fileTypeIcons: Record<FileType, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string; bg: string }> = {
  contract: { icon: FileCheck, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/20" },
  script: { icon: Film, color: "text-[#0d9488]", bg: "bg-[#0d9488]/20" },
  schedule: { icon: Calendar, color: "text-[#10b981]", bg: "bg-[#10b981]/20" },
  budget: { icon: DollarSign, color: "text-[#991b1b]", bg: "bg-[#991b1b]/20" },
  call_sheet: { icon: ClipboardList, color: "text-[#065f46]", bg: "bg-[#065f46]/20" },
  release_form: { icon: FileCheck, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/20" },
  permit: { icon: ShieldCheck, color: "text-[#10b981]", bg: "bg-[#10b981]/20" },
  invoice: { icon: Receipt, color: "text-[#991b1b]", bg: "bg-[#991b1b]/20" },
  other: { icon: FileText, color: "text-gray-400", bg: "bg-gray-700/20" }
};

interface FileCardProps {
  file: FileData;
  editMode: boolean;
  viewMode: 'grid' | 'list';
  onDelete: (fileId: string) => void;
}

export default function FileCard({ file, editMode, viewMode, onDelete }: FileCardProps) {
  const fileTypeConfig = fileTypeIcons[file.file_type] || fileTypeIcons.other;
  const IconComponent = fileTypeConfig.icon;

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-[#1e293b] rounded-xl p-4 border border-gray-800 hover:border-[#0d9488] transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-lg ${fileTypeConfig.bg} flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-6 h-6 ${fileTypeConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#fafaf9] font-semibold truncate">{file.name}</h3>
              <p className="text-gray-400 text-sm">
                {file.created_date ? format(new Date(file.created_date), "MMM d, yyyy") : "No date"}
              </p>
            </div>
          </div>

          <Badge className="bg-[#065f46]/20 text-[#10b981] border-[#065f46]/30 border flex-shrink-0">
            {file.file_type.replace(/_/g, ' ')}
          </Badge>

          <div className="flex items-center gap-2 flex-shrink-0">
            {file.file_url && (
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#10b981]">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            {editMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#fafaf9]">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1e293b] border-gray-800">
                  <DropdownMenuItem onClick={() => file.id && onDelete(file.id)} className="text-[#991b1b] focus:text-[#991b1b]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#1e293b] rounded-2xl p-5 border border-gray-800 hover:border-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-[#0d9488]/10"
    >
      {editMode && (
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 bg-dark-green/80 backdrop-blur-sm text-gray-400 hover:text-[#fafaf9] hover:bg-dark-green"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1e293b] border-gray-800">
              <DropdownMenuItem onClick={() => file.id && onDelete(file.id)} className="text-[#991b1b] focus:text-[#991b1b]">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-2xl ${fileTypeConfig.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`w-8 h-8 ${fileTypeConfig.color}`} />
        </div>

        <h3 className="text-[#fafaf9] font-semibold mb-1 line-clamp-2 text-sm">
          {file.name}
        </h3>

        <p className="text-gray-500 text-xs mb-3">
          {file.created_date ? format(new Date(file.created_date), "MMM d, yyyy") : "No date"}
        </p>

        <Badge className="bg-[#065f46]/20 text-[#10b981] border-[#065f46]/30 border text-xs">
          {file.file_type.replace(/_/g, ' ')}
        </Badge>

        {file.file_url && (
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-[#0d9488] hover:text-[#10b981] text-xs font-medium flex items-center gap-1 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            Open File
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}