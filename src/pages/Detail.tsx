import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// (2) Detail.tsx 생성
const Detail: React.FC<any> = () => {
  const params = useParams();

  const [data, setData] = useState<{
    email: string;
    contents: string;
    isDeleted: boolean;
    id: number;
  }>({
    email: "",
    contents: "",
    isDeleted: false,
    id: 0,
  });

  const [comments, setComments] = useState<string>("");

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

  const fetchData = async () => {
    try {
      // TODO: 데이터베이스에서 boards 리스트 가져오기
      const response = await axios.get(
        `http://localhost:4000/boards?isDeleted=${false}&id=${params.id}`
      );
      // TODO: 가져온 결과 배열을 data state에 set 하기
      setData(response.data[0]);

      //   데이터베이스에서 comments 리스트 가져오기
      const responseComments = await axios.get(
        `http://localhost:4000/comments?isDeleted=${false}&boardId=${params.id}`
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

  //   // (1) 삭제기능구현(별도 함수 handleDeleteButtonClick 선언하여 대입)
  //   const handleDeleteButtonClick = (id: number) => {
  //     try {
  //       // (1-1) patch로 구현(isDeleted 사용) : 이 때, 리스트 중 삭제된 것은 보이면 안됨
  //       axios.patch(`http://localhost:4000/boards/${id}`, { isDeleted: true });

  //       // (3) 성공 시, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
  //       alert(
  //         "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
  //       );

  //       // (4) 수동 갱신(reload)
  //       window.location.reload();
  //     } catch (error) {
  //       // (2) 예측치 못한 오류 발생 시, "데이터를 삭제하는 데에 오류가 발생하였습니다." alert
  //       alert("데이터를 삭제하는 데에 오류가 발생하였습니다.");
  //     }
  //   };

  const handlerAddComment = async () => {
    try {
      // (2) db.json에 reviews 추가 -boardId - email - contents - isDeleted
      // (3) 방명록과 유사하게 댓글 기능 추가
      await axios.post(`http://localhost:4000/comments`, {
        boardId: params.id,
        email,
        contents: comments,
        isDeleted: false,
      });

      // (3) 성공 시, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
      alert(
        "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );

      // (4) 수동 갱신(reload)
      window.location.reload();
    } catch (error) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  return (
    <MainWrapper>
      <Link to={`/`}>
        <Button>홈으로</Button>
      </Link>
      <h1>상세페이지</h1>
      <ListWrapper>
        {/* (4) Detail.tsx에서는 본문내용, 작성자 이메일 출력 */}
        <h3>작성자 : {data.contents}</h3>
        <h3>이메일 : {email}</h3>
        {/* (5) 작성자와 로그인 한 유저가 일치하는 경우, 삭제버튼 활성화(디자인 알아서) */}
        {data.email === email && <Button>삭제</Button>}
        {/* (1) 댓글 입력 필드 생성 */}
        <Input
          placeholder="댓글을 입력해 주세요"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        ></Input>
        <Button onClick={handlerAddComment}>입력</Button>
        {commentsData.map((comment, index) => {
          return (
            <ListItem key={comment.id}>
              <p>{index + 1}</p>
              <p>이메일 : {comment.email}</p>
              <p>내용 : {comment.contents}</p>
            </ListItem>
          );
        })}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Detail;

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
