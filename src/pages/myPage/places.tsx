const FavoritePlacesPage = () => {
  const favoritePlaces = [
    { id: 1, name: '경복궁', description: '서울의 대표 궁궐입니다.' },
    {
      id: 2,
      name: '해운대 해수욕장',
      description: '부산의 아름다운 해변입니다.',
    },
  ];

  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>즐겨찾는 장소</h2>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {favoritePlaces.map((place) => (
          <li key={place.id} className='rounded-lg border p-4 shadow-sm'>
            <h3 className='text-lg font-bold'>{place.name}</h3>
            <p className='text-sm text-gray-600'>{place.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritePlacesPage;
