import Layout from "./layout/Layout";

function Blank() {
  return (
    <Layout>
      <main className="h-full pb-16 overflow-y-auto">
        {/* <!-- Remove everything INSIDE this div to a really blank page --> */}
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Blank
          </h2>
        </div>
      </main>
    </Layout>
  );
}

export default Blank;
