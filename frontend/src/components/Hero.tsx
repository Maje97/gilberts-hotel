
export default function Hero() {
    return (
        <div className="h-96 bg-center bg-cover bg-[url('../src/assets/gilberthero.jpg')]">
            <div className="h-full text-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex flex-col justify-end">
                <h1 className="text-3xl font-bold">Gilbert´s Hotel</h1>
                <p className="italic text-lg mb-2">Where a cockroach in the barthroom is to be expected.</p>
            </div>
        </div>
    );
}