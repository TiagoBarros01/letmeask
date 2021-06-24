/* eslint-disable no-alert */
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import DeleteImg from '../../assets/images/delete.svg';
import { Button } from '../../components/Button';
import { LogoSvg } from '../../components/LogoSvg';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
// import { database } from '../../services/firebase';
import {
  Wrapper,
  Content,
  ButtonsContent,
  Main,
  TitleContainer,
  List,
} from './styles';

type RoomParams = {
  id: string;
};

export default function AdminRoom(): JSX.Element {
  // const { user } = useAuth();
  const history = useHistory();
  const { id: roomId } = useParams<RoomParams>();

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Are you sure you want to delete this question')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  return (
    <Wrapper>
      <header>
        <Content>
          <LogoSvg />
          <ButtonsContent>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Close room</Button>
          </ButtonsContent>
        </Content>
      </header>
      <Main>
        <TitleContainer>
          <h1>
            Room
            {' '}
            {title}
          </h1>
          {questions.length > 0 && (
          <span>
            {questions.length}
            {' '}
            question(s)
          </span>
          )}
        </TitleContainer>
        <List>
          {questions.map((question) => (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={DeleteImg} alt="Remove question" />
              </button>
            </Question>
          ))}
        </List>
      </Main>
    </Wrapper>
  );
}
