import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { supabase } from "../lib/supabaseClient";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   CONTACT HERO SECTION WITH BACKGROUND VIDEO
   ========================================== */
function ContactHero({ onSelectCategory }) {
  const containerRef = useRef(null);
  const defaultYoutubeId = "FWIJr42Ezfw";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], ["0px", "-40px"]);

  const inquiryTypes = [
    { label: "PROJECTS →", value: "PROJECTS", email: "projects@sikrick.com" },
    { label: "TALENT →", value: "TALENT", email: "talent@sikrick.com" },
    { label: "GENERAL →", value: "GENERAL", email: "hello@sikrick.com" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between p-6 md:p-12 border-b border-neutral-900"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
        <video
          src="/REEL 6 WEB.mp4" /* Path relative to public folder */
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover select-none filter grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Main Title Content */}
      <motion.div
        style={{ opacity, y: yOffset }}
        className="z-10 flex flex-col items-start max-w-7xl my-auto"
      >
        <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-thin tracking-tighter leading-[0.95] text-white uppercase font-sans break-words w-full drop-shadow-2xl">
          MAKE SOMETHING WITH US.
        </h1>
        <p className="text-[11px] md:text-xs tracking-[0.3em] text-neutral-300 font-light uppercase max-w-2xl mt-8 leading-relaxed drop-shadow">
          For projects, collaborations, talent and creative enquiries.
        </p>

        {/* Quick Router Buttons */}
        <div className="flex flex-wrap gap-4 md:gap-6 mt-10">
          {inquiryTypes.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(item.value)}
              className="font-mono text-xs md:text-sm tracking-[0.25em] font-bold text-black bg-white hover:bg-neutral-200 px-6 py-3.5 uppercase transition-all duration-300 border border-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

/* ==========================================
   CONTACT FORM SECTION
   ========================================== */
function ContactFormSection({ selectedCategory, formRef }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: selectedCategory || "PROJECTS",
    message: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      setFormData((prev) => ({ ...prev, subject: selectedCategory }));
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("TRANSMITTING...");

    // EmailJS Credentials
    const SERVICE_ID = "service_ow97enk";
    const TEMPLATE_ID = "template_y4bxfyn";
    const PUBLIC_KEY = "vcVGmsEGIuZ6iHQiF";

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      enquiry_type: formData.subject,
      message: formData.message,
    };

    try {
      // 1. Save entry to Supabase
      const { error } = await supabase
        .from("contact_inquiries")
        .insert([formData]);

      if (error) console.warn("Supabase insert warning:", error.message);

      // 2. Send email directly via EmailJS API
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      console.log("EmailJS Success:", result.status, result.text);
      setStatus("DISPATCH SENT");

      // Reset form fields
      setFormData({
        name: "",
        email: "",
        subject: selectedCategory || "PROJECTS",
        message: "",
      });
    } catch (err) {
      console.error("Transmission Error:", err);
      setStatus("TRANSMISSION ERROR");
    }
  };

  return (
    <section ref={formRef} className="w-full bg-black py-12 md:py-24 px-6 md:px-12 lg:px-24 border-b border-neutral-900">
      

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Direct Details */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-extralight uppercase font-sans tracking-tight text-white mb-4">
              START A PROJECT.
            </h2>
            <p className="text-xs md:text-sm font-light text-neutral-400 font-sans leading-relaxed">
              Have an idea, campaign, or project in mind? Select a category or reach out directly to our production desk.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs text-neutral-400 uppercase tracking-widest pt-4 border-t border-neutral-900">
            
          </div>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                // YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-neutral-950 border border-neutral-900 text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="NAME / COMPANY"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                // EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-neutral-950 border border-neutral-900 text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="EMAIL@DOMAIN.COM"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
              // ENQUIRY TYPE
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-neutral-950 border border-neutral-900 text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors uppercase"
            >
              <option value="PROJECTS">PROJECTS</option>
              <option value="TALENT">TALENT</option>
              <option value="GENERAL">GENERAL</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
              // PROJECT DETAILS *
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-neutral-950 border border-neutral-900 text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
              placeholder="TELL US ABOUT YOUR VISION AND TIMELINE..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-mono text-xs font-bold tracking-[0.3em] py-4 uppercase transition-colors hover:bg-neutral-200"
          >
            {status || "ENGAGE DISPATCH ROUTER →"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ==========================================
   SOCIAL NETWORKS MATRIX
   ========================================== */
function ContactSocials() {
  const socialLinks = [
    {
      name: "INSTAGRAM",
      url: "https://www.instagram.com/sekrickstudio?igsh=MWs4cnE4dDMxZWp6cw==",
      handle: "sekrickstudio",
    },
    {
      name: "LINKEDIN",
      url: "https://www.linkedin.com/in/sekrick-studio-403298422/",
      handle: "Sekrick Studio",
    },
    {
      name: "BEHANCE",
      url: "https://www.behance.net/sekrickstudio",
      handle: "Sekrick studio",
    },
  ];

  return (
    <section className="w-full bg-black text-white py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-8">
       

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-neutral-950/60 border border-neutral-900 hover:border-neutral-700 transition-all duration-300"
            >
              <span className="font-mono text-[9px] text-neutral-500 tracking-[0.3em] block mb-2 group-hover:text-white transition-colors uppercase">
                // {social.name}
              </span>
              <span className="text-sm font-sans text-neutral-300 group-hover:text-white transition-colors block">
                {social.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MAIN CONTACT PAGE COMPONENT EXPORT
   ========================================== */
export default function Contact() {
  const [selectedCategory, setSelectedCategory] = useState("PROJECTS");
  const formRef = useRef(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Scroll directly to the form if arriving from an external CTA
    if (formRef.current && window.location.hash === "#form") {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (typeof window !== "undefined") {
      const systemPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (systemPreference.matches) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    }
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden selection:bg-white selection:text-black antialiased">
      <ContactHero onSelectCategory={handleSelectCategory} />
      <ContactFormSection selectedCategory={selectedCategory} formRef={formRef} />
      <ContactSocials />
    </div>
  );
}