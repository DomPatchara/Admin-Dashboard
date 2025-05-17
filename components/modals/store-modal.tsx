"use client";

import axios from "axios";
import { Modal } from "../ui/modal";
import { useStoreModal } from "@/store/use-store-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

// create Zod schema
const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"), //  define ออกแบบ form
});

export const StoreModal = () => {

  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  // Set up "useForm"
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // connect zod to react form validation
    defaultValues: {
      name: "",
    },
  });


  // Submit fn create "Store Name" -----> post ไปยัง Database(MongoDB)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("value", values);

    try {
      setLoading(true);

      const response = await axios.post("/api/stores", values); // post value จากการตั้งชื่อร้านค้า

      window.location.assign(`/${response.data.id}`) // full Page reload 100%
      toast.success("Store created.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Create a new store"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>  
              <FormField
                control={form.control}
                name="name" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading} // loading = true   ----> component จะใช้งานไม่ได้
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancle
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
