export default function HomePage() {
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to PrintLab</h1>
        <p className="text-lg text-gray-600">
          Custom screen printing, DTG, DTF, and embroidery — made easy.
        </p>
        <a
          href="/designer"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Start Designing
        </a>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Our Services</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Screen Printing</li>
            <li>Direct-to-Garment (DTG)</li>
            <li>Direct-to-Film (DTF)</li>
            <li>Embroidery</li>
          </ul>
        </div>

        <div className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>High-quality prints on all garments</li>
            <li>No minimums — order 1 or 1000</li>
            <li>Fast turnaround and great support</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
