// (c) Delta Software 2023, rights reserved.
import ListGroup from "../components/groups/ListGroup";
import Wrapper from "../containers/Wrapper";

export default function Groups(): JSX.Element {
  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            Groups
          </h1>
        </div>

        <div className=" grid sm:grid-cols-2 xl:grid-cols-4 place-items-center gap-10">
          <ListGroup
            groups={[
              {
                id: "1",
                name: "Group 1",
                progress: 50,
                image: "https://picsum.photos/200",
              },
              {
                id: "2",
                name: "Group 2",
                progress: 80,
                image: "https://picsum.photos/300",
              },
              {
                id: "3",
                name: "Group 3",
                progress: 100,
                image: "https://picsum.photos/400",
              },
              {
                id: "4",
                name: "Group 4",
                progress: 100,
                image: "https://picsum.photos/500",
              },
            ]}
          />
        </div>
      </div>
    </Wrapper>
  );
}
