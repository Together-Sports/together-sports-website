import { useParams, Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import tennisAction from "@/assets/tennis-action.jpg";
import basketballAction from "@/assets/basketball-action.jpg";
import footballAction from "@/assets/football-action.jpg";
import golfAction from "@/assets/golf-action.jpg";
import secondServe from "@/assets/second-serve.jpg";

const sportData: Record<string, { name: string; image: string; tagline: string; description: string; schedule: string[] }> = {
  tennis: {
    name: "Tennis",
    image: tennisAction,
    tagline: "Every serve is a fresh start.",
    description: "Our tennis program provides free coaching, equipment, and court time to youth aged 8-18. From beginners to competitive players, we build skills and confidence through structured lessons and match play.",
    schedule: ["Monday & Wednesday: 4:00–6:00 PM", "Saturday: 9:00 AM–12:00 PM", "Summer Intensive: June–August"],
  },
  basketball: {
    name: "Basketball",
    image: basketballAction,
    tagline: "The court is where leaders are made.",
    description: "Our basketball program teaches fundamentals, teamwork, and game strategy. Open to all skill levels, we focus on building confidence through competitive play and mentorship.",
    schedule: ["Tuesday & Thursday: 4:00–6:00 PM", "Saturday: 1:00–4:00 PM"],
  },
  football: {
    name: "Football",
    image: footballAction,
    tagline: "Every play counts. Every player matters.",
    description: "Our football program emphasizes discipline, teamwork, and sportsmanship. We provide equipment and coaching for flag and tackle football across multiple age groups.",
    schedule: ["Monday & Wednesday: 4:30–6:30 PM", "Saturday: 10:00 AM–1:00 PM"],
  },
  golf: {
    name: "Golf",
    image: golfAction,
    tagline: "The long game starts here.",
    description: "Our golf program introduces youth to the sport of patience and precision. With access to courses and professional instruction, we open doors that many thought were closed.",
    schedule: ["Wednesday: 3:30–5:30 PM", "Saturday: 8:00–11:00 AM"],
  },
};

const SportDetailPage = () => {
  const { sport } = useParams<{ sport: string }>();
  const data = sportData[sport || ""];

  if (!data) {
    return (
      <div className="py-32 text-center">
        <h1 className="font-heading text-4xl font-black uppercase">Sport not found</h1>
        <Link to="/sports" className="text-accent mt-4 inline-block">← Back to Sports</Link>
      </div>
    );
  }

  const isTennis = sport === "tennis";

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <img src={data.image} alt={data.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-3">Together Sports</p>
          <h1 className="font-heading text-6xl md:text-8xl font-black uppercase text-white">{data.name}</h1>
          <p className="text-xl text-white/70 mt-2">{data.tagline}</p>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-6">
              About the <span className="brush-underline">Program</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{data.description}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* How Lessons Work */}
      <section className="py-16 md:py-24 bg-card scratchy-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-8">
              How Lessons <span className="text-accent">Work</span>
            </h2>
            <div className="aspect-video bg-background border border-border flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-accent text-2xl">▶</span>
                </div>
                <p className="text-muted-foreground">Video coming soon</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-8">
              <span className="brush-underline">Schedule</span>
            </h2>
            <div className="space-y-3">
              {data.schedule.map((s, i) => (
                <div key={i} className="p-5 bg-card border border-border text-foreground font-body text-lg">
                  {s}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Registration */}
      <section className="py-16 md:py-24 bg-card scratchy-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="scale">
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">
              Ready to <span className="text-accent">Register?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Sign up through USTA or contact us directly to join the program.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold uppercase tracking-wider hover:scale-105 transition-all duration-200">
                USTA Registration →
              </a>
              <Link to="/contact" className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold uppercase tracking-wider hover:scale-105 transition-all duration-200">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Second Serve (Tennis only) */}
      {isTennis && (
        <section className="py-20 md:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div className="scrapbook-rotate-1">
                  <img src={secondServe} alt="Second Serve" className="w-full h-[400px] object-cover" />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <p className="font-body font-bold uppercase tracking-[0.2em] text-accent text-sm mb-4">Flagship Initiative</p>
                <h2 className="font-heading text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-6">
                  Second Serve
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Second Serve is our signature program providing free tennis equipment, coaching, and mentorship
                  to underserved youth. We believe every kid deserves a second chance — on and off the court.
                </p>
                <Link to="/get-involved" className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200">
                  Support Second Serve
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SportDetailPage;
