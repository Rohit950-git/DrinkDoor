import { apiSlice } from "@/src/store/apiSlice";
import { UserItem, CreateUserDto, UpdateUserDto, UserListResponse } from "../types";
import { UserRole } from "@/src/modules/auth/types";

// Local in-memory store for demo CRUD simulation
let mockUsers: UserItem[] = [
  {
    id: "usr-100",
    name: "Marcus Aurelius",
    email: "marcus@drinkdoor.com",
    phone: "+1 (555) 111-2222",
    role: UserRole.ADMIN,
    isActive: true,
    lastLogin: "10 mins ago",
    createdAt: "2026-01-15",
  },
  {
    id: "usr-101",
    name: "Julius Caesar",
    email: "julius@apexlogs.com",
    phone: "+1 (555) 222-3333",
    role: UserRole.DISTRIBUTOR,
    isActive: true,
    distributor: "Apex Logistics",
    lastLogin: "25 mins ago",
    createdAt: "2026-02-01",
  },
  {
    id: "usr-102",
    name: "Cleopatra Philopator",
    email: "cleo@centralbevs.com",
    phone: "+1 (555) 333-4444",
    role: UserRole.SHOPKEEPER,
    isActive: true,
    distributor: "Apex Logistics",
    lastLogin: "1 hour ago",
    createdAt: "2026-02-15",
  },
  {
    id: "usr-103",
    name: "Alexander Magnus",
    email: "alexander@quickstop.com",
    phone: "+1 (555) 444-5555",
    role: UserRole.SHOPKEEPER,
    isActive: false,
    distributor: "Global Transit",
    lastLogin: "1 day ago",
    createdAt: "2026-03-01",
  },
  {
    id: "usr-104",
    name: "Hanibal Barca",
    email: "hanibal@globaltransit.com",
    phone: "+1 (555) 555-6666",
    role: UserRole.DISTRIBUTOR,
    isActive: true,
    distributor: "Global Transit",
    lastLogin: "3 days ago",
    createdAt: "2026-03-10",
  },
];

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, void>({
      queryFn: async () => {
        return { data: { success: true, data: [...mockUsers], totalCount: mockUsers.length } };
      },
      providesTags: ["Auth"],
    }),
    createUser: builder.mutation<{ success: boolean; data: UserItem }, CreateUserDto>({
      queryFn: async (newUser) => {
        const created: UserItem = {
          id: `usr-${Math.floor(Math.random() * 900) + 105}`,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || "",
          role: newUser.role,
          isActive: true,
          distributor: newUser.distributor,
          createdAt: new Date().toISOString().split("T")[0],
        };
        mockUsers.push(created);
        return { data: { success: true, data: created } };
      },
      invalidatesTags: ["Auth"],
    }),
    updateUser: builder.mutation<{ success: boolean; data: UserItem }, { id: string; body: UpdateUserDto }>({
      queryFn: async ({ id, body }) => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers[index] = {
            ...mockUsers[index],
            name: body.name,
            email: body.email,
            phone: body.phone,
            role: body.role,
            distributor: body.distributor,
          };
          return { data: { success: true, data: mockUsers[index] } };
        }
        return { error: { status: 404, data: { message: "User not found" } } as any };
      },
      invalidatesTags: ["Auth"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        mockUsers = mockUsers.filter((u) => u.id !== id);
        return { data: { success: true } };
      },
      invalidatesTags: ["Auth"],
    }),
    toggleUserStatus: builder.mutation<{ success: boolean; data: UserItem }, { id: string; isActive: boolean }>({
      queryFn: async ({ id, isActive }) => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], isActive };
          return { data: { success: true, data: mockUsers[index] } };
        }
        return { error: { status: 404, data: { message: "User not found" } } as any };
      },
      invalidatesTags: ["Auth"],
    }),
    assignDistributor: builder.mutation<{ success: boolean; data: UserItem }, { id: string; distributor: string }>({
      queryFn: async ({ id, distributor }) => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], distributor };
          return { data: { success: true, data: mockUsers[index] } };
        }
        return { error: { status: 404, data: { message: "User not found" } } as any };
      },
      invalidatesTags: ["Auth"],
    }),
    resetUserPassword: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useAssignDistributorMutation,
  useResetUserPasswordMutation,
} = usersApi;
