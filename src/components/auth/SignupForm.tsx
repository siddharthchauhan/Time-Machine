import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Mail, User } from "lucide-react";
import { AuthError } from "./AuthError";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function SignupForm() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const result = await signUp(values.email, values.password, values.fullName);
      
      if (result && result.error) {
        setAuthError(result.error.message || "Registration failed. Please try again with different credentials.");
      } else {
        toast({
          title: "Registration successful",
          description: "Please check your email for a confirmation link",
        });
        
        navigate("/auth");
      }
    } catch (error: any) {
      setAuthError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-muted-foreground">Enter your information to get started</p>
      </div>
      
      {authError && <AuthError message={authError} />}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full max-w-md">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/70">Full Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      className="pl-10 bg-secondary/50 border-white/10 focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/70">Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      className="pl-10 bg-secondary/50 border-white/10 focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/70">Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-secondary/50 border-white/10 focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
