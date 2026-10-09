import Link from "next/link";
import { notFound } from "next/navigation";
import DevotionalProductCard from "@/components/DevotionalProductCard";
import { devotionalCategories, getProductsByCategory } from "@/data/devotionalProducts";

export function generateStaticParams() {
  return devotionalCategories.map((category) => ({ category: category.slug }));
}

export default async function CategoryShopPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const categoryData = devotionalCategories.find((item) => item.slug === category);
  if (!categoryData) notFound();
  const products = getProductsByCategory(category);

  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Link href="/shop" className="mb-8 inline-block text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-black-deep">Back To Shop</Link>
        <p className="eyebrow text-grey-stone">{categoryData.name}</p>
        <h1 className="section-title max-w-5xl text-black-deep">{categoryData.description}</h1>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <DevotionalProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
