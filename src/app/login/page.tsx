"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/lib/services';
import { mockUsers } from '@/lib/mockData';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Folder, Users, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, we'll use any password
      await UserService.login(email, password);
      router.push('/');
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo123'); // Demo password
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#065f46] to-[#0d9488] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Folder className="w-8 h-8 text-[#fafaf9]" />
          </div>
          <h1 className="text-3xl font-bold text-[#fafaf9] mb-2">ProDocs</h1>
          <p className="text-gray-400">Production File Management</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#1e293b] border-gray-800 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#fafaf9]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-[#0f172a] border-gray-800 text-[#fafaf9]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#fafaf9]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-[#0f172a] border-gray-800 text-[#fafaf9]"
              />
            </div>

            {error && (
              <div className="text-[#991b1b] text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#065f46] hover:bg-[#065f46]/80 text-[#fafaf9]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        {/* Demo Users */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#fafaf9] mb-4 text-center">
            Demo Users
          </h3>
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <Card key={user.id} className="bg-[#1e293b] border-gray-800 p-4 hover:border-[#0d9488] transition-colors cursor-pointer">
                <div 
                  className="flex items-center justify-between"
                  onClick={() => quickLogin(user.email)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-[#f59e0b]/20' :
                      user.role === 'editor' ? 'bg-[#0d9488]/20' :
                      'bg-gray-700/20'
                    }`}>
                      {user.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-[#f59e0b]" />
                      ) : user.role === 'editor' ? (
                        <Users className="w-5 h-5 text-[#0d9488]" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#fafaf9] font-medium">{user.full_name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                    user.role === 'editor' ? 'bg-[#0d9488]/20 text-[#0d9488]' :
                    'bg-gray-700/20 text-gray-400'
                  }`}>
                    {user.role.toUpperCase()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-gray-500 text-sm text-center mt-4">
            Click on any user to auto-fill credentials. Password: demo123
          </p>
        </div>
      </div>
    </div>
  );
}
