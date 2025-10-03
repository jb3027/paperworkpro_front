"use client";

import React, { useState, useEffect } from 'react';
import { UserService, ProductionService } from '@/lib/services';
import { User, Production } from '@/lib/mockData';
import { Lock, LockOpen } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, productionsData] = await Promise.all([
        UserService.me(),
        ProductionService.getAll()
      ]);
      
      setUser(userData);
      setProductions(productionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = (production: Production) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return production.members?.includes(user.email) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#fafaf9] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#fafaf9] mb-2">
            Welcome back, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-400 text-lg">
            Select a production to get started
          </p>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productions.map((production) => {
            const userHasAccess = hasAccess(production);
            
            return (
              <Link 
                key={production.id} 
                href={userHasAccess ? `/production/${production.id}` : '#'}
                className={!userHasAccess ? 'pointer-events-none' : ''}
              >
                <motion.div
                  whileHover={userHasAccess ? { scale: 1.02, y: -4 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`bg-[#1e293b] border-gray-800 p-6 transition-all duration-300 relative overflow-hidden ${
                    userHasAccess 
                      ? 'hover:border-[#0d9488] hover:shadow-lg hover:shadow-[#0d9488]/20 cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}>
                    {/* Color accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      userHasAccess 
                        ? 'bg-gradient-to-r from-[#0d9488] to-[#10b981]' 
                        : 'bg-gradient-to-r from-[#991b1b] to-[#f59e0b]'
                    }`} />
                    
                    {/* Lock icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#fafaf9] mb-2">
                          {production.name}
                        </h3>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        userHasAccess 
                          ? 'bg-[#0d9488]/20' 
                          : 'bg-[#991b1b]/20'
                      }`}>
                        {userHasAccess ? (
                          <LockOpen className={`w-6 h-6 text-[#10b981]`} />
                        ) : (
                          <Lock className={`w-6 h-6 text-[#991b1b]`} />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {production.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                      <span className="text-gray-500 text-xs">
                        Created {new Date(production.created_date).toLocaleDateString()}
                      </span>
                      <span className={`text-xs font-semibold ${
                        userHasAccess ? 'text-[#10b981]' : 'text-[#991b1b]'
                      }`}>
                        {userHasAccess ? 'Access Granted' : 'No Access'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {productions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No productions available</p>
          </div>
        )}
      </div>
    </div>
  );
}
