// (c) Delta Software 2023, rights reserved.

import { useParams } from "react-router-dom";
import ProfileForm from "../components/forms/ProfileForm";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { useUrlFile } from "../lib/files";
import { ILink, IUser } from "../types";

export default function ViewProfile() {
  const { id } = useParams<{ id: string }>();
  const { response: user } = useAxios<IUser>({
    url: `user/${id}`,
    method: "GET",
  });
  const { response: links } = useAxios<{
    links: ILink[];
  }>({
    url: `user/links/${id}`,
    method: "GET",
  });

  const fileUrl = useUrlFile();
  return (
    <Wrapper>
      <div>
        {user && links && (
          <div className="max-h-96">
            <ProfileForm
              isEdit={false}
              isManager={false}
              initialUser={{
                ...user,
                imageUrl: fileUrl(user.imageUrl as string),
              }}
              links={links.links}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
}
