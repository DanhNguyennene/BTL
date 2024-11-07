const FeaturedAuthors = ({ authors }) => {
  return (
    <div className="mb-16 bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Featured Authors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-full w-full h-full object-cover border-2 border-white shadow-lg"
                />
              </div>
              <h3 className="font-medium text-gray-800">{author.name}</h3>
              <p className="text-sm text-gray-600">{author.bookCount} books</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FeaturedAuthors;