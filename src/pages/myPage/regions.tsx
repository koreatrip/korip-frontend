const FavoriteRegionsPage = () => {
  const favoriteRegions = [
    { id: 1, name: '서울특별시' },
    { id: 2, name: '부산광역시' },
    { id: 3, name: '전라남도 순천시' },
  ];

  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>즐겨찾는 지역</h2>
      <ul className='space-y-3'>
        {favoriteRegions.map((region) => (
          <li
            key={region.id}
            className='rounded-md border p-3 transition hover:bg-gray-50'
          >
            {region.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteRegionsPage;
