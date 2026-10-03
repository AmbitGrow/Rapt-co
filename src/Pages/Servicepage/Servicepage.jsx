import { useLayoutEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import expertiseBg from "../../assets/Herosection/2.webp";
import Footer from "../../Component/Footer/Footer";
import telecommunicationImage from "../../assets/services/telecommunication.webp";
import "./Servicepage.css";
import { CallToAction } from "../Homepage/Homepage";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    "title": "DPDPA Compliance",
    "description": "We help organizations navigate India’s landmark data privacy legislation with end-to-end compliance solutions, ensuring you meet every obligation while building lasting digital trust.",
    "items": [
      "Gap Assessment & Readiness Audit — Evaluate current practices against DPDPA requirements and develop strategic remediation plans",
      "Consent Management & Data Mapping — Implement auditable consent frameworks and comprehensive personal data flow mapping",
      "Data Protection Impact Assessment (DPIA) — Assess and mitigate risks associated with data processing activities",
      "Privacy Policy & Governance Framework — Develop compliant policies, DPO setup, and Data Principal rights management",
      "Breach Management & Reporting — Incident response plans, 72-hour breach notification, and regulatory reporting to the Data Protection Board",
      "Cross-Border Data Transfer Compliance — Navigate regulations for transferring personal data outside India",
      "Continuous Monitoring & Training — Ongoing compliance reviews, employee awareness programs, and regulatory update tracking"
    ]
  },
  {
    "title": "SOC Audits",
    "description": "We deliver independent SOC attestation services that help organizations demonstrate their commitment to security, confidentiality, and operational excellence — building trust with clients and stakeholders.",
    "items": [
      "SOC 1 (Type I & Type II) — Internal controls over financial reporting (ICFR) for service organizations managing client financial data",
      "SOC 2 (Type I & Type II) — Evaluation across five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy",
      "SOC 3 Reports — Public-facing attestation summaries to demonstrate security commitment to a broader audience",
      "Readiness Assessments — Pre-audit gap analysis to identify control deficiencies and prepare for formal examination",
      "Control Design & Remediation — Design, implement, and test internal controls aligned with AICPA standards",
      "Continuous Compliance Monitoring — Ongoing testing and evidence collection to maintain audit readiness year-round"
    ]
  },
  {
    "title": "Privacy Audits",
    "description": "Our privacy audit services provide independent assurance that your organization’s data handling practices meet regulatory requirements and industry best practices — protecting your reputation and your stakeholders’ trust.",
    "items": [
      "Privacy Framework Assessment — Evaluate policies and procedures against GDPR, DPDPA, ISO 27001, and other global privacy standards",
      "Data Processing & Lifecycle Audit — End-to-end review of data collection, storage, processing, retention, and deletion practices",
      "Third-Party & Vendor Privacy Risk — Assess vendor data handling, contractual safeguards, and supply chain privacy compliance",
      "Privacy-by-Design Reviews — Embed privacy principles into product development, system architecture, and business processes",
      "Employee Awareness & Culture Assessment — Evaluate organizational privacy awareness and recommend training programs",
      "Certification-Ready Audits — Prepare your organization for ISO 27001, SOC 2 Privacy, and other privacy certifications"
    ]
  },
  {
    "title": "Income Tax Services",
    "description": "We provide strategic income tax advisory and robust representation services — from proactive planning and compliance to aggressive defence before CIT (Appeals), ITAT, and higher forums (High Court and Supreme Court).",
    "items": [
      "CIT (Appeals) & ITAT Representation — Strategic case preparation, drafting of appeal grounds, and expert advocacy before appellate authorities",
      "International Taxation & Transfer Pricing — Cross-border tax structuring, DTAA advisory, BEPS compliance, and transfer pricing documentation",
      "Cross-Border Appeals & Dispute Resolution — Representation in MAP proceedings, DRP hearings, and international tax litigation",
      "Tax Planning & Structuring Advisory — Optimize tax positions through proactive planning, PE analysis, GAAR, and POEM advisory",
      "Assessment & Scrutiny Support — End-to-end support during income tax assessments, survey proceedings, and search cases",
      "Expatriate Tax & NRI Advisory — Tax compliance and planning for expatriates, NRIs, and foreign nationals working in India"
    ]
  },
  {
    "title": "GST Services",
    "description": "With the GSTAT now operational since February 2026, we provide end-to-end GST litigation and compliance support — helping businesses resolve disputes efficiently and safeguard their financial interests.",
    "items": [
      "GST Appeals & GSTAT Representation — Drafting and filing appeals before the GST Appellate Tribunal, with advocacy at Principal and State Benches",
      "ITC Disputes & Refund Claims — Resolution of Input Tax Credit denials, blocked credits, and GST refund rejection matters",
      "Classification, Valuation & Place of Supply — Expert advisory on HSN classification, valuation methodologies, and complex place-of-supply determinations",
      "GST Litigation Strategy — Comprehensive case analysis, pre-deposit management, stay applications, and interlocutory proceedings",
      "GST Compliance & Health Check — Return filing reviews, reconciliation audits, and proactive compliance to prevent future disputes",
      "Anti-Profiteering & Advance Ruling — Advisory and representation for anti-profiteering proceedings and applications before the AAR"
    ]
  },
  {
    "title": "Governance, Risk & Compliance (GRC)",
    "description": "Our GRC practice integrates governance, risk management, and compliance into a unified framework — helping organizations streamline operations, strengthen internal controls, and navigate today’s complex regulatory environment with confidence.",
    "items": [
      "Enterprise Risk Management (ERM) — Identify, assess, and mitigate risks with structured frameworks aligned to ISO 31000 and COSO standards",
      "Internal Audit & Financial Controls (IFC/ICFR) — Risk-based internal audits, SOX compliance, and testing of internal controls over financial reporting",
      "Corporate Governance Advisory — Board-level advisory, regulatory mapping, and governance structure design for sound decision-making",
      "Regulatory Compliance Framework — Diagnostic reviews, compliance roadmaps, and automated monitoring against applicable regulations",
      "Process Audit & Optimization — End-to-end process reviews to enhance efficiency, reduce errors, and build “right-fit” operational structures",
      "IT GRC & Cybersecurity Governance — Unified IT governance across on-premises and cloud, with real-time monitoring and risk analytics"
    ]
  },
  {
    "title": "DRI Services",
    "description": "Our DRI (Documentation, Registration and Regulatory Interface) Services are designed to help businesses navigate complex regulatory environments with confidence. From new business establishment to ongoing compliance management, we act as a strategic partner to ensure that your organisation meets all statutory obligations while reducing administrative burden and regulatory risk.",
    "items": [
      "Business registrations, approvals and statutory clearances",
      "Industrial, commercial and sector-specific licensing support",
      "Regulatory documentation preparation, review and submission",
      "Compliance monitoring, audit readiness and reporting",
      "Government authority liaison and stakeholder coordination",
      "Regulatory risk assessment and mitigation strategies",
      "Corporate amendments, restructuring and licence modifications",
      "Expansion support for new locations, branches and activities"
    ],
    "clientBenefits": "Faster approvals, reduced compliance risks, improved governance, and greater focus on core business operations."
  },
  {
    "title": "CEPA Services (Comprehensive Economic Partnership Agreement)",
    "description": "Our CEPA advisory services help organisations take full advantage of international trade agreements by unlocking preferential tariff benefits, improving market access and ensuring cross-border compliance. We assist exporters, importers, manufacturers and trading companies in understanding and implementing CEPA requirements effectively.",
    "items": [
      "CEPA eligibility and readiness assessments",
      "Rules of Origin verification and compliance reviews",
      "Trade documentation, certificates and supporting evidence",
      "Customs duty and tariff optimisation advisory",
      "Import and export compliance assistance",
      "Supply chain structuring and optimisation",
      "CEPA implementation planning and benefit realisation",
      "Staff training and awareness workshops",
      "Trade risk management and documentation audits"
    ],
    "clientBenefits": "Reduced import duties, improved competitiveness, smoother customs clearance and enhanced international market opportunities."
  },
  {
    "title": "Project Finance and Fund Arrangement Services",
    "description": "Securing the right funding structure is critical for successful business growth. Our Project Finance and Fund Arrangement Services support clients at every stage, from project conceptualisation and documentation to debt arrangement and investor engagement. We work with Banks, NBFCs, Financial Institutions, Venture Funds, Private Investors and Strategic Partners to identify suitable financing options.",
    "items": [
      "Detailed Project Reports (DPRs) and feasibility studies",
      "Business plans, financial models and cash flow projections",
      "Project finance structuring and debt advisory",
      "Term loans, working capital and capital expenditure funding",
      "Debt syndication and consortium funding arrangements",
      "Bank and NBFC funding support",
      "Trade finance, LC and BG advisory services",
      "Financial restructuring and refinancing solutions",
      "Investor presentations, pitch decks and fundraising support",
      "Mergers, acquisitions and growth capital advisory"
    ],
    "clientBenefits": "Improved funding access, stronger investor confidence, optimised capital structure and accelerated project execution."
  },
  {
    "title": "RPA (Robotic Process Automation) Services",
    "description": "Our Robotic Process Automation (RPA) Services help organisations automate repetitive, rule-based business processes to improve efficiency, accuracy and scalability. We identify automation opportunities, design intelligent workflows and implement automation solutions that reduce manual effort and operational costs.",
    "items": [
      "Process assessment and automation opportunity identification",
      "Workflow mapping and automation design",
      "Finance and accounting process automation",
      "Regulatory and compliance reporting automation",
      "Data extraction, validation and reconciliation",
      "HR, payroll and employee onboarding automation",
      "Customer service and ticket management automation",
      "ERP, CRM and business application integration",
      "Bot monitoring, maintenance and optimisation",
      "Automation governance and change management support"
    ],
    "clientBenefits": "Reduced operating costs, improved process accuracy, faster turnaround times, enhanced compliance and increased workforce productivity."
  }
];

const approachPhases = [
  {
    title: "Discover & Assess",
    description:
      "Understand your business landscape, regulatory exposure, and current compliance posture.",
  },
  {
    title: "Gap Analysis & Strategy",
    description:
      "Identify compliance gaps, assess risks, and develop a tailored roadmap with clear priorities.",
  },
  {
    title: "Implementation & Execution",
    description:
      "Deploy governance frameworks, audit preparation, policy development, and regulatory submissions.",
  },
  {
    title: "Review & Reporting",
    description:
      "Validate outcomes through comprehensive reporting, recommendations, and stakeholder presentations.",
  },
  {
    title: "Ongoing Support & Monitoring",
    description:
      "Continuous compliance monitoring, health checks, regulatory updates, and long-term advisory support.",
  },
];

const industries = [
  {
    number: "01",
    title: "Manufacturing",
    image:
      "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=700&q=85",
    size: "tall",
  },
  {
    number: "02",
    title: "Banking & Financial Services",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
    size: "wide",
  },
  {
    number: "03",
    title: "Healthcare",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=85",
    size: "slim",
  },
  {
    number: "04",
    title: "Technology",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=85",
    size: "square",
  },
  {
    number: "05",
    title: "Telecommunication",
    image: telecommunicationImage,
    size: "compact",
  },
  {
    number: "06",
    title: "Pharmaceuticals",
    image:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=700&q=85",
    size: "medium",
  },
  {
    number: "07",
    title: "Infrastructure & Construction",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=85",
    size: "wide-tall",
  },
  {
    number: "08",
    title: "Consumer Products & FMCG",
    image:
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=700&q=85",
    size: "short",
  },
];

export default function Servicepage() {
  const [activeService, setActiveService] = useState(0);
  const approachRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray(".approach-chapter");

      const setActiveChapter = (activeIndex) => {
        gsap.to(chapters, {
          opacity: (index) =>
            index < activeIndex ? 0.5 : index === activeIndex ? 1 : 0.7,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      gsap.set(chapters, {
        opacity: (index) => (index === 0 ? 1 : 0.7),
      });

      chapters.forEach((chapter, index) => {
        const number = chapter.querySelector(".chapter-number");
        const label = chapter.querySelector(".chapter-label");
        const title = chapter.querySelector("h3");
        const description = chapter.querySelector("p");

        gsap
          .timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            number,
            { autoAlpha: 0, scale: 0.8 },
            {
              autoAlpha: 0.5,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            },
          )
          .fromTo(
            label,
            { autoAlpha: 0.3, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          )
          .fromTo(
            title,
            { autoAlpha: 0.3, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          )
          .fromTo(
            description,
            { autoAlpha: 0.3, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              delay: 0.2,
              ease: "power2.out",
            },
            "-=0.3",
          );

        ScrollTrigger.create({
          trigger: chapter,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });
      });
    }, approachRef);

    return () => context.revert();
  }, []);

  return (
    <>
      <main>
        <NewHeroSection
          id="service-hero-title"
          title={
            <>
              Expertise That Helps <em>Organizations</em>
              <br />
              Navigate Complexity.
            </>
          }
          description="From governance and regulatory compliance to taxation, digital privacy, cybersecurity, and enterprise risk, RAPT & Co. provides integrated advisory services designed to help organizations operate with confidence in an increasingly regulated world."
          primaryAction={{ label: "Book a Consultation", to: "/#cta-heading" }}
          secondaryAction={{
            label: "Download Company Profile",
            href: "/company-profile.pdf",
            download: true,
          }}
          backgroundImage={expertiseBg}
          scrollTo="#service-expertise-title"
        />

        <section
          className="service-expertise"
          aria-labelledby="service-expertise-title"
        >
          <div className="service-expertise__layout">
            <header className="service-expertise__intro">
              <span className="service-expertise__label">OUR EXPERTISE</span>
              <h2
                className="service-expertise__title"
                id="service-expertise-title"
              >
                Comprehensive
                <br />
                Advisory
                <br />
                Services.
              </h2>
              <p className="service-expertise__description">
                Integrated solutions across privacy, taxation, governance, risk
                management, audits, and regulatory compliance.
              </p>
            </header>

            <div className="service-expertise__divider" aria-hidden="true" />

            <div className="service-accordion">
              {services.map((service, index) => {
                const isOpen = activeService === index;
                const panelId = `service-panel-${index}`;

                return (
                  <article
                    className={`service-accordion__item${
                      isOpen ? " is-open" : ""
                    }`}
                    key={service.title}
                  >
                    <button
                      className="service-accordion__trigger"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setActiveService((current) =>
                          current === index ? null : index,
                        )
                      }
                    >
                      <span>{service.title}</span>
                      <span
                        className="service-accordion__icon"
                        aria-hidden="true"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      className="service-accordion__panel"
                      id={panelId}
                      aria-hidden={!isOpen}
                    >
                      <div className="service-accordion__panel-inner">
                        <p className="service-accordion__service-description">
                          {service.description}
                        </p>

                        <ul className="service-accordion__list">
                          {service.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>

                        {service.clientBenefits && (
                          <p className="service-accordion__benefits">
                            <strong>Client Benefits:</strong>{" "}
                            {service.clientBenefits}
                          </p>
                        )}

                        <div className="service-accordion__bottom-row">
                          <NavLink to="/contact#get-in-touch">
                            Book a Consultation
                            <FaArrowRight
                              className="service-accordion__link-icon"
                              aria-hidden="true"
                            />
                          </NavLink>

                          
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="service-approach"
          aria-labelledby="service-approach-title"
          ref={approachRef}
        >
          <header className="service-approach__header">
            <span className="service-approach__label">OUR APPROACH</span>
            <h2 className="service-approach__title" id="service-approach-title">
              Every Engagement. A Proven Process.
            </h2>
            <p className="service-approach__description">
              Every project follows a structured methodology designed to
              deliver measurable outcomes while reducing regulatory risk.
            </p>
          </header>

          <div className="service-approach__list">
            {approachPhases.map((phase, index) => (
              <article className="approach-chapter" key={phase.title}>
                <div className="chapter-number-wrap" aria-hidden="true">
                  <span className="chapter-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="chapter-content">
                  <span className="chapter-label">
                    PHASE {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{phase.title}</h3>
                  <p>{phase.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="service-industries"
          id="industries"
          aria-labelledby="service-industries-title"
        >
          <header className="service-industries__header">
            <span className="service-industries__label">
              INDUSTRIES WE SERVE
            </span>
            <h2
              className="service-industries__title"
              id="service-industries-title"
            >
              Trusted Across Diverse
              <br />
              Industries.
            </h2>
            <p className="service-industries__description">
              Delivering advisory services to organizations operating in highly
              regulated and growth-focused sectors.
            </p>
          </header>

          <div
            className="service-industries__slider"
            aria-label="Industries served"
          >
            <div className="service-industries__track">
              {[0, 1].map((duplicateIndex) => (
                <div
                  className="service-industries__group"
                  aria-hidden={duplicateIndex === 1}
                  key={duplicateIndex}
                >
                  {industries.map((industry) => (
                    <article
                      className={`industry-card industry-card--${industry.size}`}
                      key={`${duplicateIndex}-${industry.number}`}
                    >
                      <div className="industry-card__image">
                        <img src={industry.image} alt="" loading="lazy" decoding="async" />
                      </div>
                      <div className="industry-card__text">
                        <span>{industry.number}</span>
                        <h3>{industry.title}</h3>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
          <CallToAction />
      </main>
      <Footer />
    </>
  );
}
