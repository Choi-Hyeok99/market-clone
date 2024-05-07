// 한국 시간(UTC+9) 기준으로 현재로부터 얼마나 이전인지 시간을 계산하는 함수
const calcTime = (timestamp) => {
    // 현재 시간에서 9시간(한국 시간차)을 뺀 시간 계산
    const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
    // 주어진 timestamp와 현재 시간의 차이를 계산
    const time = new Date(curTime - timestamp);
    // 시, 분, 초를 각각 추출
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
  
    // 시간, 분, 초에 따라 문자열 반환
    if (hour > 0) return `${hour}시간 전`;
    else if (minute > 0) return `${minute}분 전`;
    else if (second > 0) return `${second}초 전`;
    else return "방금전";
  };
  
  // 서버에서 받은 데이터를 화면에 렌더링하는 함수
  const renderData = (data) => {
    // 'main' 태그 선택
    const main = document.querySelector("main");
    // 데이터를 역순으로 반복 처리
    data.reverse().forEach(async (obj) => {
      // 각 항목의 컨테이너 생성
      const div = document.createElement("div");
      div.className = "item-list";
  
      // 이미지를 담을 div 생성
      const imgDiv = document.createElement("div");
      imgDiv.className = "item-list__img";
  
      // 이미지 태그 생성 및 이미지 로드
      const img = document.createElement("img");
      const res = await fetch(`/images/${obj.id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      img.src = url;
  
      // 정보를 담을 div 생성
      const InfoDiv = document.createElement("div");
      InfoDiv.className = "item-list__info";
  
      // 제목을 담을 div 생성 및 텍스트 설정
      const InfoTitleDiv = document.createElement("div");
      InfoTitleDiv.className = "item-list__info-title";
      InfoTitleDiv.innerText = obj.title;
  
      // 메타정보(장소, 시간)를 담을 div 생성 및 텍스트 설정
      const InfoMetaDiv = document.createElement("div");
      InfoMetaDiv.className = "item-list__info-meta";
      InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);
  
      // 가격을 담을 div 생성 및 텍스트 설정
      const InfoPriceDiv = document.createElement("div");
      InfoPriceDiv.className = "item-list__info-price";
      InfoPriceDiv.innerText = obj.price;
  
      // div들을 적절히 조합하여 main에 추가
      imgDiv.appendChild(img);
      InfoDiv.appendChild(InfoTitleDiv);
      InfoDiv.appendChild(InfoMetaDiv);
      InfoDiv.appendChild(InfoPriceDiv);
      div.appendChild(imgDiv);
      div.appendChild(InfoDiv);
      main.appendChild(div);
    });
  };
  
  // 서버에서 아이템 리스트를 가져와서 렌더링하는 함수
  const fetchList = async () => {
    // '/items' 경로에서 데이터를 가져옴
    const res = await fetch("/items");
    const data = await res.json();
    // 가져온 데이터로 렌더링 함수 호출
    renderData(data);
  };
  
  // 아이템 리스트를 가져와서 화면에 렌더링하는 함수 실행
  fetchList();
  