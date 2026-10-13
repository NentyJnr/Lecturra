import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  organizationsService,
  type WorkspaceItem,
} from "@/lib/api/services/organizations";

interface WorkspaceState {
  activeWorkspaceId: string;
  workspaces: WorkspaceItem[];
  isLoading: boolean;
  getActiveWorkspace: () => WorkspaceItem | undefined;
  setActiveWorkspace: (id: string) => void;
  fetchWorkspaces: () => Promise<void>;
  updateWorkspaceCredits: (workspaceId: string, creditsDeducted: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: "personal",
      workspaces: [
        {
          id: "personal",
          name: "Personal Account",
          credits: 1500,
          role: "Owner",
          isPersonal: true,
          memberCount: 1,
        },
      ],
      isLoading: false,

      getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return (
          workspaces.find((w) => w.id === activeWorkspaceId) ||
          workspaces.find((w) => w.isPersonal) ||
          workspaces[0]
        );
      },

      setActiveWorkspace: (id: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("lecturra_active_workspace", id);
        }
        set({ activeWorkspaceId: id });
      },

      fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
          const list = await organizationsService.getMyWorkspaces();
          if (list && list.length > 0) {
            set((state) => {
              const stillValid = list.some((w) => w.id === state.activeWorkspaceId);
              const nextActiveId = stillValid ? state.activeWorkspaceId : "personal";
              if (typeof window !== "undefined") {
                localStorage.setItem("lecturra_active_workspace", nextActiveId);
              }
              return {
                workspaces: list,
                activeWorkspaceId: nextActiveId,
                isLoading: false,
              };
            });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      updateWorkspaceCredits: (workspaceId: string, creditsDeducted: number) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? { ...w, credits: Math.max(0, w.credits - creditsDeducted) }
              : w
          ),
        }));
      },
    }),
    {
      name: "lecturra-workspace-context",
      partialize: (s) => ({
        activeWorkspaceId: s.activeWorkspaceId,
      }),
    }
  )
);
