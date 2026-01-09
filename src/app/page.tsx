import api from "@/lib/axios";

export default async function Home() {
  const getProducts = await api.get('products');
  console.log("Return Products:", getProducts.data);

  return (
    <div>
      <h1>AD Commerce Web</h1>
    </div>
  );
}
