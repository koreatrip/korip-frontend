export type District = {
  name: string;
  count: number;
};

export type CityData = {
  total: number;
  districts: District[];
};

export type LocationData = {
  [key: string]: CityData;
};

export const locationData: LocationData = {
  서울: {
    total: 58890,
    districts: [
      {
        name: '강남구',
        count: 18183,
      },
      {
        name: '강동구',
        count: 1899,
      },
      {
        name: '강북구',
        count: 643,
      },
      {
        name: '강서구',
        count: 3639,
      },
      {
        name: '관악구',
        count: 2060,
      },
      {
        name: '광진구',
        count: 1553,
      },
      {
        name: '구로구',
        count: 3443,
      },
      {
        name: '금천구',
        count: 4330,
      },
      {
        name: '노원구',
        count: 875,
      },
      {
        name: '도봉구',
        count: 471,
      },
      {
        name: '동대문구',
        count: 1168,
      },
      {
        name: '동작구',
        count: 1303,
      },
      {
        name: '마포구',
        count: 4330,
      },
      {
        name: '서대문구',
        count: 1161,
      },
      {
        name: '서초구',
        count: 0,
      },
      {
        name: '성동구',
        count: 0,
      },
      {
        name: '성북구',
        count: 0,
      },
      {
        name: '송파구',
        count: 0,
      },
      {
        name: '양천구',
        count: 0,
      },
      {
        name: '영등포구',
        count: 0,
      },
      {
        name: '용산구',
        count: 0,
      },
      {
        name: '은평구',
        count: 0,
      },
      {
        name: '종로구',
        count: 0,
      },
      {
        name: '중구',
        count: 0,
      },
      {
        name: '중랑구',
        count: 0,
      },
    ],
  },
  경기: {
    total: 50652,
    districts: [
      {
        name: '가평군',
        count: 0,
      },
      {
        name: '고양시',
        count: 4200,
      },
      {
        name: '과천시',
        count: 0,
      },
      {
        name: '광명시',
        count: 0,
      },
      {
        name: '광주시',
        count: 0,
      },
      {
        name: '구리시',
        count: 0,
      },
      {
        name: '군포시',
        count: 0,
      },
      {
        name: '김포시',
        count: 0,
      },
      {
        name: '남양주시',
        count: 2200,
      },
      {
        name: '동두천시',
        count: 0,
      },
      {
        name: '부천시',
        count: 3200,
      },
      {
        name: '성남시',
        count: 4800,
      },
      {
        name: '수원시',
        count: 5200,
      },
      {
        name: '시흥시',
        count: 0,
      },
      {
        name: '안산시',
        count: 2800,
      },
      {
        name: '안성시',
        count: 0,
      },
      {
        name: '안양시',
        count: 2500,
      },
      {
        name: '양주시',
        count: 0,
      },
      {
        name: '양평군',
        count: 0,
      },
      {
        name: '여주시',
        count: 0,
      },
      {
        name: '연천군',
        count: 0,
      },
      {
        name: '오산시',
        count: 0,
      },
      {
        name: '용인시',
        count: 3800,
      },
      {
        name: '의왕시',
        count: 0,
      },
      {
        name: '의정부시',
        count: 0,
      },
      {
        name: '이천시',
        count: 0,
      },
      {
        name: '파주시',
        count: 0,
      },
      {
        name: '평택시',
        count: 0,
      },
      {
        name: '포천시',
        count: 0,
      },
      {
        name: '하남시',
        count: 0,
      },
      {
        name: '화성시',
        count: 0,
      },
    ],
  },
  인천: {
    total: 8700,
    districts: [
      {
        name: '강화군',
        count: 0,
      },
      {
        name: '계양구',
        count: 1100,
      },
      {
        name: '남동구',
        count: 1800,
      },
      {
        name: '동구',
        count: 600,
      },
      {
        name: '미추홀구',
        count: 900,
      },
      {
        name: '부평구',
        count: 1600,
      },
      {
        name: '서구',
        count: 1400,
      },
      {
        name: '연수구',
        count: 1200,
      },
      {
        name: '옹진군',
        count: 0,
      },
      {
        name: '중구',
        count: 0,
      },
    ],
  },
  부산: {
    total: 12837,
    districts: [
      {
        name: '강서구',
        count: 0,
      },
      {
        name: '금정구',
        count: 1000,
      },
      {
        name: '기장군',
        count: 0,
      },
      {
        name: '남구',
        count: 1600,
      },
      {
        name: '동구',
        count: 0,
      },
      {
        name: '동래구',
        count: 1800,
      },
      {
        name: '부산진구',
        count: 2200,
      },
      {
        name: '북구',
        count: 1400,
      },
      {
        name: '사상구',
        count: 1200,
      },
      {
        name: '사하구',
        count: 0,
      },
      {
        name: '서구',
        count: 0,
      },
      {
        name: '수영구',
        count: 0,
      },
      {
        name: '연제구',
        count: 800,
      },
      {
        name: '영도구',
        count: 0,
      },
      {
        name: '중구',
        count: 0,
      },
      {
        name: '해운대구',
        count: 2500,
      },
    ],
  },
  대구: {
    total: 7761,
    districts: [
      {
        name: '군위군',
        count: 0,
      },
      {
        name: '남구',
        count: 900,
      },
      {
        name: '달서구',
        count: 261,
      },
      {
        name: '달성군',
        count: 0,
      },
      {
        name: '동구',
        count: 1200,
      },
      {
        name: '북구',
        count: 1100,
      },
      {
        name: '서구',
        count: 1000,
      },
      {
        name: '수성구',
        count: 1800,
      },
      {
        name: '중구',
        count: 1500,
      },
    ],
  },
  광주: {
    total: 3431,
    districts: [
      {
        name: '광산구',
        count: 831,
      },
      {
        name: '남구',
        count: 700,
      },
      {
        name: '동구',
        count: 500,
      },
      {
        name: '북구',
        count: 600,
      },
      {
        name: '서구',
        count: 800,
      },
    ],
  },
  대전: {
    total: 4588,
    districts: [
      {
        name: '대덕구',
        count: 888,
      },
      {
        name: '동구',
        count: 700,
      },
      {
        name: '서구',
        count: 1000,
      },
      {
        name: '유성구',
        count: 1200,
      },
      {
        name: '중구',
        count: 800,
      },
    ],
  },
  울산: {
    total: 3281,
    districts: [
      {
        name: '남구',
        count: 900,
      },
      {
        name: '동구',
        count: 800,
      },
      {
        name: '북구',
        count: 700,
      },
      {
        name: '울주군',
        count: 381,
      },
      {
        name: '중구',
        count: 500,
      },
    ],
  },
  세종: {
    total: 1356,
    districts: [
      {
        name: '세종시',
        count: 1356,
      },
    ],
  },
  강원: {
    total: 1791,
    districts: [
      {
        name: '강릉시',
        count: 300,
      },
      {
        name: '고성군',
        count: 0,
      },
      {
        name: '동해시',
        count: 200,
      },
      {
        name: '삼척시',
        count: 0,
      },
      {
        name: '속초시',
        count: 241,
      },
      {
        name: '양구군',
        count: 0,
      },
      {
        name: '양양군',
        count: 0,
      },
      {
        name: '영월군',
        count: 0,
      },
      {
        name: '원주시',
        count: 400,
      },
      {
        name: '인제군',
        count: 0,
      },
      {
        name: '정선군',
        count: 0,
      },
      {
        name: '철원군',
        count: 0,
      },
      {
        name: '춘천시',
        count: 500,
      },
      {
        name: '태백시',
        count: 150,
      },
      {
        name: '평창군',
        count: 0,
      },
      {
        name: '홍천군',
        count: 0,
      },
      {
        name: '화천군',
        count: 0,
      },
      {
        name: '횡성군',
        count: 0,
      },
    ],
  },
  충남: {
    total: 11750,
    districts: [
      {
        name: '계룡시',
        count: 0,
      },
      {
        name: '공주시',
        count: 1200,
      },
      {
        name: '금산군',
        count: 0,
      },
      {
        name: '논산시',
        count: 550,
      },
      {
        name: '당진시',
        count: 1500,
      },
      {
        name: '보령시',
        count: 1000,
      },
      {
        name: '부여군',
        count: 0,
      },
      {
        name: '서산시',
        count: 2000,
      },
      {
        name: '서천군',
        count: 0,
      },
      {
        name: '아산시',
        count: 2500,
      },
      {
        name: '예산군',
        count: 0,
      },
      {
        name: '천안시',
        count: 3000,
      },
      {
        name: '청양군',
        count: 0,
      },
      {
        name: '태안군',
        count: 0,
      },
      {
        name: '홍성군',
        count: 0,
      },
    ],
  },
  경북: {
    total: 8086,
    districts: [
      {
        name: '경산시',
        count: 0,
      },
      {
        name: '경주시',
        count: 1500,
      },
      {
        name: '고령군',
        count: 0,
      },
      {
        name: '구미시',
        count: 1200,
      },
      {
        name: '김천시',
        count: 800,
      },
      {
        name: '문경시',
        count: 0,
      },
      {
        name: '봉화군',
        count: 0,
      },
      {
        name: '상주시',
        count: 886,
      },
      {
        name: '성주군',
        count: 0,
      },
      {
        name: '안동시',
        count: 1000,
      },
      {
        name: '영덕군',
        count: 0,
      },
      {
        name: '영양군',
        count: 0,
      },
      {
        name: '영주시',
        count: 700,
      },
      {
        name: '영천시',
        count: 0,
      },
      {
        name: '예천군',
        count: 0,
      },
      {
        name: '울릉군',
        count: 0,
      },
      {
        name: '울진군',
        count: 0,
      },
      {
        name: '의성군',
        count: 0,
      },
      {
        name: '청도군',
        count: 0,
      },
      {
        name: '청송군',
        count: 0,
      },
      {
        name: '칠곡군',
        count: 0,
      },
      {
        name: '포항시',
        count: 2000,
      },
    ],
  },
  충북: {
    total: 0,
    districts: [
      {
        name: '괴산군',
        count: 0,
      },
      {
        name: '단양군',
        count: 0,
      },
      {
        name: '보은군',
        count: 0,
      },
      {
        name: '영동군',
        count: 0,
      },
      {
        name: '옥천군',
        count: 0,
      },
      {
        name: '음성군',
        count: 0,
      },
      {
        name: '제천시',
        count: 0,
      },
      {
        name: '증평군',
        count: 0,
      },
      {
        name: '진천군',
        count: 0,
      },
      {
        name: '청주시',
        count: 0,
      },
      {
        name: '충주시',
        count: 0,
      },
    ],
  },
  경남: {
    total: 0,
    districts: [
      {
        name: '거제시',
        count: 0,
      },
      {
        name: '거창군',
        count: 0,
      },
      {
        name: '고성군',
        count: 0,
      },
      {
        name: '김해시',
        count: 0,
      },
      {
        name: '남해군',
        count: 0,
      },
      {
        name: '밀양시',
        count: 0,
      },
      {
        name: '사천시',
        count: 0,
      },
      {
        name: '산청군',
        count: 0,
      },
      {
        name: '양산시',
        count: 0,
      },
      {
        name: '의령군',
        count: 0,
      },
      {
        name: '진주시',
        count: 0,
      },
      {
        name: '창녕군',
        count: 0,
      },
      {
        name: '창원시',
        count: 0,
      },
      {
        name: '통영시',
        count: 0,
      },
      {
        name: '하동군',
        count: 0,
      },
      {
        name: '함안군',
        count: 0,
      },
      {
        name: '함양군',
        count: 0,
      },
      {
        name: '합천군',
        count: 0,
      },
    ],
  },
  전북: {
    total: 0,
    districts: [
      {
        name: '고창군',
        count: 0,
      },
      {
        name: '군산시',
        count: 0,
      },
      {
        name: '김제시',
        count: 0,
      },
      {
        name: '남원시',
        count: 0,
      },
      {
        name: '무주군',
        count: 0,
      },
      {
        name: '부안군',
        count: 0,
      },
      {
        name: '순창군',
        count: 0,
      },
      {
        name: '완주군',
        count: 0,
      },
      {
        name: '익산시',
        count: 0,
      },
      {
        name: '임실군',
        count: 0,
      },
      {
        name: '장수군',
        count: 0,
      },
      {
        name: '전주시',
        count: 0,
      },
      {
        name: '정읍시',
        count: 0,
      },
      {
        name: '진안군',
        count: 0,
      },
    ],
  },
  전남: {
    total: 0,
    districts: [
      {
        name: '강진군',
        count: 0,
      },
      {
        name: '고흥군',
        count: 0,
      },
      {
        name: '곡성군',
        count: 0,
      },
      {
        name: '광양시',
        count: 0,
      },
      {
        name: '구례군',
        count: 0,
      },
      {
        name: '나주시',
        count: 0,
      },
      {
        name: '담양군',
        count: 0,
      },
      {
        name: '목포시',
        count: 0,
      },
      {
        name: '무안군',
        count: 0,
      },
      {
        name: '보성군',
        count: 0,
      },
      {
        name: '순천시',
        count: 0,
      },
      {
        name: '신안군',
        count: 0,
      },
      {
        name: '여수시',
        count: 0,
      },
      {
        name: '영광군',
        count: 0,
      },
      {
        name: '영암군',
        count: 0,
      },
      {
        name: '완도군',
        count: 0,
      },
      {
        name: '장성군',
        count: 0,
      },
      {
        name: '장흥군',
        count: 0,
      },
      {
        name: '진도군',
        count: 0,
      },
      {
        name: '함평군',
        count: 0,
      },
      {
        name: '해남군',
        count: 0,
      },
      {
        name: '화순군',
        count: 0,
      },
    ],
  },
  제주: {
    total: 0,
    districts: [
      {
        name: '서귀포시',
        count: 0,
      },
      {
        name: '제주시',
        count: 0,
      },
    ],
  },
};
