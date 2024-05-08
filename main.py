from fastapi import FastAPI , UploadFile , Form ,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3


# SQLite 데이터베이스 연결 및 커서 생성
con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

app = FastAPI()

# 비밀키 설정
SERCRET = 'super-coding'
manager = LoginManager(SERCRET, '/login')

# 사용자 정보 조회 함수
@manager.user_loader()
def query_user(id):
    # 컬럼명도 결과에 포함되도록 설정
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    user = cur.execute(f"SELECT * from users WHERE id='{id}'").fetchone()
    return user

# 로그인 엔드포인트
@app.post('/login')
def login(id: Annotated[str, Form()],
          password: Annotated[str, Form()]):
    user = query_user(id)
    # 유저가 없거나 비밀번호가 틀린 경우 에러 발생
    if not user or password != user['password']:
        raise InvalidCredentialsException
    
    access_token = manager.create_access_token(data={
        'id': user['id'],
        'name': user['name'],
        'email': user['email']
    })
    
    return {'access_token': access_token}

# 회원가입 엔드포인트
@app.post('/signup')
def signup(id: Annotated[str, Form()],
           password: Annotated[str, Form()],
           name: Annotated[str, Form()],
           email: Annotated[str, Form()]):
    cur.execute(f"INSERT INTO users(id,name,email,password) VALUES ('{id}','{name}','{email}','{password}')")
    con.commit()
    return '200'

# items 테이블 생성. 없으면 새로 생성
cur.execute("""
        CREATE TABLE IF NOT EXISTS items (
	        id INTEGER PRIMARY KEY,
	        title TEXT NOT NULL,
	        image BLOB,
	        price INTEGER NOT NULL,
	        description TEXT,
	        place TEXT NOT NULL,
	        insertAt INTEGER NOT NULL
            );
            """)



# 항목 생성 엔드포인트. 이미지와 다른 정보를 폼 데이터로 받아 데이터베이스에 저장
@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str,Form()], 
                price:Annotated[int,Form()] , 
                description: Annotated[str,Form()], 
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()]
                ):
    
    image_bytes = await image.read() # 이미지 파일을 바이트로 읽음
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """) # 데이터베이스에 항목 정보 저장
    con.commit() # 변경사항 커밋
    return '200' # 성공 응답 반환
    
    
# 모든 항목 정보 조회 엔드포인트
@app.get('/items')
async def get_items():
    # 컬럼명도 결과에 포함되도록 설정
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                        SELECT * FROM items;
                        """).fetchall() # 모든 항목 정보 조회
    return JSONResponse(jsonable_encoder(dict(row) for row in rows)) # 조회 결과를 JSON으로 응답


# 특정 항목의 이미지 조회 엔드포인트
@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id ={item_id}
                              """).fetchone()[0] # 해당 ID의 이미지 바이트 조회
    
    return Response(content=bytes.fromhex(image_bytes)) # 이미지 바이트를 응답으로 반환
        
        
# 프론트엔드 파일을 제공하는 정적 파일 서버 마운트
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
