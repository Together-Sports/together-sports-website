import headerLogo from "@/assets/headerlogo.svg";

const SiteLoadingScreen = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background">
    <img
      src={headerLogo}
      alt="Together Sports"
      className="h-12 w-auto animate-pulse"
    />
  </div>
);

export default SiteLoadingScreen;
