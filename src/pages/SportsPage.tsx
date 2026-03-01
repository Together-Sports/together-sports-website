import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import tennisAction from "@/assets/tennis-action.jpg";
import basketballAction from "@/assets/basketball-action.jpg";
import footballAction from "@/assets/football-action.jpg";
import golfAction from "@/assets/golf-action.jpg";

const sports = [
  { name: "Tennis", image: tennisAction, path: "/sports/tennis", desc: "Serving up second chances on every court." },
  { name: "Basketball", image: basketballAction, path: "/sports/basketball", desc: "Dribble. Shoot. Lead. Repeat." },
  { name: "Football", image: footballAction, path: "/sports/football", desc: "Teamwork that goes beyond the field." },
  { name: "Golf", image: golfAction, path: "/sports/golf", desc: "Patience, focus, and the long game." },
];

const SportsPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 md:py-32 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Programs</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-6">
              Our <span className="text-stroke">Sports</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Each program is designed to build skills, character, and community.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sports.map((sport, i) => (
            <ScrollReveal key={sport.name} direction={i % 2 === 0 ? "left" : "right"}>
              <Link
                to={sport.path}
                className={`group relative block overflow-hidden h-[350px] md:h-[450px] ${
                  i % 2 === 1 ? "md:ml-20" : "md:mr-20"
                }`}
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/80 via-deep-blue/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <h2 className="font-heading text-5xl md:text-7xl font-black uppercase text-white group-hover:text-accent transition-colors duration-300 mb-2">
                    {sport.name}
                  </h2>
                  <p className="text-white/70 text-lg max-w-md">{sport.desc}</p>
                  <span className="inline-block mt-4 px-6 py-3 bg-accent text-white font-heading font-bold uppercase tracking-wider text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Explore Program →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SportsPage;
