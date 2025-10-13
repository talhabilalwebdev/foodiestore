export default function BlogCard({ img, title, category, link }) {
  return (
    <a href={link} className="w-64 border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img src={img} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <p className="text-sm text-gray-500">{category}</p>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
    </a>
  );
}
