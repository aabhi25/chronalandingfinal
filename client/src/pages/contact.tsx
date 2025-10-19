import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Calendar, Sparkles } from "lucide-react";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent!",
        description: data.message || "Thank you for your message! We'll get back to you soon.",
        duration: 5000,
      });
      form.reset();
    },
    onError: (error: any) => {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-br from-purple-100 to-pink-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-100 to-purple-100 opacity-30 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#FF4D4D] to-[#9333EA]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0C1445] mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your school with AI-powered management? Let's discuss how AI Chrona can help your institution thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Information - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info Cards */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-[#0C1445] mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C1445] mb-1">Email</h3>
                      <a 
                        href="mailto:hello@chrona.in"
                        className="text-gray-600 hover:text-[#9333EA] transition-colors"
                      >
                        hello@chrona.in
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C1445] mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/919999080825"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#9333EA] transition-colors block"
                      >
                        +91-9999-0808-25
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0C1445] mb-1">Office</h3>
                      <p className="text-gray-600">B1/3, Sector 18, Noida</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book a Demo Card */}
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] rounded-3xl p-8 shadow-lg text-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">Book a Demo</h3>
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">
                  See AI Chrona in action! Schedule a personalized demo to explore how our AI-powered platform can transform your school's operations.
                </p>
                <Button 
                  className="w-full bg-white text-[#8B5CF6] hover:bg-gray-100 font-semibold py-6 rounded-full transition-all duration-300 hover:scale-105"
                  data-testid="button-schedule-demo"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-[#0C1445] mb-8">Send us a Message</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0C1445] font-semibold">Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field} 
                                className="h-12 rounded-xl border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]/20"
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0C1445] font-semibold">Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your@email.com" 
                                {...field} 
                                className="h-12 rounded-xl border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]/20"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0C1445] font-semibold">School/Organization</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your institution name" 
                                {...field} 
                                className="h-12 rounded-xl border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]/20"
                                data-testid="input-company"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0C1445] font-semibold">Phone</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+91-9999080825" 
                                {...field} 
                                className="h-12 rounded-xl border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]/20"
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0C1445] font-semibold">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your school's needs and how we can help..."
                              className="min-h-[140px] rounded-xl border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]/20 resize-none"
                              {...field} 
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#FF4D4D] to-[#9333EA] text-white hover:shadow-xl font-semibold py-6 rounded-full text-lg transition-all duration-300 hover:scale-105" 
                      disabled={contactMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
