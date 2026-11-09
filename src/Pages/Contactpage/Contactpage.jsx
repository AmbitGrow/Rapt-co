import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { RiArrowLeftLongLine } from "react-icons/ri";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import contactBg from "../../assets/Herosection/5.webp";
import contactBgPortrait from "../../assets/Herosection/5-portrait.webp";
import Footer from "../../Component/Footer/Footer";
import { FrequentlyAskedQuestions } from "../Homepage/Homepage";
import { services } from "../../Data/services";
import {
  CONTACT_EMAILS,
  CONTACT_PHONE,
  OFFICE_LOCATION,
} from "../../Data/site";
import "./Contactpage.css";

gsap.registerPlugin(ScrollTrigger);

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
  website: "", // honeypot: hidden from people, filled in by bots
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

function validateForm(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  const digits = data.phone.replace(/\D/g, "");
  if (
    !PHONE_PATTERN.test(data.phone.trim()) ||
    digits.length < 7 ||
    digits.length > 15
  ) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!data.service) errors.service = "Please select a service.";
  if (data.message.trim().length < 10) {
    errors.message = "Please tell us a little more (at least 10 characters).";
  }
  return errors;
}

export default function Contactpage() {
  const location = useLocation();
  const getInTouchRef = useRef(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const startedAtRef = useRef(Date.now());
  // A ref (not state) so a second click in the same frame can't start a second request.
  const submittingRef = useRef(false);

  useEffect(() => {
    if (location.hash !== "#get-in-touch") return undefined;

    const frame = requestAnimationFrame(() => {
      document.getElementById("get-in-touch")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        [
          ".get-in-touch__label",
          ".get-in-touch__title",
          ".get-in-touch__description",
          ".get-in-touch__details",
          ".consultation-card",
        ],
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: getInTouchRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, getInTouchRef);

    return () => context.revert();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const submitConsultation = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ state: "idle", message: "" });
      document.getElementById(`consultation-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus({ state: "submitting", message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startedAt: startedAtRef.current }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        if (result.errors) {
          setErrors(result.errors);
          setStatus({ state: "error", message: "Please correct the highlighted fields and try again." });
          return;
        }
        throw new Error(result.error || "Request failed");
      }
      setFormData(EMPTY_FORM);
      startedAtRef.current = Date.now();
      setStatus({
        state: "success",
        message:
          "Thank you. Your consultation request has been sent, and our team will get back to you shortly.",
      });
    } catch {
      setStatus({
        state: "error",
        message: `We couldn't send your request right now. Please try again, or reach us directly at ${CONTACT_PHONE.display} or ${CONTACT_EMAILS[0]}.`,
      });
    } finally {
      submittingRef.current = false;
    }
  };

  const fieldProps = (name) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `consultation-${name}-error` : undefined,
  });
  const fieldError = (name) =>
    errors[name] ? (
      <span className="consultation-form__error" id={`consultation-${name}-error`}>
        {errors[name]}
      </span>
    ) : null;

  return (
    <>
      <main>
        <NewHeroSection
          id="contact-hero-title"
          title="Let's Start a Conversation."
          description="Whether you're navigating regulatory change, planning for compliance, or seeking strategic advisory, our team is here to help. Tell us about your requirements, and we'll connect you with the right experts."
          primaryAction={{
            label: "Book a Consultation",
            to: "/contact#get-in-touch",
          }}
          secondaryAction={{
            label: "Download Company Profile",
            href: "/company-profile.pdf",
            download: true,
          }}
          backgroundImage={contactBg}
          mobileBackgroundImage={contactBgPortrait}
          scrollTo="#faq-heading"
        />

        <section
          id="get-in-touch"
          className="get-in-touch"
          aria-labelledby="get-in-touch-title"
          ref={getInTouchRef}
        >
          <header className="get-in-touch__header">
            <span className="get-in-touch__label">GET IN TOUCH</span>
            <h2 className="get-in-touch__title" id="get-in-touch-title">
              Every Great Partnership
              <br />
              Begins with a Conversation.
            </h2>
            <p className="get-in-touch__description">
              Every business faces unique regulatory and compliance challenges.
              Whether you need guidance on DPDPA Compliance, SOC Audits,
              Taxation, GST, Privacy, or Governance, we&apos;re here to provide
              practical, technology-driven solutions tailored to your
              organization.
            </p>
          </header>

          <div className="get-in-touch__layout">
            <address className="get-in-touch__details">
              <div className="contact-detail">
                <span>Phone</span>
                <a href={CONTACT_PHONE.href}>{CONTACT_PHONE.display}</a>
              </div>

              <div className="contact-detail">
                <span>Email</span>
                {CONTACT_EMAILS.map((email) => (
                  <a href={`mailto:${email}`} key={email}>
                    {email}
                  </a>
                ))}
              </div>

              <div className="contact-detail">
                <span>Office</span>
                <p>RAPT &amp; Co.</p>
                <p>{OFFICE_LOCATION}</p>
                <a
                  href="https://maps.google.com/?q=Chennai,Tamil+Nadu,India"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See on Google Maps{" "}
                  <RiArrowLeftLongLine
                    className="contact-detail__map-icon"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </address>

            <article className="consultation-card">
              <header className="consultation-card__header">
                <h3>BOOK A CONSULTATION</h3>
                <h4>Tell Us About Your Requirements :</h4>
                <p>
                  We&apos;d love to understand your business and discuss how we
                  can support your compliance, governance, taxation, or
                  regulatory objectives.
                </p>
              </header>

              <form
                className="consultation-form"
                onSubmit={submitConsultation}
                noValidate
                aria-busy={status.state === "submitting"}
              >
                <div className="consultation-form__honeypot" aria-hidden="true">
                  <label htmlFor="consultation-website">Website</label>
                  <input
                    id="consultation-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={updateField}
                  />
                </div>
                <div className="consultation-form__grid">
                  <div className="consultation-form__field">
                    <input
                      id="consultation-name"
                      name="name"
                      autoComplete="name"
                      type="text"
                      placeholder=" "
                      value={formData.name}
                      maxLength={100}
                      onChange={updateField}
                      required
                      {...fieldProps("name")}
                    />
                    <label htmlFor="consultation-name">Name</label>
                    {fieldError("name")}
                  </div>
                  <div className="consultation-form__field">
                    <input
                      id="consultation-email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      placeholder=" "
                      value={formData.email}
                      maxLength={254}
                      onChange={updateField}
                      required
                      {...fieldProps("email")}
                    />
                    <label htmlFor="consultation-email">Email</label>
                    {fieldError("email")}
                  </div>
                  <div className="consultation-form__field">
                    <input
                      id="consultation-phone"
                      name="phone"
                      autoComplete="tel"
                      type="tel"
                      placeholder=" "
                      value={formData.phone}
                      maxLength={20}
                      onChange={updateField}
                      required
                      {...fieldProps("phone")}
                    />
                    <label htmlFor="consultation-phone">Phone Number</label>
                    {fieldError("phone")}
                  </div>
                  <div className="consultation-form__field">
                    <input
                      id="consultation-company"
                      name="company"
                      autoComplete="organization"
                      type="text"
                      placeholder=" "
                      value={formData.company}
                      maxLength={150}
                      onChange={updateField}
                    />
                    <label htmlFor="consultation-company">
                      Company (Optional)
                    </label>
                  </div>
                </div>

                <div className="consultation-form__field consultation-form__service">
                  <select
                    id="consultation-service"
                    name="service"
                    value={formData.service}
                    onChange={updateField}
                    required
                    {...fieldProps("service")}
                  >
                    <option value="" disabled aria-label="Select a service" />
                    {services.map((service) => (
                      <option key={service.slug}>{service.title}</option>
                    ))}
                    <option>Other / Not sure</option>
                  </select>
                  <label htmlFor="consultation-service">Service</label>
                    {fieldError("service")}
                </div>

                <div className="consultation-form__field consultation-form__message">
                  <textarea
                    id="consultation-message"
                    name="message"
                    placeholder=" "
                    value={formData.message}
                    maxLength={5000}
                    onChange={updateField}
                    required
                    {...fieldProps("message")}
                  />
                  <label htmlFor="consultation-message">
                    Tell us about yourself
                  </label>
                  {fieldError("message")}
                </div>

                <button type="submit" disabled={status.state === "submitting"}>
                  {status.state === "submitting" ? "Sending…" : "Book My Consultation"}
                </button>

                <p
                  className={`consultation-form__status consultation-form__status--${status.state}`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </p>
              </form>
            </article>
          </div>
        </section>

        <FrequentlyAskedQuestions />
      </main>
      <Footer />
    </>
  );
}
