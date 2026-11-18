import HeroBanner from "@/components/Hero-banner"
import HomeSections from "@/components/home/Home-sections"
import PizzaCategories from "@/components/home/Pizza-categories"

export default function Page() {
  return (
    <main>
      <HeroBanner />
      <HomeSections/>
      <PizzaCategories/>
    </main>
  )
}
