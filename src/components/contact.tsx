"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  function onSubmit() {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
            Get in Touch
          </h2>
          <p className="mt-4 text-body-text max-w-2xl mx-auto">
            Have a question or ready to start a project? Send us a message and
            we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <div className="bg-light-gray rounded-2xl p-8 sm:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="How can we help?"
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl"
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your project..."
                    rows={5}
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold resize-none rounded-xl"
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-gold text-navy font-bold hover:bg-gold-hover hover:shadow-lg rounded-full px-8 py-3 text-sm w-full sm:w-auto cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                {submitted && (
                  <p className="text-emerald-600 text-sm font-medium mt-2">
                    Thank you! Your message has been sent successfully.
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
            <div className="bg-light-gray rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-light rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-navy font-semibold mb-1">Email</h4>
                <p className="text-body-text text-sm">
                  josiah.mwangi@email.com
                </p>
              </div>
            </div>
            <div className="bg-light-gray rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-light rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-navy font-semibold mb-1">Phone</h4>
                <p className="text-body-text text-sm">+254 700 000 000</p>
              </div>
            </div>
            <div className="bg-light-gray rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gold-light rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-navy font-semibold mb-1">Location</h4>
                <p className="text-body-text text-sm">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
