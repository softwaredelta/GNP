// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import ProfileForm from "../components/forms/ProfileForm";
import useAxios from "../hooks/useAxios";
import { ILink, IUser } from "../types";
import { useUrlFile } from "../lib/files";

export default function MyProfile() {
  const { response: user } = useAxios<IUser>({
    url: `user/me`,
    method: "GET",
  });

  const { response: links } = useAxios<{
    links: ILink[];
  }>({
    url: `user/my-links/${user?.email}`,
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
