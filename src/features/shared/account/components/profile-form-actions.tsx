"use client";

import { Button } from "@/shared/ui/button";

interface Props {
  isLoading: boolean;
}

export function ProfileFormActions({ isLoading }: Props) {
  return (
    <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
      <Button
        type="button"
        variant="outline"
        className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 bg-red-50 font-medium px-8"
      >
        Delete My Account
      </Button>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
