import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface EditModeToggleProps {
  editMode: boolean;
  onToggle: () => void;
}

export default function EditModeToggle({ editMode, onToggle }: EditModeToggleProps) {
  return (
    <Button
      onClick={onToggle}
      className={`relative overflow-hidden transition-all duration-300 ${
        editMode 
          ? 'bg-gradient-to-r from-[#f59e0b] to-[#991b1b] hover:from-[#d97706] hover:to-[#7f1d1d]' 
          : 'bg-[#1e293b] hover:bg-[#065f46] border border-gray-800'
      } text-[#fafaf9]`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: editMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        {editMode ? (
          <>
            <Eye className="w-5 h-5" />
            View Mode
          </>
        ) : (
          <>
            <Edit3 className="w-5 h-5" />
            Edit Mode
          </>
        )}
      </motion.div>
    </Button>
  );
}