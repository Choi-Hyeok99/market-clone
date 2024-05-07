// "write-form" ID를 가진 form 요소를 선택합니다.
const form = document.getElementById("write-form");

// form 제출 이벤트를 처리하는 비동기 함수를 정의합니다.
const handleSubmitForm = async (event) => {
  // 기본 form 제출 동작을 방지합니다.
  event.preventDefault();
  try {
    // "/items" 경로로 POST 요청을 보냅니다. 요청 본문에는 form 데이터가 포함됩니다.
    const res = await fetch("/items", {
      method: "POST",
      body: new FormData(form),
    });
    // 서버로부터 받은 응답을 JSON 형식으로 변환합니다.
    const data = await res.json();
    // 응답 데이터가 "200"이면, 사용자를 메인 페이지("/")로 리다이렉트합니다.
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    // 오류가 발생한 경우 콘솔에 로그를 출력합니다.
    console.error(e);
  }
};

// "submit" 이벤트가 발생했을 때 handleSubmitForm 함수를 호출하도록
// form 요소에 이벤트 리스너를 추가합니다.
form.addEventListener("submit", handleSubmitForm);

