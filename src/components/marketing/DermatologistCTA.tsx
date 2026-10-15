import { Button } from "@/components/ui/button";

const BOOKING_URL = "https://forms.gle/XN24QU78XSfUVHjT6";

type DermatologistCTAProps = {
  variant?: "home" | "routine" | "footer";
};

const DOCTORS = [
  {
    name: "Dr. Waqas Ahmad",
    credential: "Speciality Registrar, FCPS Dermatology",
    copy: "Eclantian routines are reviewed by Dr. Waqas Ahmad, a qualified, FCPS-certified dermatologist. His clinical perspective helps shape thoughtful care for acne-prone and sensitive skin.",
    preference: "Select Male in the form to direct your request to Dr. Waqas Ahmad.",
  },
  {
    name: "Dr. Arfa",
    credential: "MBBS, Resident Doctor",
    copy: "Dr. Arfa offers professional guidance for your individual skin concerns. A consultation can help turn those concerns into a clearer, more considered skincare plan.",
    preference: "Select Female in the form to direct your request to Dr. Arfa.",
  },
];

const DermatologistCTA = ({ variant = "home" }: DermatologistCTAProps) => {
  const isFooter = variant === "footer";

  return (
    <section
      className={
        isFooter
          ? "rounded-lg border border-accent-gold/35 bg-[#211b12] p-5 text-background sm:p-7"
          : "border-y border-accent-gold/25 bg-charcoal text-background"
      }
    >
      <div className={isFooter ? "" : "container-wide py-16 sm:py-20 md:py-24"}>
        <div className={isFooter ? "" : "mx-auto max-w-5xl"}>
          <header className={`text-center ${isFooter ? "mb-6" : "mb-10 md:mb-12"}`}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-gold">
              Expert care, considered for you
            </p>
            <h2 className={`mt-3 font-serif ${isFooter ? "text-3xl" : "text-4xl sm:text-5xl md:text-6xl"}`}>
              Consult Our Dermatologist
            </h2>
            <p className={`mx-auto mt-4 max-w-2xl text-background/70 ${isFooter ? "text-sm" : "text-sm leading-relaxed sm:text-base"}`}>
              Eclantian routines are reviewed by qualified dermatologists. Get a skincare plan shaped around your
              specific concerns, rather than having to guess what your skin needs.
            </p>
          </header>

          <div className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 ${isFooter ? "" : "md:gap-6"}`}>
            {DOCTORS.map((doctor) => (
              <article
                key={doctor.name}
                className={`relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-lg border border-accent-gold/35 bg-background/[0.04] p-6 sm:p-7 ${
                  isFooter ? "sm:p-6" : "md:min-h-[19rem] md:p-8"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/80 to-transparent"
                />
                <h3 className={`font-serif ${isFooter ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
                  {doctor.name}
                </h3>
                <p className="mt-2 max-w-none text-sm font-medium text-accent-gold">
                  {doctor.credential}
                </p>
                <div className="my-5 h-px w-12 bg-accent-gold/60" />
                <p className="max-w-none text-sm leading-relaxed text-background/75">
                  {doctor.copy}
                </p>
                <p className="mt-auto pt-5 text-xs leading-relaxed text-background/55">
                  {doctor.preference}
                </p>
              </article>
            ))}
          </div>

          <div className={`text-center ${isFooter ? "mt-6" : "mt-9 md:mt-12"}`}>
            <Button
              asChild
              size="lg"
              variant="primary"
              className={`h-14 w-full rounded-md bg-accent-gold px-8 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal shadow-[0_0_0_1px_hsl(var(--accent-gold)/0.4)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#c69a55] hover:shadow-[0_0_28px_rgba(201,162,75,0.35)] ${
                isFooter ? "sm:w-full" : "sm:min-w-72 sm:w-auto"
              }`}
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book a Consultation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DermatologistCTA;