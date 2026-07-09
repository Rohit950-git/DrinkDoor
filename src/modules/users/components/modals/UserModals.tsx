"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, KeyRound, Truck, UserMinus, ShieldAlert } from "lucide-react";
import { Button } from "@/src/components/common/Button";
import {
  UserForm,
  AssignDistributorForm,
  ResetPasswordForm,
} from "../forms/UserForms";
import { AssignDistributorFields, ResetUserPasswordFields } from "../../validation/userSchema";

/**
 * 1. Reusable Base Modal Wrapper
 */
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient gold glow highlight inside the modal */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 select-none">
              <div>
                <h3 className="text-base font-bold text-white font-sans tracking-wide">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-zinc-400 font-sans mt-0.5 leading-normal">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * 2. Delete User Confirmation Modal
 */
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Deauthorise Operator Account"
      description="Permanently remove access for this user."
    >
      <div className="space-y-5 font-sans">
        <div className="flex gap-3.5 p-4 rounded-xl border border-rose-500/10 bg-rose-500/[0.02] text-xs">
          <AlertTriangle className="h-5 w-5 text-rose-450 shrink-0 mt-0.5" />
          <div className="space-y-1 text-zinc-300 leading-relaxed">
            <p className="font-bold text-white">This action is irreversible.</p>
            <p>
              Removing <strong className="text-white">{userName}</strong> will terminate all their active sessions and remove their credentials from the database.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
          <Button variant="outline" onClick={onClose} className="border-white/[0.06] hover:bg-zinc-800 text-xs">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
            isLoading={isLoading}
          >
            Remove Account
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}

/**
 * 3. User Active Status Toggle Confirmation Modal
 */
interface StatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isActive: boolean;
  isLoading?: boolean;
}

export function StatusConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isActive,
  isLoading = false,
}: StatusConfirmationModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isActive ? "Deactivate User Access" : "Reactivate User Access"}
      description="Modify access control states dynamically."
    >
      <div className="space-y-5 font-sans">
        <div className="flex gap-3.5 p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] text-xs">
          {isActive ? (
            <UserMinus className="h-5 w-5 text-amber-450 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-zinc-300 leading-relaxed">
            <p className="font-bold text-white">Temporary State Suspension</p>
            <p>
              Are you sure you want to {isActive ? "deactivate" : "reactivate"} access for{" "}
              <strong className="text-white">{userName}</strong>?{" "}
              {isActive
                ? "They will be blocked from logging into the portal immediately."
                : "They will regain immediate entry into their assigned panel."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
          <Button variant="outline" onClick={onClose} className="border-white/[0.06] hover:bg-zinc-800 text-xs">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={isActive ? "bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs" : "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"}
            isLoading={isLoading}
          >
            {isActive ? "Deactivate" : "Reactivate"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}

/**
 * 4. Assign Distributor Modal
 */
interface AssignDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignDistributorFields) => void;
  userName: string;
  defaultHub?: string;
  isLoading?: boolean;
}

export function AssignDistributorModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  defaultHub = "",
  isLoading = false,
}: AssignDistributorModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Distributor Hub"
      description={`Link logistics nodes for ${userName}.`}
    >
      <div className="space-y-4">
        <div className="flex gap-3.5 p-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-xs text-zinc-300 font-sans">
          <Truck className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <p>
            Assigning a distributor links the retailer's inventory requests directly to that distribution node's dispatch pipeline.
          </p>
        </div>
        <AssignDistributorForm
          onSubmit={onSubmit}
          defaultValues={{ distributor: defaultHub }}
          isLoading={isLoading}
        />
      </div>
    </BaseModal>
  );
}

/**
 * 5. Reset Operator Password Modal
 */
interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResetUserPasswordFields) => void;
  userName: string;
  isLoading?: boolean;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  isLoading = false,
}: ResetPasswordModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Force Operator Password Rotation"
      description={`Regenerate secure login credentials for ${userName}.`}
    >
      <div className="space-y-4">
        <div className="flex gap-3.5 p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/[0.02] text-xs text-zinc-300 font-sans">
          <KeyRound className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            Force rotation updates the credentials immediately. Remind the operator to update their password keys locally.
          </p>
        </div>
        <ResetPasswordForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </BaseModal>
  );
}
