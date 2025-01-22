import ArticlesSection from "../components/sections/ArticlesSection";
import HeroSection from "../components/sections/HeroSection";
import SocialMediaSection from "../components/sections/SocialMediaSection";

export default function Home() {
  return (
    <>
      <HeroSection
        videoSrc="https://i.imgur.com/jdZpVz5.mp4"
        title="Odkryj Świat"
        subtitle="Wyrusz w fascynującą podróż po mikro- i makrokosmosie"
        linkTarget="#section-articles"
      />
      <ArticlesSection />
      <SocialMediaSection titleText="Znajdź nas na mediach społecznościowych" />
    </>
  );
}
