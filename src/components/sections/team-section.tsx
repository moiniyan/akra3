export function TeamSection(): JSX.Element {
  return (
    <section
      id="team"
      className="w-full max-w-[2560px] bg-[url('/images/svg/team-section-background.svg')] bg-cover bg-no-repeat"
    >
      {/* Top Wave Image */}
      <div>
        <img
          src="/images/svg/team-top-wave.svg"
          alt="Wave pattern at the top of the team section"
          className="w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-[48px] min-h-[680px] w-full max-w-[1440px] px-5 md:px-6 lg:px-7">
        <div className="flex items-center justify-center md:grid md:grid-cols-2 md:gap-8 lg:gap-[48px]">
          {/* Section Title */}
          <h2 className="bg-gradient-to-br from-greenGradientFrom to-greenGradientTo bg-clip-text text-center font-[BalooTamma] font-bold leading-[1.2] text-transparent md:col-start-2 md:col-end-3">
            <span className="whitespace-nowrap text-[8.6vw] md:text-[4.8vw] w-1400:text-[70px]">
              Qualified
            </span>
            <br />
            <span className="text-[7vw] md:whitespace-nowrap md:text-[4vw] w-1400:text-[57px]">
              and Experienced Team
            </span>
          </h2>
        </div>

        {/* Team Content Placeholder */}
        <div className="flex min-h-[600px] flex-col justify-center gap-[12vw] md:grid md:grid-cols-2 md:gap-[32px] lg:gap-[48px]">
          {/* Placeholder for Team Image */}
          <div className="flex items-center justify-center">
            {/* <img src="/" alt="Veterinarian Dr. Piotr Surma" className="" /> */}
          </div>

          {/* Placeholder for Team Information */}
          <div className=""></div>
        </div>
      </div>

      {/* Bottom Wave Image */}
      <div>
        <img
          src="/images/svg/team-bottom-wave.svg"
          alt="Wave pattern at the bottom of the team section"
          className="w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}
