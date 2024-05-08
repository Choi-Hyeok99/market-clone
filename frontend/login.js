// 로그인 폼을 DOM에서 선택합니다.
const form = document.querySelector("#login-form");

// 폼 제출을 처리하는 함수를 정의합니다.
const handleSubmit = async (event) => {
  // 폼의 기본 제출 동작을 방지합니다.
  event.preventDefault();
  // 폼 데이터를 새 FormData 객체로 생성합니다.
  const formData = new FormData(form);
  // 비밀번호를 SHA-256으로 해싱합니다.
  const sha256Password = sha256(formData.get("password"));
  // 해싱된 비밀번호로 원래 비밀번호를 대체합니다.
  formData.set("password", sha256Password);

  // 서버에 로그인 요청을 비동기적으로 전송합니다.
  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  // 응답으로 받은 데이터를 JSON 형태로 변환합니다.
  const data = await res.json();
  const accessToken = data.access_token;
  window.localStorage.setItem("token", accessToken);
  alert("로그인 되엇습니다.");

  window.location.pathname = "/";
};

// 폼에 제출 이벤트 리스너를 추가합니다. 이벤트가 발생하면 handleSubmit 함수를 호출합니다.
form.addEventListener("submit", handleSubmit);
