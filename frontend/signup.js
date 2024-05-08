// signup-form ID를 가진 HTML 폼 요소를 선택합니다.
const form = document.querySelector("#signup-form");

// 비밀번호 일치 여부를 확인하는 함수입니다.
const checkPassword = () => {
  // 폼 데이터를 가져오기 위해 FormData 객체를 생성합니다.
  const formData = new FormData(form);
  // 폼 데이터에서 "password"와 "password2" 필드 값을 가져옵니다.
  const password1 = formData.get("password");
  const password2 = formData.get("password2");
  
  // 두 비밀번호가 동일한지 비교하여 결과를 반환합니다.
  if (password1 === password2) {
    return true;
  } else return false;
};

// 폼 제출 처리를 위한 비동기 함수입니다.
const handleSubmit = async (event) => {
  // 폼의 기본 제출 동작을 방지합니다.
  event.preventDefault();
  // 폼 데이터를 다시 가져옵니다.
  const formData = new FormData(form);
  // 비밀번호를 SHA-256으로 해싱합니다. (sha256 함수는 별도로 구현되어 있어야 합니다)
  const sha256Password = sha256(formData.get("password"));
  // 해싱된 비밀번호로 원본 비밀번호를 교체합니다.
  formData.set("password", sha256Password);
  // 변경된 비밀번호를 콘솔에 출력합니다. (디버깅 목적)
  console.log(formData.get("password"));

  // 정보를 표시할 div 요소를 선택합니다.
  const div = document.querySelector("#info");

  // 비밀번호 일치 여부를 확인합니다.
  if (checkPassword()) {
    // 비밀번호가 일치하면 서버에 회원가입 요청을 보냅니다.
    const res = await fetch("/signup", {
      method: "post",
      body: formData,
    });
    // 서버의 응답을 JSON 형태로 파싱합니다.
    const data = await res.json();
    // 응답 코드가 "200"이면 회원가입 성공 메시지를 표시하고, 로그인 페이지로 이동합니다.
    if (data === "200") {
      alert("회원가입에 성공했습니다.");
      window.location.pathname = "/login.html";
    }
  } else {
    // 비밀번호가 일치하지 않으면 오류 메시지를 표시합니다.
    div.innerText = "비밀번호가 같지 않습니다.";
    div.style.color = "red";
  }
};

// 폼의 submit 이벤트에 handleSubmit 함수를 연결합니다.
form.addEventListener("submit", handleSubmit);
