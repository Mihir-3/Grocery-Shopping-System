export default function Category() {
  const categories = ["Fruits", "Vegetables", "Dairy", "Snacks"];

  return (
    <div className="category">
      {categories.map(c => (
        <div key={c} className="cat-card">{c}</div>
      ))}
    </div>
  );
}