import { heroFeatures } from "./data/hero.data";
import FeatureItem from "./feature-item";

export default function HeroFeatures() {
  return (
    <div className="space-y-8">

      {heroFeatures.map((feature) => (
        <FeatureItem
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}

    </div>
  );
}