import BaseLayout from "./BaseLayout";
import Board from "../components/board/Board";
import PageLoader from "../components/PageLoader";
import { useAppContext } from "../state/appContext";

const BoardPage = () => {
  const { error, isLoading, boardColumns } = useAppContext();

  if (error || !boardColumns) {
    return <h1>Failed to fetch board columns</h1>;
  }

  return (
    <BaseLayout title={<h1>Board Page</h1>}>
      <>
        {isLoading && <PageLoader />}
        {!!boardColumns.length && <Board columns={boardColumns} />}
      </>
    </BaseLayout>
  );
};

export default BoardPage;
