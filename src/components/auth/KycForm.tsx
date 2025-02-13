import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const kycFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  idType: z.enum(["passport", "national_id", "drivers_license"]),
  idNumber: z.string().min(5, "ID number must be at least 5 characters"),
});

type KycFormData = z.infer<typeof kycFormSchema>;

interface KycFormProps {
  onComplete?: () => void;
}

export function KycForm({ onComplete }: KycFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<KycFormData>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      idType: "passport",
      idNumber: "",
    },
  });

  const onSubmit = async (data: KycFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // Update profile with KYC data
      const { error } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'pending',
          kyc_data: data,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "KYC Submitted Successfully",
        description: "Your KYC information has been submitted for verification. You will be notified once it's approved.",
      });

      onComplete?.();
    } catch (error: any) {
      console.error('KYC submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit KYC information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={loading}
                    className="w-full p-2 border rounded"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit KYC"}
        </Button>
      </form>
    </Form>
  );
}
