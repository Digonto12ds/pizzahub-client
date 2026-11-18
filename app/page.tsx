import HeroBanner from "@/components/Hero-banner"
import HomeSections from "@/components/home/Home-sections"
import HowPizzaHubWorks from "@/components/home/How-pizzahub-works"
import PizzaCategories from "@/components/home/Pizza-categories"
import WhyChoosePizzaHub from "@/components/home/Why-choose-pizzahub"

export default function Page() {
  return (
    <main>
      <HeroBanner />
      <HomeSections/>
      <PizzaCategories/>
      <WhyChoosePizzaHub/>
      <HowPizzaHubWorks/>
    </main>
  )
}
