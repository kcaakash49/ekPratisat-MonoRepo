export default function CategoryCard({ img, type }: { img: string; type: string }) {
  return (
    <div className="w-full border-2 border-black rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-[7/5]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}${img})` }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-bold font-custom text-xl text-center">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}
