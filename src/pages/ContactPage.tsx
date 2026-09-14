import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-10 bg-slate-50">
      
      <div className="ui-card p-8 space-y-3 shadow-sm border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact NYP Sindh Secretariat</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Get in touch with central management, regional divisional coordinators, or submit inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Official Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="ui-card p-6 space-y-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Official Helpline Contacts</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Shakir Chandio</h4>
                  <span className="text-emerald-800 font-semibold block text-[11px]">Management Focal Person / NYP Sindh</span>
                  <span className="text-slate-700 font-mono text-xs block mt-1">0331 9226110</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Phone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Abdul Rehman Halepoto</h4>
                  <span className="text-emerald-800 font-semibold block text-[11px]">President NYP Sindh</span>
                  <span className="text-slate-700 font-mono text-xs block mt-1">+92 333 7612564</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px] block font-medium">Email Support</span>
                  <span className="text-slate-900 font-bold">abdulrehman_h4@live.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 text-[10px] block font-medium">Provincial Secretariat</span>
                  <span className="text-slate-800 font-medium">Karachi / Hyderabad, Sindh, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form */}
        <div className="md:col-span-7">
          <div className="ui-card p-8 space-y-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Submit Public Inquiry</h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Inquiry Submitted Successfully</h4>
                <p className="text-xs text-slate-600">Thank you for contacting NYP Sindh. Our secretariat officer will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Full Name <span className="text-red-500 font-bold ml-0.5">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Email Address <span className="text-red-500 font-bold ml-0.5">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inquiry / Message <span className="text-red-500 font-bold ml-0.5">*</span></label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your query or feedback..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full ui-btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Message to NYP Secretariat</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
