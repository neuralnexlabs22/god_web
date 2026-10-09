import type { Deity } from "@/data/devotional";

type DeityPortraitProps = {
  deity: Deity;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function DeityPortrait({ deity, className = "", imageClassName = "" }: DeityPortraitProps) {
  return (
    <div className={`relative overflow-hidden bg-black-deep ${className}`} aria-label={deity.name} role="img">
      <div
        className={`absolute inset-0 bg-cover bg-no-repeat transition-transform duration-[1400ms] ease-cinematic ${imageClassName}`}
        style={{
          backgroundImage: `url(${deity.image.src})`,
          backgroundPosition: deity.cropPosition,
          backgroundSize: "400% 300%",
        }}
      />
    </div>
  );
}
