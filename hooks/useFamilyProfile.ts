'use client';

import { useState, useCallback, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'adult' | 'child' | 'teen' | 'senior';
  allergies: string[];
  restrictions: string[];
  likes: string[];
  dislikes: string[];
  notes?: string;
}

export interface FamilyProfile {
  id: string;
  userId: string;
  familyName: string;
  members: FamilyMember[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    cuisineTypes?: string[];
    mealPrepStyle?: 'quick' | 'batch' | 'traditional';
    budgetLevel?: 'budget' | 'moderate' | 'premium';
    organicPreference?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseFamilyProfileReturn {
  profile: FamilyProfile | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: (userId: string) => Promise<void>;
  saveProfile: (profile: Partial<FamilyProfile>) => Promise<void>;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  removeMember: (memberId: string) => void;
  clearProfile: () => void;
}

// Generate a simple unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Local storage key
const STORAGE_KEY = 'bestmealmate_family_profile';

export function useFamilyProfile(): UseFamilyProfileReturn {
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      console.warn('Failed to load family profile from local storage');
    }
  }, []);

  // Save to local storage whenever profile changes
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch {
        console.warn('Failed to save family profile to local storage');
      }
    }
  }, [profile]);

  // Load profile from Supabase
  const loadProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    const supabase = getSupabaseClient();

    // If no Supabase, use local storage only
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('family_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw dbError;
      }

      if (data) {
        const loadedProfile: FamilyProfile = {
          id: data.id,
          userId: data.user_id,
          familyName: data.family_name || 'My Family',
          members: data.members || [],
          skillLevel: data.skill_level || 'intermediate',
          preferences: data.preferences || {},
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setProfile(loadedProfile);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
      console.error('Load profile error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to Supabase
  const saveProfile = useCallback(async (updates: Partial<FamilyProfile>) => {
    setIsLoading(true);
    setError(null);

    const updatedProfile: FamilyProfile = {
      id: profile?.id || generateId(),
      userId: updates.userId || profile?.userId || '',
      familyName: updates.familyName || profile?.familyName || 'My Family',
      members: updates.members || profile?.members || [],
      skillLevel: updates.skillLevel || profile?.skillLevel || 'intermediate',
      preferences: { ...profile?.preferences, ...updates.preferences },
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfile(updatedProfile);

    const supabase = getSupabaseClient();

    // If no Supabase, local storage save happens via useEffect
    if (!supabase || !updatedProfile.userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabase.from('family_profiles').upsert(
        {
          id: updatedProfile.id,
          user_id: updatedProfile.userId,
          family_name: updatedProfile.familyName,
          members: updatedProfile.members,
          skill_level: updatedProfile.skillLevel,
          preferences: updatedProfile.preferences,
          updated_at: updatedProfile.updatedAt,
        },
        { onConflict: 'user_id' }
      );

      if (dbError) throw dbError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      setError(message);
      console.error('Save profile error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Add a family member
  const addMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: generateId(),
    };

    setProfile((prev) => {
      if (!prev) {
        return {
          id: generateId(),
          userId: '',
          familyName: 'My Family',
          members: [newMember],
          skillLevel: 'intermediate',
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        members: [...prev.members, newMember],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Update a family member
  const updateMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.map((m) =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Remove a family member
  const removeMember = useCallback((memberId: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Clear the profile
  const clearProfile = useCallback(() => {
    setProfile(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    saveProfile,
    addMember,
    updateMember,
    removeMember,
    clearProfile,
  };
}

export default useFamilyProfile;
