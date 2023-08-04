import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const Main: React.FC<any> = () => {
  const [data, setData] = useState([]);
  const [contents, setContents] = useState<string>("");

  const [commentsData, setCommentsData] = useState<
    [
      {
        boardId: string;
        email: string;
        contents: string;
        isDeleted: boolean;
        id: number;
      }
    ]
  >([
    {
      boardId: "",
      email: "",
      contents: "",
      isDeleted: false,
      id: 0,
    },
  ]);

  console.log(commentsData);

  const fetchData = async () => {
    try {
      // TODO: 데이터베이스에서 boards 리스트 가져오기
      const response = await axios.get(
        `http://localhost:4000/boards?isDeleted=${false}`
      );
      // TODO: 가져온 결과 배열을 data state에 set 하기
      setData(response.data);

      // 데이터베이스에서 comments 리스트 가져오기
      const responseComments = await axios.get(
        `http://localhost:4000/comments?isDeleted=${false}`
      );
      setCommentsData(responseComments.data);
    } catch (error) {
      // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  useEffect(() => {
    // TODO: 해당 useEffect는 최초 마운트시에만 동작하게 제어
    fetchData();
  }, []);

  const email = window.localStorage.getItem("email");

  const handleBoardSubmit = async (e: any) => {
    // TODO: 자동 새로고침 방지
    e.preventDefault();

    try {
      // TODO: 이메일과 contents를 이용하여 post 요청 등록(isDeleted 기본값은 false)

      await axios.post(`http://localhost:4000/boards`, {
        email,
        contents,
        isDeleted: false,
      });

      // TODO: 성공한 경우, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
      alert(
        "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );
      // TODO: 처리완료 후, reload를 이용하여 새로고침
      window.location.reload();
    } catch (error) {
      // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  const handleInputChange = (e: any) => {
    setContents(e.target.value);
  };

  // (1) 삭제기능구현(별도 함수 handleDeleteButtonClick 선언하여 대입)
  const handleDeleteButtonClick = (id: number) => {
    try {
      // (1-1) patch로 구현(isDeleted 사용) : 이 때, 리스트 중 삭제된 것은 보이면 안됨
      axios.patch(`http://localhost:4000/boards/${id}`, { isDeleted: true });

      // (3) 성공 시, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
      alert(
        "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );

      // (4) 수동 갱신(reload)
      window.location.reload();
    } catch (error) {
      // (2) 예측치 못한 오류 발생 시, "데이터를 삭제하는 데에 오류가 발생하였습니다." alert
      alert("데이터를 삭제하는 데에 오류가 발생하였습니다.");
    }
  };

  return (
    <MainWrapper>
      <h1>메인 리스트 페이지</h1>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput
          placeholder="방명록을 입력해주세요."
          value={contents}
          onChange={handleInputChange}
        />
      </StyledForm>
      <ListWrapper>
        {data.map((item: any, index) => (
          <ListItem key={item.id}>
            <span>
              {index + 1}.
              {/* (1) Main.tsx 리스트 방명록 내용 클릭 가능하게 구현 */}
              <Link to={`/detail/${item.id}`}>{item.contents}</Link>
            </span>
            {email === item.email && (
              //  TODO: 로그인 한 user의 이메일과 일치하는 경우에만 삭제버튼 보이도록 제어
              <Button onClick={() => handleDeleteButtonClick(item.id)}>
                삭제
              </Button>
            )}
            댓글
            {/* (1) 댓글 개수를 방명록 contents 옆에 (2) 형태로 출력 */}
            {
              commentsData.filter(
                (comment) => comment.boardId === item.id.toString()
              ).length
            }
            개
          </ListItem>
        ))}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Main;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;
