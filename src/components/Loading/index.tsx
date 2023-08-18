import { CircularProgress } from "@chakra-ui/react";
import * as S from "./styles";

const Loading = () => {
  return (
    <S.Container>
      <CircularProgress
        isIndeterminate
        color="#21254e"
        size="100px"
        thickness="8px"
      />
    </S.Container>
  );
};

export default Loading;
