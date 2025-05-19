"use-client";
import { useState } from "react";
import { SizeColumn } from "./columns";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface Props {
  data: SizeColumn;
}

export const CellAction = ({ data }: Props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // For Update
  const router = useRouter();
  const { storeId } = useParams();

  // For Copy
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Size Id copied to the clipboard.");
  };

  // For Delete
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/sizes/${data.id}`);
      router.refresh();
      toast.success("Size deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all size using this billboard first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-semibold text-sm ml-5">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/${storeId}/sizes/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
