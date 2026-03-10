import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import {
  featuredProducts,
  innovationAreas,
  services,
} from "../data/siteData.js";

export default function Home() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-stone-50 to-amber-50" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-800">
                HanRia Eco Tech
                <span className="mx-2 h-1 w-1 rounded-full bg-emerald-300" />
                Sustainable Materials
              </p>

              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                Turning Nature’s Waste into Tomorrow’s Solutions
              </h1>
              <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
                We convert agricultural waste into eco-friendly materials
                engineered for modern products—helping industries reduce
                plastics, lower emissions, and build a cleaner future.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  Explore Products
                </Link>
                <Link
                  to="/technology"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50"
                >
                  Our Technology
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  "Waste-to-value materials",
                  "Prototype-ready workflows",
                  "Eco-first design mindset",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-stone-900">
                  Quick links
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    {
                      to: "/products",
                      title: "Products",
                      description: "Browse categories and materials.",
                    },
                    {
                      to: "/services",
                      title: "Services",
                      description: "Co-development, testing, and validation.",
                    },
                    {
                      to: "/technology",
                      title: "Technology",
                      description: "See how our materials are engineered.",
                    },
                    {
                      to: "/training",
                      title: "Training",
                      description: "Programs, workshops, and onboarding.",
                    },
                    {
                      to: "/about",
                      title: "About",
                      description: "Mission, vision, and focus areas.",
                    },
                    {
                      to: "/contact",
                      title: "Contact",
                      description: "Start a collaboration or inquiry.",
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-2xl border border-stone-200 bg-white p-4 transition-colors hover:bg-stone-50"
                    >
                      <p className="text-sm font-semibold text-stone-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              About HanRia Eco Tech
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              HanRia Eco Tech develops eco-friendly materials by converting
              agricultural waste into next-generation composites and sustainable
              alternatives. Our mission is to enable modern industries to adopt
              renewable inputs without compromising on performance.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Core Innovation Areas */}
      <section id="technology" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Core Innovation Areas
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                Built on practical research and engineering, our technology
                platform turns natural fibers into materials ready for real
                products.
              </p>
            </div>

            <Link
              to="/technology"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              View technology
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {innovationAreas.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="products"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Designed for brands and builders looking for sustainable, modern
              alternatives—without sacrificing performance.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            View all products
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredProducts.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Services
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                We work with partners to develop materials, validate
                performance, and accelerate adoption across industries.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              View services
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability message */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-900 to-stone-950" />
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <svg
            className="h-full w-full"
            viewBox="0 0 1200 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 80c-210 140-400 140-600 0S210-60 0 80v520h1200V80Z"
              fill="currentColor"
              className="text-emerald-800"
            />
            <path
              d="M1200 140c-230 130-430 130-600 0S230 10 0 140v460h1200V140Z"
              fill="currentColor"
              className="text-emerald-700"
              opacity="0.55"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Sustainability isn’t a feature—it’s the foundation.
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-50/90">
              By using natural fibers and agricultural residues, we help reduce
              landfill waste and support a circular economy—where materials
              return value to communities and ecosystems.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/technology"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-50"
              >
                Explore our technology
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Let’s build something sustainable.
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                If you’re exploring eco-material options, we’d love to hear
                about your use case. We can help you evaluate fit, performance,
                and next steps.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800"
              >
                Contact Us
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
