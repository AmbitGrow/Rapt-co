import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import homeBg from "../../assets/Herosection/1.webp";
import homeBgPortrait from "../../assets/Herosection/1-portrait.webp";

import Homepage from "./Homepage";
import "./NewHomepage.css";

// Reuses every section of the existing Homepage; only the hero is swapped.
export default function NewHomepage() {
  return (
    <Homepage
      hero={
        <NewHeroSection
          title={
            <>
              Compliance Made Simple.
              <br />
              <em>Business Growth</em> Made Possible.
            </>
          }
          description="From DPDPA Compliance and SOC Audits to Taxation, GST Appeals, Privacy, and GRC, RAPT & Co. delivers integrated advisory solutions tailored for modern enterprises."
          primaryAction={{
            label: "Book a Consultation",
            to: "/contact#get-in-touch",
          }}
          secondaryAction={{
            label: "Download Company Profile",
            href: "/company-profile.pdf",
            download: true,
          }}
          backgroundImage={homeBg}
          mobileBackgroundImage={homeBgPortrait}
          scrollTo="#experience-heading"
          id="homepage-hero-title"
        />
      }
    />
  );
}
