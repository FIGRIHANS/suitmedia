'use client';
import Image from 'next/image';

type HeroProps = {
  title: string;
  subtitle?: string;
  bgImage?: string;
};

export default function Hero({ title, subtitle, bgImage }: HeroProps) {
  // Gunakan bgImage jika ada, jika tidak pakai grey.jpeg dari public
  const background = bgImage || "/grey.jpeg";
  return (
    <section className="relative w-full h-64 flex items-center justify-center mb-8 overflow-hidden">
      <Image
        src={background}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        fill
        priority
      />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow">{title}</h1>
        {subtitle && (
          <p className="text-lg text-white drop-shadow">{subtitle}</p>
        )}
      </div>
    </section>
  );
}