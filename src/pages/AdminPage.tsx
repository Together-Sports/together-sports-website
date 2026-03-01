import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { LayoutDashboard, FileText, Image, BarChart3, Calendar, Star } from "lucide-react";

type Tab = "posts" | "media" | "stats" | "events" | "sports";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const tabs = [
    { id: "posts" as Tab, label: "Blog Posts", icon: FileText },
    { id: "media" as Tab, label: "Media", icon: Image },
    { id: "stats" as Tab, label: "Impact Stats", icon: BarChart3 },
    { id: "events" as Tab, label: "Events", icon: Calendar },
    { id: "sports" as Tab, label: "Sports", icon: Star },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="text-accent" size={24} />
                <h1 className="font-heading text-3xl font-black uppercase">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground text-sm">Manage your Together Sports content</p>
            </div>
            <Link to="/" className="px-4 py-2 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider hover:scale-105 transition-all">
              View Site →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-heading font-bold uppercase text-sm tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-accent text-white"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-black uppercase">Blog Posts</h2>
              <button className="px-4 py-2 bg-accent text-white font-heading font-bold uppercase text-sm hover:scale-105 transition-all">
                + New Post
              </button>
            </div>
            {["Why Every Kid Needs a Second Serve", "Summer Camp Registration Now Open", "Meet Coach Rodriguez"].map((post, i) => (
              <div key={i} className="p-4 bg-card border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg">{post}</h3>
                  <p className="text-muted-foreground text-sm">Published · Feb {20 - i * 5}, 2026</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary/20 text-primary font-body text-sm hover:bg-primary/30 transition-colors">Edit</button>
                  <button className="px-3 py-1.5 bg-destructive/20 text-destructive font-body text-sm hover:bg-destructive/30 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media */}
        {activeTab === "media" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-black uppercase">Homepage Media</h2>
              <button className="px-4 py-2 bg-accent text-white font-heading font-bold uppercase text-sm hover:scale-105 transition-all">
                + Upload
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Hero Image", "Tennis", "Basketball", "Football"].map((name) => (
                <div key={name} className="aspect-video bg-card border border-border flex items-center justify-center">
                  <p className="text-muted-foreground text-sm font-body">{name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === "stats" && (
          <div>
            <h2 className="font-heading text-2xl font-black uppercase mb-6">Impact Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Youth Served", value: "2,500+" },
                { label: "Communities", value: "15" },
                { label: "Return Rate", value: "98%" },
                { label: "Sports Programs", value: "4" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-card border border-border flex items-center justify-between">
                  <span className="text-muted-foreground font-body">{stat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-2xl font-black text-accent">{stat.value}</span>
                    <button className="px-3 py-1.5 bg-primary/20 text-primary font-body text-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-black uppercase">Events</h2>
              <button className="px-4 py-2 bg-accent text-white font-heading font-bold uppercase text-sm hover:scale-105 transition-all">
                + New Event
              </button>
            </div>
            {["Summer Camp 2026", "Basketball Tournament", "Tennis Clinic"].map((event, i) => (
              <div key={i} className="p-4 bg-card border border-border flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg">{event}</h3>
                  <p className="text-muted-foreground text-sm">March {10 + i * 7}, 2026</p>
                </div>
                <button className="px-3 py-1.5 bg-primary/20 text-primary font-body text-sm">Edit</button>
              </div>
            ))}
          </div>
        )}

        {/* Sports */}
        {activeTab === "sports" && (
          <div>
            <h2 className="font-heading text-2xl font-black uppercase mb-6">Toggle Featured Sport</h2>
            {["Tennis", "Basketball", "Football", "Golf"].map((sport, i) => (
              <div key={sport} className="p-4 bg-card border border-border flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-lg">{sport}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                  <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-accent transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
